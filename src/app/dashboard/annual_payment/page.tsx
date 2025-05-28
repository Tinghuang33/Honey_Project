"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

interface AnnualPaymentDetail {
  name: string;
  phone: string;
  apiray_name: string;
  apiray_address: string;
  accountNumber: string;
  paymentDeadline: string;
  annual_time?: string; // 新增有效期限
  annual?: number;      // 新增剩餘次數
}

const AnnualPayment = () => {
  const [detail, setDetail] = useState<AnnualPaymentDetail | null>(null);
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isAnnualMember, setIsAnnualMember] = useState(false);
  const [annualExpire, setAnnualExpire] = useState<string | null>(null);

  // 取得會員資料並判斷年費制會員狀態
  useEffect(() => {
    const account = localStorage.getItem("account");
    if (!account) {
      setMessage("❌ 尚未登入，請先登入！");
      return;
    }
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(`/get_user_info/${account}`, {
          headers: { "Content-Type": "application/json" },
        });
        const date = new Date();
        date.setDate(date.getDate() + 1);
        setDetail({
          name: response.data.name,
          phone: response.data.phone,
          apiray_name: response.data.apiray_name,
          apiray_address: response.data.apiray_address,
          accountNumber: Math.floor(Math.random() * 1000000000).toString().padStart(10, "0"),
          paymentDeadline: date.toLocaleDateString("zh-TW"),
          annual_time: response.data.annual_time,
          annual: response.data.annual,
        });

        // 判斷是否為年費制會員（只要 annual_time 有值就算年度會員，不需重設）
        if (response.data.annual_time) {
          setIsAnnualMember(true);
          setAnnualExpire(new Date(response.data.annual_time).toLocaleDateString("zh-TW"));
        } else {
          setIsAnnualMember(false);
          setAnnualExpire(null);
        }
      } catch (error) {
        setMessage("❌ 取得會員資料失敗，請稍後再試！");
        console.error("連線錯誤，請確認伺服器狀態！", error);
      }
    };
    fetchUserInfo();
  }, []);

  // 付款
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Token 不存在，請重新登入！");
        return;
      }
      const response = await axiosInstance.post(`/set_annual/${token}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setPaymentSuccess(true);
      } else {
        setMessage("❌ 付款失敗，請稍後再試");
      }
    } catch (error) {
      setMessage("❌ 付款失敗！請稍後再試");
      console.error("連線錯誤，請確認伺服器狀態！", error);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="bg-gray-100 flex-1 flex justify-center items-center p-6">
            <div className="mt-4 p-6 bg-white rounded-lg shadow w-full max-w-md text-center">
              <h1 className="text-2xl font-bold text-amber-700">年費制會員付款</h1>
              <p className="mt-2 text-gray-700">
                成為年費制會員可享一年內六次蜂蜜檢測額度，優惠費用 NT$4000！
              </p>
              <ul className="mt-4 text-left text-amber-700 list-disc list-inside">
                <li>年費制會員一年內可免費檢測六次蜂蜜。</li>
                <li>享有專屬優惠與快速檢測服務。</li>
                <li>會員資格自付款日起生效一年。</li>
              </ul>
              {message && <p className="mt-2 text-red-500">{message}</p>}
              {detail && (
                <div className="m-4 p-4 border rounded-lg bg-yellow-50 text-left">
                  <p className="mt-2 text-stone-600 font-semibold"><strong>姓名：</strong> {detail.name}</p>
                  <p className="mt-2 text-stone-600 font-semibold"><strong>電話：</strong> {detail.phone}</p>
                  <p className="mt-2 text-stone-600 font-semibold"><strong>蜂場名稱：</strong> {detail.apiray_name}</p>
                  <p className="mt-2 text-stone-600 font-semibold"><strong>蜂場地址：</strong> {detail.apiray_address}</p>
                  <p className="mt-2 text-stone-600 font-semibold"><strong>付款帳號：</strong> {detail.accountNumber}</p>
                  <p className="mt-2 text-stone-600 font-semibold"><strong>繳款金額：</strong> NT$4000</p>
                </div>
              )}
              <p className="mt-4 text-red-600 font-semibold">
                ※ 請於 {detail?.paymentDeadline} 內完成轉帳付款至上述帳號。
              </p>
              {/* 年費制會員狀態判斷 */}
              {isAnnualMember ? (
                <div className="p-4 mt-4 bg-green-100 text-green-700 rounded font-semibold">
                  您已是年費制會員
                  {annualExpire && <>，啟用日期：{annualExpire}</>}
                </div>
              ) : paymentSuccess ? (
                <div className="p-4 mt-4 bg-green-100 text-green-700 rounded">
                  🎉 付款成功！您已成為年費制會員。
                </div>
              ) : (
                <button
                  onClick={handlePayment}
                  className="mt-4 bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded"
                >
                  付款
                </button>
              )}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default AnnualPayment;
