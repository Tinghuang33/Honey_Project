"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const Profile = () => {
    const[name, setName] = useState("");
    const[phone, setPhone] = useState("");
    const[apiray_name, setApiray_name] = useState("");
    const[apiray_address, setApiray_address] = useState("");
    const [message, setMessage] = useState("");

    const fetchProfile = async (account: string) => {
        try {
            const response = await axiosInstance.get(`/get_user_info/${account}`, {
                headers: { "Content-Type": "application/json" },
            });
            //console.log("讀取成功", response.data);
            setName(response.data.name);
            setPhone(response.data.phone);
            setApiray_name(response.data.apiray_name);
            setApiray_address(response.data.apiray_address);
        } catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
        }
    };
    useEffect(() => {
        const account = localStorage.getItem("account");
            //console.log("Account from localStorage:", account);
            if (account) {
                fetchProfile(account); 
            }  
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (
            !name?.trim() ||
            !phone ||
            !apiray_name?.trim() ||
            !apiray_address?.trim()
        ) {
            setMessage("請確保所有欄位皆填寫!");
            return;
        }
        const token = localStorage.getItem("token");
        try{
            const response = await axiosInstance.patch(`/change_user_info/${token}`, {
                name,
                phone,
                apiray_name,
                apiray_address,
            }, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200 || response.status === 201) {
                //console.log("更新成功！", response.data);
                setMessage("更新成功！");
            } else {
                //console.error("更新失敗！", response.data);
                setMessage(response.data.detail || "更新失敗，請稍後再試。");
            }  
        }catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
            return;
        }
    };

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

                                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                                        <h3 className="text-xl font-semibold text-amber-700 mb-4">
                                            會員資料
                                        </h3>
                                        <input 
                                        type="text" 
                                        placeholder="姓名" 
                                        className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        />
                                        <input 
                                        type="text" 
                                        placeholder="電話" 
                                        className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        />
                                        <input 
                                        type="text" 
                                        placeholder="蜂場名稱" 
                                        className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                                        value={apiray_name}
                                        onChange={(e) => setApiray_name(e.target.value)}
                                        />
                                        <input 
                                        type="text" 
                                        placeholder="蜂場地址" 
                                        className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                                        value={apiray_address}
                                        onChange={(e) => setApiray_address(e.target.value)}
                                        />
                                        <button className="mt-2 w-full bg-amber-600 text-white p-2 rounded-lg"
                                        >儲存</button>
                                        {message && <p className="text-red-600 mt-2">{message}</p>}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </AuthProvider>
    );
};

export default Profile;
