"use client";

import axiosInstance from "../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// 查詢結果型別
interface LabelResult {
  apply_id: string;
  issue_id: string;
  label_id_start: string;
  label_id_end: string;
  result: string;
}

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
  const [labelQuery, setLabelQuery] = useState("");
  const [apirayQuery, setApirayQuery] = useState("");
  const [labelResult, setLabelResult] = useState<LabelResult | null>(null);
  const [apirayResult, setApirayResult] = useState<LabelResult[]>([]);
  const [queryMessage, setQueryMessage] = useState("");

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
      //console.log("取得檢測紀錄成功！", data);
    } catch (error) {
      console.error("取得檢測紀錄失敗", error);
  }};
  useEffect(() => {
    fetchRecords();
    //console.log("目前的 Token:", localStorage.getItem("token"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切換顯示詳細資訊
  const handleToggleDetails = async (apply_id: string) => {
    if (selectedId === apply_id) {
      setSelectedId(null);
    } else {
      setSelectedId(apply_id);
    }
  };

  // 依 label_id 查詢
  const handleLabelSearch = async () => {
    setQueryMessage("");
    setLabelResult(null);
    setApirayResult([]);
    if (!labelQuery) return;
    try {
      const response = await axiosInstance.get<LabelResult>(`/get_label_by_apply_id/${labelQuery}`);
      setLabelResult(response.data);
      setLabelQuery(""); // 查詢後清空輸入
    } catch (error) {
      setLabelResult(null);
      const err = error as { response?: { data?: { detail?: string } } };
      setQueryMessage(err?.response?.data?.detail || "查無標章");
    }
  };

  // 依 apiray_name 查詢
  const handleApiraySearch = async () => {
    setQueryMessage("");
    setApirayResult([]);
    setLabelResult(null);
    if (!apirayQuery) return;
    try {
      const response = await axiosInstance.get<LabelResult[]>(`/get_label_by_apiray_name/${encodeURIComponent(apirayQuery)}`);
      setApirayResult(Array.isArray(response.data) ? response.data : []);
      setApirayQuery(""); // 查詢後清空輸入
    } catch (error) {
      setApirayResult([]);
      const err = error as { response?: { data?: { detail?: string } } };
      setQueryMessage(err?.response?.data?.detail || "查無標章");
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

              {/* 查詢功能 */}
              <div className="my-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="輸入申請編號 (label_id)"
                    value={labelQuery}
                    onChange={e => setLabelQuery(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <button
                    onClick={handleLabelSearch}
                    className="bg-cyan-800 hover:bg-cyan-900 text-white px-4 py-1 rounded"
                  >
                    查詢標章
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="輸入蜂場名稱 (apiray_name)"
                    value={apirayQuery}
                    onChange={e => setApirayQuery(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <button
                    onClick={handleApiraySearch}
                    className="bg-cyan-800 hover:bg-cyan-900 text-white px-4 py-1 rounded"
                  >
                    查詢蜂場標章
                  </button>
                </div>
              </div>
              {queryMessage && <div className="text-red-600 mb-2">{queryMessage}</div>}
              {/* 查詢結果 */}
              {labelResult && (
                <div className="mb-4 bg-white border rounded p-4 text-left">
                  <div><strong>申請編號：</strong>{labelResult.apply_id}</div>
                  <div><strong>發放編號：</strong>{labelResult.issue_id}</div>
                  <div><strong>標章編號：</strong>{labelResult.label_id_start} ~ {labelResult.label_id_end}</div>
                  <div><strong>檢測結果：</strong>{labelResult.result}</div>
                </div>
              )}
              {apirayResult.length > 0 && (
                <div className="mb-4 bg-white border rounded p-4 text-left">
                  <div className="font-bold mb-2">蜂場所有標章：</div>
                  {apirayResult.map((item, idx) => (
                    <div key={item.apply_id || idx} className="mb-2 border-b pb-2 last:border-b-0">
                      <div><strong>申請編號：</strong>{item.apply_id}</div>
                      <div><strong>發放編號：</strong>{item.issue_id}</div>
                      <div><strong>標章編號：</strong>{item.label_id_start} ~ {item.label_id_end}</div>
                      <div><strong>檢測結果：</strong>{item.result}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/inspector/review_story"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  前往蜂農故事審查
                </Link>
                <Link
                  href="/inspector/review_knowledge"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  前往蜂蜜知識審查
                </Link>
              </div>

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
