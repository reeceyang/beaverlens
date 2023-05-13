import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export interface Confession {
  _id: string;
  post_text: string;
  time: string;
  post_url: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("Cluster0");
    const search_text = req.query.search_text;

    const searcher_aggregate = {
      $search: {
        index: "search_confessions",
        text: {
          query: search_text,
          path: {
            wildcard: "*",
          },
          fuzzy: {},
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
      .limit(10)
      .toArray();

    res.json(confessions);
  } catch (e) {
    console.error(e);
  }
};
