import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<{ post_text: string }>>([]);

  return (
    <div className="container">
      <h1 className="text-3xl">Explore MIT Confessions!</h1>
      <input
        placeholder="Search for confessions"
        className="input input-primary"
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            setResults(
              await fetch(
                "/api/confessions?" +
                  new URLSearchParams({ search_text: searchText })
              ).then((res) => res.json())
            );
          }
        }}
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
        value={searchText}
      ></input>
      <main className="prose">
        {results.map((result) => (
          <p>{result.post_text}</p>
        ))}
      </main>
    </div>
  );
}
