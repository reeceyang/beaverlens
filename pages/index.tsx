import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { KeyboardEventHandler, useState } from "react";
import { Confession } from "./api/confessions";

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};

const ConfessionCard = ({ confession }: { confession: Confession }) => {
  const confessionDate = new Date(confession.time);
  const confessionNumber = confession.post_text.split(" ")[0];

  return (
    <div className="card w-96 h-64 bg-base-100 shadow-xl text-ellipsis">
      <div className="card-body">
        <div className="flex flex-row">
          <h2 className="card-title">{confessionNumber}</h2>
          <span className="ml-auto">
            {confessionDate.toLocaleDateString()},&nbsp;
            {confessionDate.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="block h-32 overflow-auto">{confession.post_text}</p>
        <p>
          <a className="link" href={confession.post_url}>
            View on Facebook
          </a>
        </p>
      </div>
    </div>
  );
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<Confession>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateResults = async () => {
    setIsLoading(true);
    setResults(
      await fetch(
        "/api/confessions?" +
          new URLSearchParams({
            search_text: searchText,
          })
      ).then((res) => {
        setIsLoading(false);
        return res.json();
      })
    );
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-5xl">
            <h1 className="text-5xl font-bold">Explore MIT Confessions!</h1>
            <p className="py-6">
              Browse our archive of over 3,000 MIT Confessions, or add our
              Discord bot to automatically forward new confessions to your
              Discord server.
            </p>
            <input
              placeholder="Search for confessions"
              className="input input-primary"
              onKeyUp={async (event) => {
                if (event.key === "Enter") {
                  updateResults();
                }
              }}
              onChange={(event) => setSearchText(event.target.value)}
              disabled={isLoading}
            ></input>
            <button
              className={`btn ${isLoading && "loading"} ml-2`}
              onClick={updateResults}
            >
              Search
            </button>
            <div className="carousel max-w-5xl py-6">
              {results.map((result) => (
                <div className="carousel-item px-2">
                  <ConfessionCard confession={result} />
                </div>
              ))}
            </div>
            <p>Advanced Options</p>
          </div>
        </div>
      </div>
    </>
  );
}
