"use client";

import { useState } from "react";
import { Confession, SearchRequest } from "../api/search/route";
import { ConfessionCard } from "../page";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<Confession>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFuzzy, setIsFuzzy] = useState(true);

  const updateResults = async () => {
    const searchObj: SearchRequest = {
      query: searchText,
      fuzzy: String(isFuzzy),
    };
    setIsLoading(true);
    setResults(
      await fetch("/api/search?" + new URLSearchParams(searchObj)).then(
        (res) => {
          setIsLoading(false);
          return res.json();
        }
      )
    );
  };

  return (
    <div className="container">
      <div className="flex flex-row">
        <input
          placeholder="Search for confessions"
          className="input input-primary w-full"
          onKeyUp={async (event) => {
            if (event.key === "Enter") {
              updateResults();
            }
          }}
          onChange={(event) => setSearchText(event.target.value)}
          disabled={isLoading}
        ></input>
        <button
          className={`btn btn-primary ${isLoading && "loading"} ml-2`}
          onClick={updateResults}
        >
          Search
        </button>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Use fuzzy search</span>
          <input
            type="checkbox"
            checked={isFuzzy}
            className="checkbox checkbox-primary"
            onClick={() => setIsFuzzy(!isFuzzy)}
          />
        </label>
      </div>
      <div className="container min-h-screen py-6">
        {results.length > 0 ? (
          results.map((result) => (
            <div className="py-2">
              <ConfessionCard confession={result} />
            </div>
          ))
        ) : (
          <p>no confessions :( try a different search?</p>
        )}
      </div>
    </div>
  );
}
