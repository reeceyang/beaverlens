"use client";

import { useState } from "react";
import { Confession } from "./api/search/route";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

export const BOT_INVITE =
  "https://discord.com/api/oauth2/authorize?client_id=972229072128204861&permissions=2147485696&scope=bot";

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

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<Array<Confession>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateResults = async () => {
    setIsLoading(true);
    setResults(
      await fetch(
        "/api/search?" +
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
      <div className="hero min-h-[80vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-5xl">
            <h1 className="text-5xl font-bold">Explore MIT Confessions!</h1>
            <p className="py-6">
              Browse our archive of over 3,000 MIT Confessions, or{" "}
              <a className="link link-hover" href={BOT_INVITE}>
                add our Discord bot
              </a>{" "}
              to automatically forward new confessions to your Discord server.
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
              className={`btn btn-primary ${isLoading && "loading"} ml-2`}
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

      <div className="container max-w-5xl p-6">
        <h1 className="text-5xl font-bold">
          Forward new confessions to Discord
        </h1>
        <div className="flex flex-row flex-wrap-reverse">
          <div className="max-w-md mr-auto">
            <p className="py-6">
              Invite our Discord bot to your server. As soon as new confessions
              are posted, the bot will post them to the channel of your choice.
              Perfect for MIT Confessions fans who aren't fans of Facebook!
            </p>
            <a href={BOT_INVITE}>
              <button className="btn btn-primary">Invite</button>
            </a>
            <p className="py-6">
              <a
                className="link link-primary"
                href="https://discord.gg/8g3wqgKfmc"
              >
                Join the mitconfesssionsbot community Discord server
              </a>
            </p>
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
                  <strong>#6969</strong> You should add the mitconfessionsbot to
                  your Discord Server!
                </p>
                <p className="link link-info">
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
    </>
  );
}
