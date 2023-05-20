import clientPromise from "../../../lib/mongodb";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";
import { CONFESSIONS_PER_PAGE, SortOption } from "../../types";

export interface Confession {
  _id: string;
  post_text: string;
  time: string;
  post_url: string;
}

export interface SearchResponse {
  confessions: Array<Confession>;
  total_num: number;
}

export type SearchRequest = {
  query: string;
  fuzzy?: string;
  num?: string;
  page?: string;
  sort: SortOption;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url ?? assert.fail());
    const searchText = searchParams.get("query") ?? assert.fail();
    const isSearch = searchText !== "";

    // default to fuzzy search
    const isFuzzy = searchParams.get("fuzzy") !== "false";

    const META_SORT_OPTION = { $meta: "textScore" };
    const sortParam = searchParams.get("sort") ?? assert.fail();
    let sortOption;
    switch (sortParam) {
      case SortOption.NONE:
        if (isSearch) {
          sortOption = META_SORT_OPTION;
        } else {
          sortOption = -1;
        }
        break;
      case SortOption.TIME_ASC:
        sortOption = 1;
        break;
      case SortOption.TIME_DESC:
        sortOption = -1;
        break;
      default:
        assert.fail();
    }

    // default to first page
    const page = Number(searchParams.get("page") ?? "0");

    // default to returning 10 confessions, max of 10 confessions
    const numConfessions = Math.min(
      Number(searchParams.get("num") ?? CONFESSIONS_PER_PAGE),
      CONFESSIONS_PER_PAGE
    );

    const client = await clientPromise;
    const db = client.db("Cluster0");

    const searcher_aggregate = {
      $search: {
        index: "search_confessions",
        text: {
          query: searchText,
          path: {
            wildcard: "*",
          },
          ...(isFuzzy && { fuzzy: {} }),
        },
      },
    };
    const sort = {
      $sort: { time: sortOption },
    };
    const skip = {
      $skip: page * CONFESSIONS_PER_PAGE,
    };
    const limit = {
      $limit: Math.min(numConfessions, CONFESSIONS_PER_PAGE),
    };
    const projection = {
      $project: {
        post_text: 1,
        time: 1,
        post_url: 1,
      },
    };
    const facet = {
      $facet: {
        confessions: [],
        ...(isSearch && {
          meta: [
            {
              $replaceWith: "$$SEARCH_META",
            },
            {
              $limit: 1,
            },
          ],
        }),
      },
    };

    const dbResponse = await db
      .collection("confessions")
      .aggregate([
        // only search if search text is nonempty
        ...(isSearch ? [searcher_aggregate] : []),
        projection,
        sort,
        skip,
        limit,
        facet,
      ])
      .toArray();

    const { confessions } = dbResponse[0];
    const total_num = isSearch
      ? dbResponse[0].meta[0]?.count?.lowerBound ?? 0 // FIXME: not typesafe
      : await db.collection("confessions").countDocuments();
    const response: SearchResponse = {
      confessions,
      total_num,
    };
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
  }
}
