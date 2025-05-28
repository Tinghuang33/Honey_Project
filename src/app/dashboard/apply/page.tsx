"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const Apply = () => {
    const [form, setForm] = useState({ name: "", phone: "", apiray_name: "", apiray_address: "", capacity: "", detection_time: "" });
    const [message, setMessage] = useState("");
    const [date, setDate] = useState(""); // 新增日期 state
    const [period, setPeriod] = useState(""); // 新增時段 state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "capacity") {
            setForm({ ...form, [name]: value });
        }
    };

    // 日期與時段選擇
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
        setForm({ ...form, detection_time: e.target.value && period ? `${e.target.value} ${period}` : "" });
    };
    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPeriod(e.target.value);
        setForm({ ...form, detection_time: date && e.target.value ? `${date} ${e.target.value}` : "" });
    };

    const fetchProfile = async (account: string) => {
        try {
            const response = await axiosInstance.get(`/get_user_info/${account}`, {
                headers: { "Content-Type": "application/json" },
            });
            setForm({
                ...form,
                name: response.data.name,
                phone: response.data.phone,
                apiray_name: response.data.apiray_name,
                apiray_address: response.data.apiray_address,
            });
            console.log("讀取成功", response.data);

        } catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
        }
    };
    useEffect(() => {
        const account = localStorage.getItem("account");
            console.log("Account from localStorage:", account);
            if (account) {
                fetchProfile(account); 
            }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (
            !form.name?.trim() ||
            !form.apiray_name?.trim() ||
            !form.phone ||
            !form.apiray_address?.trim()
        ) {
            setMessage("請先完成個人資料填寫!");
            return;
        }
        if (!form.capacity?.trim() || !form.detection_time?.trim()) {
            setMessage("請填寫欲檢測公升數和檢測日期與時段！");
            return;
        }
        const token = localStorage.getItem("token");
        try{
            const response = await axiosInstance.post(`/submit_apply/${token}`, form, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200 || response.status === 201) {
                console.log("申請成功！", response.data);
                setMessage("申請成功！可查詢申請紀錄。");
                setForm({
                    ...form,
                    capacity: "",
                    detection_time: "",
                });
            } else {
                console.error("申請失敗！", response.data);
                setMessage(response.data.detail || "申請失敗，請稍後再試。");
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
                                        蜂蜜檢測申請
                                    </h1>
                                    <p className="mt-4 text-lg text-gray-700">
                                        填寫申請資料，送出後進行付款
                                    </p>

                                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                                        <h3 className="text-xl font-semibold text-amber-700 mb-4">
                                            申請蜂蜜檢測
                                        </h3>
                                        <p className="mt-2 w-full p-2 rounded-lg text-gray-700">姓名：{form.name}</p>
                                        <p className="mt-2 w-full p-2 rounded-lg text-gray-700">電話：{form.phone}</p>
                                        <p className="mt-2 w-full p-2 rounded-lg text-gray-700">蜂場名稱：{form.apiray_name}</p>
                                        <p className="mt-2 w-full p-2 rounded-lg text-gray-700">蜂場地址：{form.apiray_address}</p>
                                        <input 
                                        type="text" 
                                        name="capacity"
                                        placeholder="欲檢測公升數(請填數字)" 
                                        className="mt-2 w-full p-2 border rounded-lg text-gray-700"
                                        value={form.capacity}
                                        onChange={handleChange}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <input
                                                type="date"
                                                name="date"
                                                className="w-1/2 p-2 border rounded-lg text-gray-700"
                                                value={date}
                                                onChange={handleDateChange}
                                                min={new Date().toISOString().split("T")[0]} // 禁止選擇過去日期
                                            />
                                            <select
                                                name="period"
                                                className="w-1/2 p-2 border rounded-lg text-gray-700"
                                                value={period}
                                                onChange={handlePeriodChange}
                                            >
                                                <option value="">請選擇檢測時段</option>
                                                <option value="09:00">09:00</option>
                                                <option value="12:00">12:00</option>
                                                <option value="15:00">15:00</option>
                                            </select>
                                        </div>
                                        <button className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg"
                                        >送出</button>
                                        {message && <p className="text-red-600 mt-2">{message}</p>}
                                        <Link href="/dashboard/annual_payment" className="grid place-content-center mt-6 underline text-lg text-amber-700">成為年費制會員?享受更多優惠~</Link>
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

export default Apply;
