import AccountNavbar from "../components/my-account/AccountNavbar";
import { Outlet } from "react-router-dom";

export default function MyAccount() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
      <div className="md:flex-1 w-full md:sticky md:z-50 md:top-[100px]">
        <AccountNavbar />
      </div>
      <div className="md:flex-6/12 w-full">
        <Outlet />
      </div>
    </div>
  );
}
