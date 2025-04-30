"use client";

import axiosInstance from "../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface TestRecord {
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
  const [records, setRecords] = useState<TestRecord[]>([]);
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
      const response = await axiosInstance.get(`/get_label_for_inspector/${localStorage.getItem("token")}`);
      const data = response.data.map((form: TestRecord) => ({
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
        <Navbar mode="admin" />
        <main className="bg-gray-100 flex-1 p-6">
          <div className="bg-green-50 py-24 sm:py-32 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyan-800 to-transparent"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center text-cyan-900">
              <h1 className="text-4xl font-bold sm:text-5xl">歷史檢測紀錄/標章紀錄</h1>
              <p className="mt-4 text-lg text-gray-700">查看歷史檢測結果與標章紀錄</p>

              <div className="mt-10 bg-white p-6 rounded-xl border shadow">
                <h3 className="text-xl font-semibold mb-4">檢測紀錄</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-lime-50">
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
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Record;
