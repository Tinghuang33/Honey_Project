"use client";

import axiosInstance from "../../utils/axiosConfig";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";


export default function Dashboard() {
    const[name, setName] = useState("");
    const account = localStorage.getItem("account");

    const fetchProfile = async (account: string) => {
        try {
            const response = await axiosInstance.get(`/get_user_info/${account}`, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("讀取成功", response.data);
            setName(response.data.name);

        } catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
        }
    };

    useEffect(() => {
        console.log("Account from localStorage:", account);
        if (account) {
            fetchProfile(account); 
        }     
    }, []);
    
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex flex-1">
                    <Sidebar />
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
                                    <div className="max-w-md mx-auto mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                                    <h3 className="text-xl font-semibold text-amber-700 mb-4">
                                            會員中心
                                        </h3>

                                        {/* 同步會員資料(後端) */}
                                        <p className="text-amber-700"><strong>姓名：{name}</strong> </p>
                                        
                                        {/* 功能選單 */}
                                        <div className="grid gird-cols-2 gap-4 p-6 mt-2">
                                            <Link href="/dashboard/profile">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                查看/修改會員資料
                                                </div>
                                            </Link>
                                            <Link href="/dashboard/apply">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                申請檢測
                                                </div>
                                            </Link>
                                            <Link href="/dashboard/payment">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                付款資訊
                                                </div>
                                            </Link>
                                            <Link href="/dashboard/apply-cancel">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                申請紀錄(待檢測)
                                                </div>
                                            </Link>
                                            <Link href="/dashboard/record">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                歷史檢測紀錄&標章資訊
                                                </div>
                                            </Link>
                                            <Link href="/dashboard/story">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                提供蜂農故事
                                                </div>
                                            </Link>
                                            <Link href="/dashboard/bee-education">
                                                <div className="bg-yellow-500 hover:bg-yellow-400 text-white p-4 ml-4 mr-4 shadow rounded text-center cursor-pointer">
                                                提供蜂蜜知識
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
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