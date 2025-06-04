"use client";

import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";

interface LabelInfo {
  apply_id: string;
  capacity: string;
  apply_time: string;
  detection_time: string;
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

const LabelQuery = () => {
  const [input, setInput] = useState("");
  const [labelData, setLabelData] = useState<LabelInfo | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLabelData(null);
  
    if (!input.trim() || isNaN(Number(input))) {
      setMessage("請輸入有效的標章編號");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/get_label/${input}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 && response.data && response.data.detection_time && response.data.account) {
        const data = {
          ...response.data,
          detection_time: formatTime(response.data.detection_time),
        };
        setLabelData(data);
        //console.log("✅ Processed Data:", data);
      } else {
        setMessage("查無此標章資料");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Error response:", err.response);
        setMessage(err.response?.data?.message || "查詢失敗，請稍後再試");
      } else {
        setMessage("發生未知錯誤");
      }
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="relative lg:row-span-2 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
      <h3 className="text-xl font-semibold text-amber-700 mb-4">標章查詢</h3>
      <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="flex items-center space-x-2">
        <span className="text-gray-700 font-medium">HDN</span>
        <input
          type="text"
          placeholder="00000210"
          className="p-2 border rounded-lg text-gray-700 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
      </div>
        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "查詢中..." : "查詢"}
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}

      {labelData && (
        <div className="mt-6 p-4 bg-lime-400 shadow-md rounded-lg text-left border border-gray-200 text-gray-700">
          <h3 className="text-lg font-semibold text-amber-700">標章資訊</h3>
          <p className="mt-2 "><strong>蜂農姓名：</strong>{labelData.account.name}</p>
          <p><strong>蜂場名稱：</strong>{labelData.account.apiray_name}</p>
          <p><strong>蜂場地址：</strong>{labelData.account.apiray_address}</p>
          <p><strong>檢測日期：</strong>{labelData.detection_time}</p>
          <p><strong>檢測結果：</strong>{labelData.result}</p>
          {/* <p><strong>蜂蜜純度：</strong>{labelData.result}</p> */}
        </div>
      )}
    </div>
  );
};

export default LabelQuery;
