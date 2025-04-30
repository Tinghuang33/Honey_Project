"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

interface ApplyForm {
  apply_id: number;
  capacity: number;
  detection_time: string;
  apply_time: string;
}

const Apply_cancel = () => {
  const router = useRouter();
  const [forms, setForms] = useState<ApplyForm[]>([]);
  const [message, setMessage] = useState("");
  
  const formatTime = (dateString: string) => {
    // 將時間格式化為 zh-TW 的格式
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Intl.DateTimeFormat("zh-TW", options).format(new Date(dateString));
  };
  
  const fetchApplyInfo = async (token: string) => {
    try {
      const response = await axiosInstance.get(`/get_apply_form/${token}`);
      const data = response.data.map((form: ApplyForm) => ({
      ...form,
      apply_time: formatTime(form.apply_time),
      detection_time: formatTime(form.detection_time),
      }));
      setForms(data);
      console.log("取得申請紀錄成功！", data);

    } catch (error) {
      console.error("取得申請紀錄失敗", error);
      setMessage("取得申請紀錄失敗，請稍後再試。");
    }
  }  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        fetchApplyInfo(token);
    } else {
        console.error("Token 不存在，請先登入！");
        setMessage("Token 不存在，請重新登入！");
    }
  }, []);

  const handleCancel = async (apply_id: number) => {
    setMessage("");
    try {
      const response = await axiosInstance.post(`/cancel_apply/${apply_id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 || response.status === 201) {
        console.log("取消申請成功！", response.data);
        setMessage("取消申請成功！");
        // 更新狀態
        setForms((prevForms) => prevForms.filter((form) => form.apply_id !== apply_id));

      } else {
        console.error("取消申請失敗！", response.data);
        setMessage(response.data.detail || "取消申請失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("連線錯誤，請確認伺服器狀態！", error);
    }
  };

  const handlePayment = (apply_id: number) => {
    router.push(`/dashboard/payment?apply_id=${apply_id}`); // 跳轉到付款頁面，帶上 apply_id
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
                      待檢測申請
                  </h1>
                  <p className="mt-4 text-lg text-gray-700">
                      查看待檢測申請，確認檢測資訊
                  </p>
                  <div className="mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                    <h3 className="text-xl font-semibold text-amber-700">
                      待檢測紀錄
                    </h3>
                    <table className="w-full text-amber-700">
                      <thead>
                        <tr className="bg-yellow-500">
                          <th className="border p-2">申請編號</th>
                          <th className="border p-2">公升數</th>
                          <th className="border p-2">申請日期</th>
                          <th className="border p-2">檢測日期</th>
                          <th className="border p-2">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forms.map((form) => (
                          <tr key={form.apply_id} className="text-center">
                            <td className="border p-2">{form.apply_id}</td>
                            <td className="border p-2">{form.capacity}</td>
                            <td className="border p-2">{form.apply_time}</td>
                            <td className="border p-2">{form.detection_time}</td>
                            <td className="border p-2">
                              <button
                                className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded"
                                onClick={() => handleCancel(form.apply_id)}
                              >
                                取消申請
                              </button>
                              <button
                                className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded ml-2"
                                onClick={() => handlePayment(form.apply_id)}
                              >
                                去付款
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {message && <p className="text-red-600 mt-2">{message}</p>}
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
export default Apply_cancel;