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
        <div className="flex items-center gap-4">
          {/* {isAdmin && (
            <div className="flex gap-4">
              <Link
                href="/inspector/review_story"
                className="bg-amber-400 hover:bg-amber-500 text-cyan-900 font-bold px-4 py-2 rounded shadow transition"
              >
                蜂農故事審查
              </Link>
              <Link
                href="/inspector/review_knowledge"
                className="bg-amber-400 hover:bg-amber-500 text-cyan-900 font-bold px-4 py-2 rounded shadow transition"
              >
                蜂蜜知識審查
              </Link>
            </div>
          )} */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className={`${isAdmin ? "bg-amber-400 hover:bg-amber-500 text-cyan-900" : "bg-red-600 hover:bg-red-700"} font-semibold py-2 px-4 rounded`}
            >
              登出
            </button>
          ) : (
            <button
              onClick={login}
              className={`${isAdmin ? "bg-amber-400 hover:bg-amber-500 text-cyan-900" : "bg-red-600 hover:bg-red-700"} font-semibold py-2 px-4 rounded`}
            >
              登入
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
