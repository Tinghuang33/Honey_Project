"use client";

import { useState } from "react";

export default function LegalNorms({ onAccept }: { onAccept: () => void }) {
    const [showModal, setShowModal] = useState(true);

    const handleAcceptTerms = () => {
        setShowModal(false); // 關閉視窗
        onAccept(); // 更新Dashboard狀態
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 className="text-xl font-bold text-amber-700">蜂蜜檢測申請條款</h2>
                <div className="mt-4 text-gray-700 text-sm max-h-60 overflow-y-auto">
                    <p>1. 申請資格與規範：</p>
                    <p>- 申請者須為合法登記的蜂農，並提供相關證明文件。</p>
                    <p>- 蜂蜜檢測須符合 CNS 1305 標準，並遵守農業部食品安全規範。</p>

                    <p>2. 檢測流程與費用：</p>
                    <p>- 蜂蜜樣本須符合標準採樣規範，並確保樣本完整無污染。</p>
                    <p>- 檢測費用依系統公告標準計算，並須於申請時繳納。</p>

                    <p>3. 數據隱私與使用：</p>
                    <p>- 檢測數據僅供蜂農本人查閱，未經授權不得公開或轉售。</p>
                    <p>- 蜂農應同意網站的隱私政策，確保個人資訊不被濫用。</p>

                    <p>4. 法律責任與合規性：</p>
                    <p>- 禁止偽造檢測數據或提供不實資訊，違者將依法處理。</p>
                    <p>- 蜂農應確保其蜂蜜產品符合 2023 年 7 月 1 日實施的蜂蜜標示新法。</p>

                    <p>5. 網站使用規範：</p>
                    <p>- 若蜂農違反網站使用規範，可能導致帳戶暫停或限制使用。</p>

                    <p>6. 條款確認機制：</p>
                    <p>- 蜂農登入後，系統將自動彈出條款視窗，要求閱讀並勾選「我已閱讀並同意」。</p>
                    <p>- 若未勾選同意，則無法進行下一步操作，如檢測申請或數據查閱。</p>
                </div>
                <button 
                    onClick={handleAcceptTerms}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-white py-2 px-4 rounded">
                    我已閱讀並同意條款
                </button>
            </div>
        </div>
    );
}