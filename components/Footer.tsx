import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { BOT_INVITE, SERVER_INVITE } from "../app/constants";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <div className="grid grid-flow-col gap-4">
        <Link href="/" className="link link-hover">
          Home
        </Link>
        <Link href="/search" className="link link-hover">
          Search
        </Link>
        <a className="link link-hover" href={BOT_INVITE}>
          Bot
        </a>
        <a className="cursor-default">Stats (coming soon!)</a>
        <a
          href="https://github.com/reeceyang/mitconfessionsweb"
          className="link link-hover"
        >
          Source
        </a>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://github.com/reeceyang/mitconfessionsweb"
            className="link transition hover:scale-110"
          >
            <FontAwesomeIcon className="fa-2xl" icon={faGithub} />
          </a>
          <a href={SERVER_INVITE} className="link transition hover:scale-110">
            <FontAwesomeIcon className="fa-2xl" icon={faDiscord} />
          </a>
        </div>
      </div>
      <div>
        <p>
          Made with 🧐 by{" "}
          <a className="link link-hover" href="https://www.reeceyang.xyz/">
            Reece
          </a>
        </p>
      </div>
    </footer>
  );
}
