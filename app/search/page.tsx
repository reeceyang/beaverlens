"use client";

import { useState } from "react";
import { Confession } from "../api/search/route";

export default function Search() {
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

  return <></>;
}
