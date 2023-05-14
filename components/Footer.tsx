import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BOT_INVITE } from "../app/page";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <div className="grid grid-flow-col gap-4">
        <a className="link link-hover">Search</a>
        <a className="link link-hover" href={BOT_INVITE}>
          Bot
        </a>
        <a className="cursor-default">Stats (coming soon!)</a>
        <a className="link link-hover">Source</a>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <a className="link transition hover:scale-110">
            <FontAwesomeIcon className="fa-2xl" icon={faGithub} />
          </a>
          <a className="link transition hover:scale-110">
            <FontAwesomeIcon className="fa-2xl" icon={faDiscord} />
          </a>
        </div>
      </div>
      <div>
        <p>Made with ❤️ by Reece</p>
      </div>
    </footer>
  );
}
