"use client";

import { useEffect, useState } from "react";
import { Confession, SearchRequest, SearchResponse } from "../api/search/route";
import { CONFESSIONS_PER_PAGE, SortOption } from "../types";
import ConfessionCard from "../../components/ConfessionCard";

const Spinner = <button className={`btn btn-ghost loading`}></button>;

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<Confession>>([]);
  const [totalNum, setTotalNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFuzzy, setIsFuzzy] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.NONE);
  const [page, setPage] = useState(0);
  const lastPage = Math.ceil(totalNum / CONFESSIONS_PER_PAGE) - 1;

  // https://stackoverflow.com/a/72672732
  useEffect(
    () => {
      // Wait 200ms before copying the value of tempValue into value;
      const timeout = setTimeout(() => {
        setPage(0);
        updateResults();
      }, 200);

      // If the hook is called again, cancel the previous timeout
      // This creates a debounce instead of a delay
      return () => clearTimeout(timeout);
    },
    // Run the hook every time the user makes a keystroke
    [searchText, isFuzzy, sortOption]
  );

  useEffect(() => {
    updateResults();
  }, [page]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("query") ?? "";
    setSearchText(query);
  }, []);

  const updateResults = async () => {
    const searchObj: SearchRequest = {
      query: searchText,
      fuzzy: String(isFuzzy),
      sort: sortOption,
      page: String(page),
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
      <div className="grid grid-cols-2 my-2">
        <div className="form-control">
          <label className="label cursor-pointer m-auto">
            <span className="label-text">Use fuzzy search</span>
            <input
              type="checkbox"
              checked={isFuzzy}
              className="checkbox checkbox-primary ml-2"
              onChange={() => setIsFuzzy(!isFuzzy)}
            />
          </label>
        </div>

        <div className="flex flex-row">
          <span className="label-text my-auto ml-auto mr-2">Sort:</span>
          <select
            className="select select-primary max-w-xs flex-grow"
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
          >
            {Object.values(SortOption).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="container min-h-screen py-6">
        {isLoading && Spinner}
        {results.length > 0 && (
          <p>
            {totalNum} confession{totalNum > 1 && "s"} found
          </p>
        )}
        {results.length > 0 ? (
          results.map((result) => (
            <div className="py-2" key={result._id}>
              <ConfessionCard confession={result} onHomePage={false} />
            </div>
          ))
        ) : (
          <p>no confessions :( try a different search?</p>
        )}
      </div>
      <div className="m-auto w-fit py-2">
        {isLoading && Spinner}
        <button
          className="btn btn-accent"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
        </button>
      </div>
      {/* go to page 1 or go back one page*/}
      <div className="m-auto w-fit py-2">
        {page + 1 !== 1 && (
          <>
            <button className="btn btn-outline mx-1" onClick={() => setPage(0)}>
              1
            </button>
            {/* don't show the arrow if the first page is immediately before */}
            {page + 1 !== 2 && (
              <>
                <span>•••</span>
                <button
                  className="btn btn-outline mx-1"
                  onClick={() => setPage(page - 1)}
                >
                  ◀
                </button>
              </>
            )}
          </>
        )}
        {/* current page */}
        <button className="btn btn-primary mx-1">{page + 1}</button>
        {/* go to last page or go forward one page*/}
        {page !== lastPage && (
          <>
            {/* don't show the arrow if the last page is next */}
            {page !== lastPage - 1 && (
              <>
                <button
                  className="btn btn-outline mx-1"
                  onClick={() => setPage(page + 1)}
                >
                  ▶
                </button>
                <span>•••</span>
              </>
            )}
            <button
              className="btn btn-outline mx-1"
              onClick={() => setPage(lastPage)}
            >
              {lastPage + 1}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
