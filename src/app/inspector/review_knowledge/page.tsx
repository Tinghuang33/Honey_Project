"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";
import Link from "next/link";

interface KnowledgeData {
  account: string;
  name: string;
  education: string;
}

const ReviewKnowledge = () => {
  const [knowledges, setKnowledges] = useState<KnowledgeData[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKnowledges = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/get_all_education_unchecked");
        setKnowledges(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("取得知識失敗", error);
        setKnowledges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledges();
  }, []);

  const handleConfirm = async (account: string) => {
        const token = localStorage.getItem("token"); 
        try{
            const response = await axiosInstance.post(`/check_education/${token}?account=${account}`, null, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.status === 200 || response.status === 201) {
                setMessage("知識審查確認成功！");
                setKnowledges(knowledges.filter(k => k.account !== account));
                setSelectedAccount(null);
            } else {
                console.error("篩選確認失敗！", response.data);
                setMessage(response.data.detail || "篩選確認失敗，請稍後再試。");
            }
        } catch (error) {
            console.error("連線錯誤，請確認伺服器狀態！", error);
            setMessage("篩選確認失敗，請稍後再試。");
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
              <h1 className="text-4xl font-bold sm:text-5xl">蜂蜜科普知識審查</h1>
              <p className="mt-4 text-lg text-gray-700">檢測人員可審查蜂蜜科普知識，確認後將公開顯示</p>
              <div className="my-6">
                <Link
                  href="/inspector"
                  className="inline-block bg-cyan-800 hover:bg-cyan-900 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  回到檢測紀錄
                </Link>
              </div>
              {message && <p className="text-red-600 mt-2">{message}</p>}

              <div className="mt-10 bg-white p-6 rounded-xl border shadow">
                <h3 className="text-xl font-semibold mb-4">待審查蜂蜜科普知識</h3>
                {loading ? (
                  <p className="text-center text-gray-600">載入中...</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-lime-50">
                        <th className="border p-2">帳號</th>
                        <th className="border p-2">標題</th>
                        <th className="border p-2">內容摘要</th>
                        <th className="border p-2">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {knowledges.map((k) => (
                        <tr key={k.account} className="text-center">
                          <td className="border p-2">{k.account}</td>
                          <td className="border p-2">{k.name}</td>
                          <td className="border p-2 truncate max-w-xs">{k.education.slice(0, 30)}...</td>
                          <td className="border p-2 space-x-2">
                            <button
                              className="text-orange-600 underline"
                              onClick={() => setSelectedAccount(k.account)}
                            >
                              詳細 {selectedAccount === k.account ? "▲" : "▼"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {selectedAccount && (
                  <div className="mt-4 text-left bg-yellow-50 border p-4 rounded text-gray-700">
                    {knowledges
                      .filter((k) => k.account === selectedAccount)
                      .map((k) => (
                        <div key={`detail-${k.account}`}>
                          <p><strong>帳號：</strong>{k.account}</p>
                          <p><strong>標題：</strong>{k.name}</p>
                          <pre className="text-gray-800 whitespace-pre-wrap">{k.education}</pre>
                          <button
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            onClick={() => handleConfirm(k.account)}
                          >
                            確認審查
                          </button>
                          <button
                            className="mt-4 ml-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => setSelectedAccount(null)}
                          >
                            關閉
                          </button>
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

export default ReviewKnowledge;
