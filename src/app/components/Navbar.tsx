"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

interface NavbarProps {
  mode?: "user" | "admin"; // 預設是 user
}

const Navbar: React.FC<NavbarProps> = ({ mode = "user" }) => {
  const { isAuthenticated, login, logout } = useAuth();

  const isAdmin = mode === "admin";

  return (
    <nav className={`${isAdmin ? "bg-cyan-800" : "bg-yellow-500"} p-4 shadow-md`}>
      <div className="mx-4 flex justify-between items-center">
        <Link href={isAdmin ? "/" : "/home"} className="text-white text-2xl font-bold">
          蜂蜜檢測系統
        </Link>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className={`${isAdmin ? "bg-yellow-600 hover:bg-yellow-700" : "bg-red-600 hover:bg-red-700"} text-white font-semibold py-2 px-4 rounded`}
          >
            登出
          </button>
        ) : (
          <button
            onClick={login}
            className={`${isAdmin ? "bg-yellow-600 hover:bg-yellow-700" : "bg-red-600 hover:bg-red-700"} text-white font-semibold py-2 px-4 rounded`}
          >
            登入
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
