"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

// 申請表單型別
interface ApplyForm {
  apply_id: number;
  capacity: number;
  detection_time: string;
  apply_time: string;
  pay: boolean;
  account: {
    annual: number;
  };
}

// 檢測紀錄型別
interface LabelInfo {
  apply_form: {
    apply_id: string;
    capacity: string;
    apply_time: string;
    detection_time: string;
    pay: boolean;
  };
  result: string;
  label_id_start: string;
  label_id_end: string;
  account: {
    name: string;
    phone: string;
    apiray_name: string;
    apiray_address: string;

  };
}

const Record = () => {
  const router = useRouter();
  // tabs: 0 = 待檢測申請, 1 = 檢測紀錄
  const [tab, setTab] = useState(0);

  // apply-cancel 狀態
  const [forms, setForms] = useState<ApplyForm[]>([]);
  const [applyMessage, setApplyMessage] = useState("");

  // record 狀態
  const [records, setRecords] = useState<LabelInfo[]>([]);

  // 年費制剩餘次數
  const [annual, setAnnual] = useState<number | null>(null);

  // 時間格式化
  const formatTime = (dateString: string) => {
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

  // 取得申請紀錄
  const fetchApplyInfo = useCallback(async (token: string) => {
    try {
      const response = await axiosInstance.get(`/get_apply_form/${token}`);
      const data = response.data.map((form: ApplyForm) => ({
        ...form,
        apply_time: formatTime(form.apply_time),
        detection_time: formatTime(form.detection_time),
      }));
      setForms(data);
      setApplyMessage("");
      // 取得年費制剩餘次數（假設每個申請都帶有 account.annual，取第一筆即可）
      if (data.length > 0 && data[0].account && typeof data[0].account.annual === "number") {
        setAnnual(data[0].account.annual);
      } else {
        setAnnual(null);
      }
      //console.log("取得申請紀錄成功！", data);
    } catch (error) {
      console.error("取得申請紀錄失敗", error);
      setApplyMessage("取得申請紀錄失敗，請稍後再試。");
    }
  }, []);

  // 取得檢測紀錄
  const fetchRecords = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/get_label_byaccount/${localStorage.getItem("account")}`);
      const data = response.data.map((form: LabelInfo) => ({
        ...form,
        apply_form: {
          ...form.apply_form,
          apply_time: formatTime(form.apply_form.apply_time),
          detection_time: formatTime(form.apply_form.detection_time),
        },
      }));
      setRecords(data);
      // console.log("取得檢測紀錄成功！", data);
    } catch (error) {
      console.error("取得檢測紀錄失敗", error);
    }
  }, []);

  // 初始化時取得資料
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchApplyInfo(token);
    } else {
      setApplyMessage("Token 不存在，請重新登入！");
    }
    fetchRecords();
  }, [fetchApplyInfo, fetchRecords]);

  // 取消申請
  const handleCancel = async (apply_id: number) => {
    setApplyMessage("");
    try {
      const response = await axiosInstance.post(`/cancel_apply/${apply_id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 || response.status === 201) {
        setApplyMessage("取消申請成功！");
        setForms((prevForms) => prevForms.filter((form) => form.apply_id !== apply_id));
      } else {
        setApplyMessage(response.data.detail || "取消申請失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("連線錯誤，請確認伺服器狀態！", error);
      setApplyMessage("連線錯誤，請確認伺服器狀態！");
    }
  };

  // 去付款
  const handlePayment = (apply_id: number) => {
    router.push(`/dashboard/payment?apply_id=${apply_id}`);
  };

  // 確認付款（年費用戶）
  const handleConfirmPay = async (apply_id: number) => {
    try {
      const response = await axiosInstance.post(`/pay/${apply_id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setForms((prevForms) =>
          prevForms.map((form) =>
            form.apply_id === apply_id ? { ...form, pay: true } : form
          )
        );
        setApplyMessage(response.data?.message || "付款成功！");
        // 付款成功後刷新年費制次數
        const token = localStorage.getItem("token");
        if (token) fetchApplyInfo(token);
      } else {
        setApplyMessage("付款失敗，請稍後再試。");
      }
    } catch (error) {
      console.error("❌ 付款 API 失敗", error);
      setApplyMessage("付款失敗，請稍後再試。");
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
                <motion.div
                  className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-400 to-transparent"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                ></motion.div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                  <h1 className="text-4xl font-bold text-amber-700 sm:text-5xl">
                    歷史申請紀錄/檢測紀錄
                  </h1>
                  <p className="mt-4 text-lg text-gray-700">
                    查看歷史檢測申請與標章紀錄
                  </p>
                  {/* 年費制會員顯示區塊 */}
                  <div className="mb-4">
                    {annual !== null && annual > 0 ? (
                      <p className="text-amber-700 font-semibold">
                        年費制剩餘次數：{annual}
                      </p>
                    ) : (
                      <Link href="/dashboard/annual_payment" className="grid place-content-center mt-6 underline text-lg text-amber-700">
                        成為年費制會員?享受更多優惠~
                      </Link>
                    )}
                  </div>
                  {/* Tabs */}
                  <div className="flex justify-center mt-8 mb-6">
                    <button
                      className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 ${
                        tab === 0
                          ? "border-amber-600 text-amber-700 bg-white"
                          : "border-transparent text-gray-500 bg-gray-100"
                      }`}
                      onClick={() => setTab(0)}
                    >
                      待檢測申請
                    </button>
                    <button
                      className={`px-6 py-2 rounded-t-lg font-semibold border-b-2 ml-2 ${
                        tab === 1
                          ? "border-amber-600 text-amber-700 bg-white"
                          : "border-transparent text-gray-500 bg-gray-100"
                      }`}
                      onClick={() => setTab(1)}
                    >
                      檢測紀錄
                    </button>
                  </div>
                  {/* Tab Content */}
                  <div className="mt-0 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                    {tab === 0 && (
                      <>
                        <h3 className="text-xl font-semibold text-amber-700">待檢測紀錄</h3>
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
                            {forms.map((form) => {
                              const annual = form.account?.annual ?? 0; // 這裡取得 annual
                              return (
                                <tr key={form.apply_id} className="text-center">
                                  <td className="border p-2">{form.apply_id}</td>
                                  <td className="border p-2">{form.capacity}</td>
                                  <td className="border p-2">{form.apply_time}</td>
                                  <td className="border p-2">{form.detection_time}</td>
                                  <td className="border p-2">
                                    {form.pay ? (
                                      <span className="text-green-600 font-semibold">已付款</span>
                                    ) : (
                                      annual > 0 ? ( // 這裡判斷 annual > 0
                                        <>
                                          <button
                                            className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded"
                                            onClick={() => handleCancel(form.apply_id)}
                                          >
                                            取消申請
                                          </button>
                                          <button
                                            className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded ml-2"
                                            onClick={() => handleConfirmPay(form.apply_id)}
                                          >
                                            確認付款
                                          </button>
                                        </>
                                      ) : (
                                        <>
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
                                        </>
                                      )
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {applyMessage && <p className="text-red-600 mt-2">{applyMessage}</p>}
                      </>
                    )}
                    {tab === 1 && (
                      <>
                        <h3 className="text-xl font-semibold text-amber-700">檢測紀錄</h3>
                        <table className="w-full text-amber-700">
                          <thead>
                            <tr className="bg-yellow-500">
                              <th className="border p-2">申請編號</th>
                              <th className="border p-2">公升數</th>
                              <th className="border p-2">申請日期</th>
                              <th className="border p-2">檢測日期</th>
                              <th className="border p-2">檢測結果</th>
                              <th className="border p-2">標章編號</th>
                            </tr>
                          </thead>
                          <tbody>
                            {records.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="border p-2 text-gray-500 text-center">
                                  尚無檢測紀錄
                                </td>
                              </tr>
                            ) : (
                              records.map((record) => (
                                <tr key={record.apply_form.apply_id} className="text-center">
                                  <td className="border p-2">{record.apply_form.apply_id}</td>
                                  <td className="border p-2">{record.apply_form.capacity}</td>
                                  <td className="border p-2">{record.apply_form.apply_time}</td>
                                  <td className="border p-2">{record.apply_form.detection_time}</td>
                                  <td className="border p-2">{record.result}</td>
                                  <td className="border p-2 text-red-600">
                                    {record.label_id_start}~{record.label_id_end}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </>
                    )}
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
};

export default Record;