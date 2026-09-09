import { Link, useLocation } from "react-router-dom";
import Notifications from "../notifications/Notifications";
import FeedTabs from "./FeedTabs";
import UserMenu from "./UserMenu";

export default function Header() {
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-2 py-2 md:px-4">
      {/* Left */}
      <Link
        to="/"
        className="cursor-pointer text-xl font-extrabold tracking-tight text-blue-600 transition-colors sm:text-2xl"
      >
        Linkup
      </Link>

      {/* Center */}
      {isHome && <FeedTabs />}

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex size-9 items-center justify-center sm:size-10 md:size-11">
          <Notifications />
        </div>

        <div className="flex size-9 items-center justify-center sm:size-10 md:size-11">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
