import { Outlet } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "../UI/ScrollToTop";

export default function Layout() {
  return (
    <>
      <div>
        <Header />
        <div className="max-w-[1024px] mx-auto px-2 pt-22 sm:pt-28 pb-4">
          <Outlet />
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
