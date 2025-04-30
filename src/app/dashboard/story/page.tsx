"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from '@/components/Sidebar';

const Story = () => {   
    const [story, setStory] = useState("");
    const [message, setMessage] = useState("");

    const fetchStory = async (account: string) => {
        try {
            const response = await axiosInstance.get(`/get_user_info/${account}`, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("讀取成功", response.data);
            setStory(response.data.story);

        } catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
        }
    };
    useEffect(() => {
        const account = localStorage.getItem("account");
            console.log("Account from localStorage:", account);
            if (account) {
                fetchStory(account); 
            }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStory(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        try {
            const response = await axiosInstance.post(`/submit_story/${token}`, {
                story
            },{
                headers: { "Content-Type": "application/json" },
            });
            if(response.status === 200 || response.status === 201) {
                console.log("提交成功！", response.data);
                setStory("");
                setMessage("提交成功！感謝您的分享。");
                
            } else {
                console.error("提交失敗！", response.data);
                setMessage(response.data.detail || "提交失敗，請稍後再試。");
            }
        } catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
            setMessage("提交失敗，請稍後再試。");

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
                                        提供蜂農故事
                                    </h1>
                                    <p className="mt-4 text-lg text-gray-700">
                                        可以分享您的相關經歷，無論是在蜂場的日常生活，<br />還是對自家蜂蜜的介紹，都歡迎您與我們分享！<br /><br />
                                    </p>
                                    <span className="text-lg text-amber-600 font-semibold">寫下任何您想分享的內容。<br />請注意：請勿分享個人隱私或敏感資訊。</span>

                                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                                        <h3 className="text-xl font-semibold text-amber-700 mb-4">
                                            分享您的蜂農故事
                                        </h3>
                                        <textarea
                                        rows={5}
                                        placeholder="請輸入您的相關經歷或蜂場故事..." 
                                        className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                                        value={story}
                                        onChange={handleChange}
                                        />
                                        <button className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg">送出</button>
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
}

export default Story;