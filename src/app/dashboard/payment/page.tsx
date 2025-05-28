"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

interface PaymentDetail {
    apply_id: number;
    capacity: number;
    apply_time: string;
    detection_time: string;
    paymentDeadline: string;
    accountNumber: string;
    account: {
        name: string;
        phone: string;
        apiray_name: string;
        apiray_address: string;
    };
}

const Payment = () => {
    const searchParams = useSearchParams();
    const apply_id = searchParams.get("apply_id");

    const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
    const [message, setMessage] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);


    const fetchPayment = async (apply_id: string) => {
        try {
            const response = await axiosInstance.get(`/get_apply_form_byid/${apply_id}`, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200 && response.data && response.data.account) {
                const date = new Date(response.data.apply_time);
                date.setDate(date.getDate() + 1);

                const formattedData: PaymentDetail = {
                    ...response.data,
                    detection_time: new Date(response.data.detection_time).toLocaleString("zh-TW"),
                    paymentDeadline: date.toLocaleDateString(),
                    accountNumber: Math.floor(Math.random() * 1000000000).toString(),
                };

                setPaymentDetail(formattedData);
            } else {
                setMessage("❌ 未找到对应申请资料");
            }
        } catch (error) {
            console.error("❌ 取得申請紀錄失敗", error);
            setMessage("❌ 取得申請紀錄失敗，請稍後再試！");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && apply_id) {
            fetchPayment(apply_id);
        } else {
            setMessage("❌ Token 或 apply_id 不存在，請先登入！");
        }
    }, [apply_id]);

    const handlePayment = async () => {
        if (!apply_id) {
            setMessage("❌ 申請 ID 無效，請重新嘗試");
            return;
        }
        try {
            const response = await axiosInstance.post(`/pay/${apply_id}`, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                setPaymentSuccess(true);
            } else {
                setMessage("❌ 付款失敗，請稍後再試");
            }
        } catch (error) {
            console.error("❌ 付款 API 失敗", error);
            setMessage("❌ 付款 API 失敗，請檢查網路或稍後再試！");
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
                            <h1 className="text-2xl font-bold text-amber-700">蜂蜜檢測付款資訊</h1>
                            <p className="mt-2 text-gray-700">請確認您的申請資訊並完成付款。</p>

                            {message && <p className="mt-2 text-red-500">{message}</p>}
                            {paymentDetail && (
                                <div className="m-4 p-4 border rounded-lg bg-yellow-50 text-left">
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>姓名：</strong> {paymentDetail.account.name}</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>電話：</strong> {paymentDetail.account.phone}</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>蜂場地址：</strong> {paymentDetail.account.apiray_address}</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>檢測公升數：</strong> {paymentDetail.capacity} L</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>申請日期：</strong> {new Date(paymentDetail.apply_time).toLocaleString("zh-TW")}</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>檢測日期：</strong> {paymentDetail.detection_time}</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>繳款金額：</strong> NT$1000</p>
                                    <p className="mt-4 text-stone-600 font-semibold"><strong>付款帳號：</strong> {paymentDetail.accountNumber}</p>
                                </div>
                            )}
                            <p className="mt-4 text-red-600 font-semibold">
                                ※ 請於 {paymentDetail?.paymentDeadline} 內完成轉帳付款至上述帳號。
                            </p>
                            {paymentSuccess ? (
                                <div className="p-4 mt-4 bg-green-100 text-green-700 rounded">
                                    🎉 付款成功！您的檢測申請已確認。
                                </div>
                            ) : (
                                <button 
                                    onClick={handlePayment}
                                    className="mt-4 bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded">
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

export default Payment;