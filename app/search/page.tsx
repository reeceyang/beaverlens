"use client";

import { useEffect, useState } from "react";
import { Confession, SearchRequest, SearchResponse } from "../api/search/route";
import { ConfessionCard } from "../page";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<Confession>>([]);
  const [totalNum, setTotalNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFuzzy, setIsFuzzy] = useState(true);

  // https://stackoverflow.com/a/72672732
  useEffect(
    () => {
      // Wait 200ms before copying the value of tempValue into value;
      const timeout = setTimeout(() => {
        updateResults();
      }, 200);

      // If the hook is called again, cancel the previous timeout
      // This creates a debounce instead of a delay
      return () => clearTimeout(timeout);
    },
    // Run the hook every time the user makes a keystroke
    [searchText, isFuzzy]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("query") ?? "";
    setSearchText(query);
  }, []);

  const updateResults = async () => {
    const searchObj: SearchRequest = {
      query: searchText,
      fuzzy: String(isFuzzy),
    };
    const url = "/api/search?" + new URLSearchParams(searchObj);
    setIsLoading(true);
    const results: SearchResponse = await fetch(url).then((res) => {
      setIsLoading(false);
      return res.json();
    });
    setResults(results.confessions);
    setTotalNum(results.total_num);
  };

  return (
    <div className="container px-4">
      <h1 className="text-5xl font-bold py-6">Explore MIT Confessions!</h1>
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
          value={searchText}
          autoFocus
        ></input>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Use fuzzy search</span>
          <input
            type="checkbox"
            checked={isFuzzy}
            className="checkbox checkbox-primary"
            onChange={() => setIsFuzzy(!isFuzzy)}
          />
        </label>
      </div>
      <div className="container min-h-screen py-6">
        {isLoading && <button className={`btn btn-ghost loading`}></button>}
        {results.length > 0 && (
          <p>
            {totalNum} confession{totalNum > 1 && "s"} found
          </p>
        )}
        {results.length > 0 ? (
          results.map((result) => (
            <div className="py-2">
              <ConfessionCard confession={result} onHomePage={false} />
            </div>
          ))
        ) : (
          <p>no confessions :( try a different search?</p>
        )}
      </div>
    </div>
  );
}
