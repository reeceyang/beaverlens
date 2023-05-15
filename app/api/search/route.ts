import clientPromise from "../../../lib/mongodb";
import assert from "assert";
import { NextRequest, NextResponse } from "next/server";

export interface Confession {
  _id: string;
  post_text: string;
  time: string;
  post_url: string;
}

export type SearchRequest = {
  query: string;
  fuzzy?: string;
  num?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url ?? assert.fail());
    const searchText = searchParams.get("query") ?? assert.fail();

    // default to fuzzy search
    const isFuzzy = searchParams.get("fuzzy") !== "false";

    // default to returning 10 confessions, max of 10 confessions
    const numConfessions = Math.min(Number(searchParams.get("num") ?? 10), 10);

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
    const projection = {
      $project: {
        post_text: 1,
        time: 1,
        post_url: 1,
      },
    };

    const confessions = await db
      .collection("confessions")
      .aggregate([searcher_aggregate, projection])
      .limit(numConfessions)
      .toArray();

    return NextResponse.json(confessions);
  } catch (e) {
    console.error(e);
  }
}
