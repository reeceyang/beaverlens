"use client";

import { useEffect, useState } from "react";
import { Confession, SearchRequest } from "./api/search/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { SortOption } from "./types";
import ConfessionCard from "../components/ConfessionCard";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export const BOT_INVITE =
  "https://discord.com/api/oauth2/authorize?client_id=972229072128204861&permissions=2147485696&scope=bot";
export const SERVER_INVITE = "https://discord.gg/8g3wqgKfmc";

export default function Home() {
  const router = useRouter()

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<Confession>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const HOME_NUM_RESULTS = "10";

  const getRecentConfessions = async () => {
    const searchObj: SearchRequest = {
      query: "",
      num: HOME_NUM_RESULTS,
      sort: SortOption.NONE,
    };
    setIsLoading(true);
    setResults(
      (
        await fetch("/api/search?" + new URLSearchParams(searchObj)).then(
          (res) => {
            setIsLoading(false);
            return res.json();
          }
        )
      ).confessions
    );
  };

  useEffect(() => {
    getRecentConfessions();
  }, [])

  const goSearch = () => {
    router.push("/search?" + new URLSearchParams({ query: searchText }))
  }

  return (
    <>
      <div className="hero min-h-[80vh]">
        <div className="hero-content text-center">
          <div className="max-w-5xl">
            <h1 className="text-5xl font-bold">Explore MIT Confessions!</h1>
            <p className="py-6 max-w-xl m-auto">
              Browse our archive of over 3,000 MIT Confessions, or{" "}
              <a className="link link-hover" href={BOT_INVITE}>
                add our Discord bot
              </a>{" "}
              to automatically forward new confessions to your Discord server.
            </p>
            <input
              placeholder="Search for confessions"
              className="input input-primary"
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  goSearch();
                }
              }}
              onChange={(event) => setSearchText(event.target.value)}
              disabled={isLoading}
              autoFocus
            ></input>
            <button
              className={`btn btn-primary ${isLoading && "loading"} ml-2 mt-2`}
              onClick={goSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="container max-w-5xl p-6 flex flex-row">
        <h1 className="text-5xl font-bold">Recent confessions</h1>
        {results.length > 0 && (
          <p className="mt-auto ml-auto">
            Updated {formatDistanceToNow(new Date(results[0].time))} ago
          </p>
        )}
      </div>
      <div className="carousel space-x-4 p-6 bg-base-200 w-screen">
        {results.map((result) => (
          <div className="carousel-item" key={result._id} id={result._id}>
            <ConfessionCard confession={result} onHomePage={true} />
          </div>
        ))}
      </div>
      <div className="container max-w-5xl p-6">
        <div className="flex justify-center w-full py-2 gap-2">
          {results.map((result, i) => (
            <a href={"#" + result._id} className="btn btn-xs btn-outline">
              {i + 1}
            </a>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link href="/search">
            <button className="btn btn-primary">See more</button>
          </Link>
        </div>
      </div>

      <div className="pattern-bg">
        <div className="bg-[#ffffffcc]">
          <div className="container max-w-5xl px-6 py-12">
            <h1 className="text-5xl font-bold">
              Forward new confessions to Discord
            </h1>
            <div className="flex flex-row flex-wrap-reverse">
              <div className="max-w-md mr-auto">
                <p className="py-6">
                  Invite our Discord bot to your server. As soon as new
                  confessions are posted, the bot will post them to the channel
                  of your choice. Perfect for MIT Confessions fans who aren't
                  fans of Facebook!
                </p>
                <a href={BOT_INVITE}>
                  <button className="btn btn-primary">Invite</button>
                </a>
                <p className="py-6">
                  Join the mitconfesssionsbot community Discord server for
                  support and feature requests.
                </p>
                <a href="https://discord.gg/8g3wqgKfmc">
                  <button className="btn btn-accent">Join</button>
                </a>
              </div>
              <div className="max-w-md py-6 ml-auto">
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="bg-primary rounded-full p-1">
                      <FontAwesomeIcon
                        className="fa-xl translate-y-0.5"
                        icon={faDiscord}
                      />
                    </div>
                  </div>
                  <div className="chat-bubble">/getconfess</div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-bubble">
                    <p>
                      <strong>#6969</strong> You should add the
                      mitconfessionsbot to your Discord Server!
                    </p>
                    <p className="link link-info break-words">
                      https://www.facebook.com/69696969696969
                    </p>
                  </div>
                  <div className="chat-image avatar">
                    <div className="bg-accent rounded-full p-1">
                      <FontAwesomeIcon
                        className="fa-xl translate-y-0.5"
                        icon={faDiscord}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
