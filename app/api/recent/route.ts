import clientPromise from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Cluster0");

    const confessions = await db
      .collection("confessions")
      .find()
      .sort({ time: -1 })
      .project({
        post_text: 1,
        time: 1,
        post_url: 1,
      })
      .limit(10)
      .toArray();

    return NextResponse.json(confessions);
  } catch (e) {
    console.error(e);
  }
}
