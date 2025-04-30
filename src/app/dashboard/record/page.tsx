"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

interface LabelInfo {
  apply_form: {
    apply_id: string;
    capacity: string;
    apply_time: string;
    detection_time: string;
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
  const [records, setRecords] = useState<LabelInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  // 取得檢測紀錄
  const fetchRecords = async () => {
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
      console.log("取得檢測紀錄成功！", data);
    } catch (error) {
      console.error("取得檢測紀錄失敗", error);
  }};
  useEffect(() => {
    fetchRecords();
    console.log("目前的 Token:", localStorage.getItem("token"));
  }, []);


  // 切換顯示詳細資訊
  const handleToggleDetails = async (apply_id: string) => {
    if (selectedId === apply_id) {
      setSelectedId(null);
    } else {
      setSelectedId(apply_id);
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
                    蜂蜜檢測紀錄
                  </h1>
                  <p className="mt-4 text-lg text-gray-700">
                    查看歷史檢測結果&標章紀錄
                  </p>
                  <div className="mt-10 grid gap-6 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
                    <h3 className="text-xl font-semibold text-amber-700">檢測紀錄</h3>
                    <table className="w-full text-amber-700">
                    <thead>
                      <tr className="bg-yellow-500">
                        <th className="border p-2">申請編號</th>
                        <th className="border p-2">公升數</th>
                        <th className="border p-2">申請日期</th>
                        <th className="border p-2">檢測日期</th>
                        <th className="border p-2">檢測結果</th>
                        <th className="border p-2">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.apply_form.apply_id} className="text-center">
                          <td className="border p-2">{record.apply_form.apply_id}</td>
                          <td className="border p-2">{record.apply_form.capacity}</td>
                          <td className="border p-2">{record.apply_form.apply_time}</td>
                          <td className="border p-2">{record.apply_form.detection_time}</td>
                          <td className="border p-2">{record.result}</td>
                          <td className="border p-2 space-x-2">
                            <button
                              className="text-orange-600 underline"
                              onClick={() => handleToggleDetails(record.apply_form.apply_id)}
                            >
                              詳細 {selectedId === record.apply_form.apply_id ? "▲" : "▼"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedId && (
                    <div className="mt-4 text-left bg-yellow-50 border p-4 rounded text-gray-700">
                      {records
                        .filter((r) => r.apply_form.apply_id === selectedId)
                        .map((record) => (
                          <div key={record.apply_form.apply_id}>
                            <p><strong>蜂農姓名：</strong> {record.account.name}</p>
                            <p><strong>電話：</strong> {record.account.phone}</p>
                            <p><strong>蜂場名稱：</strong> {record.account.apiray_name}</p>
                            <p><strong>蜂場地址：</strong> {record.account.apiray_address}</p>
                            <p className="text-red-600">
                              標章編號：{record.label_id_start}~{record.label_id_end}
                            </p>
                          </div>
                        ))}
                    </div>
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
