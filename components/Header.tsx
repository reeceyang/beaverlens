import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { BOT_INVITE } from "../app/page";

const Header = () => (
  <div className="navbar bg-base-100">
    <div className="flex-1">
      <Link href="/" className="btn btn-ghost normal-case text-xl">Beaver Lens</Link>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li>
          <Link href="/search">Search</Link>
          <Link href={BOT_INVITE}>Discord Bot 
            <FontAwesomeIcon className="fa-md" icon={faArrowUpRightFromSquare} />
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default Header;
