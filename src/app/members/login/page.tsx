"use client";

import axiosInstance from "../../../utils/axiosConfig";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";


export default function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try{
      const response = await axiosInstance.post("/login", { account, password }, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 || response.status === 201) {
        console.log("登入成功！", response.data);
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("account", account);

        router.push("/"); // 導向app.tsx觸發處理
      } else {
        console.error("登入失敗！", response.data);
        setMessage(response.data.detail || "登入失敗，請稍後再試。");
      }
    }catch (error) {
      console.error("連線錯誤，請確認伺服器狀態！", error);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar/>
          <main className="bg-gray-100 flex-1 p-6">
            <div className="mt-4 p-6 bg-white rounded-lg shadow">
              <div className="bg-yellow-50 py-24 sm:py-32 relative overflow-hidden">
                {/* 蜂蜜流動動畫 */}
                <motion.div 
                    className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-400 to-transparent"
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                ></motion.div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                  <h1 className="text-4xl font-bold text-amber-700 sm:text-5xl">
                      蜂蜜品質檢測平台
                  </h1>
                  <p className="mt-4 text-lg text-gray-700">
                      讓消費者買得安心，讓蜂農賣得放心
                  </p>
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                    <h3 className="text-xl font-semibold text-amber-700 mb-4">
                      使用者登入
                    </h3>
                    <input 
                      type="text" 
                      placeholder="帳號" 
                      className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                    />
                    <input 
                      type="password" 
                      placeholder="密碼" 
                      className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg">登入</button>
                    {message && <p className="text-red-600 mt-2">{message}</p>}
                  </form>
                  <Link href="/members/register" className="grid place-content-center mt-6 underline text-lg text-amber-700"><strong>會員註冊</strong></Link>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}
