"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LabelQuery from "@/components/LabelQuery";

export default function Bento() {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // 更有趣的小測驗題目
  const quizQuestions = [
    {
      question: "你最想用蜂蜜搭配哪種食物？",
      options: ["熱牛奶", "優格水果", "烤吐司", "直接吃一口"]
    },
    {
      question: "你偏好的蜂蜜口感？",
      options: ["濃稠厚重", "清爽流動", "細膩滑順", "結晶沙沙"]
    },
    {
      question: "你通常什麼時候會吃蜂蜜？",
      options: ["早晨提神", "下午茶點", "運動後補充", "睡前放鬆"]
    }
  ];

  // 根據答案組合給出趣味推薦
  const getQuizResult = (answers: string[]) => {
    if (answers[0] === "熱牛奶" && answers[1] === "濃稠厚重")
      return "推薦【龍眼蜜】——濃郁香氣，熱飲最佳拍檔！";
    if (answers[0] === "優格水果" && answers[2] === "下午茶點")
      return "推薦【百花蜜】——多層次花香，百搭下午茶！";
    if (answers[1] === "結晶沙沙")
      return "推薦【冬蜜】——結晶細緻，口感獨特！";
    if (answers[2] === "運動後補充")
      return "推薦【荔枝蜜】——甜度高，能量補給首選！";
    if (answers[0] === "直接吃一口")
      return "推薦【巢蜜】——原始風味，直接享受蜂巢的美好！";
    return "各種蜂蜜都適合你，快去嘗試不同風味吧！";
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizResult(getQuizResult(newAnswers));
    }
  };
  
  // Modal ESC 關閉功能
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const knowledgeCards = [
    {
      title: "蜂蜜的種類介紹？",
      content: `蜂蜜可根據蜜源植物、加工方式、結晶狀態等不同標準進行分類，以下是幾種常見的分類方式：
                (1) 依蜜源植物分類
                蜂蜜的風味和顏色會受到蜜源植物的影響，
                不同種類的花蜜會造就獨特的蜂蜜風味。
                - 單花蜜：如龍眼蜜、荔枝蜜、蕎麥蜜。
                - 混合蜜（百花蜜）：來自多種花卉，風味豐富。

                (2) 依加工方式分類
                - 原蜜：未經高溫殺菌或過濾。
                - 加工蜜：經過加熱和過濾，部分營養可能流失。
                - 結晶蜜：自然結晶，質地如奶油。

                (3) 依物理狀態分類
                - 液態蜜：剛採收時為液態。
                - 巢蜜：直接取下蜂巢，含蜂蠟與蜂膠。`
    },
    {
      title: "怎麼辨別真假蜜？",
      content: `常見的假蜂蜜類型：
                - 摻糖蜜：加入蔗糖或果糖糖漿。
                - 工業假蜜：完全由糖漿與色素製成。

                辨別方法：
                (1) 觀察流動性：天然蜂蜜流動緩慢，有絲狀感。
                (2) 味道與口感：天然蜂蜜層次豐富，餘韻悠長。
                (3) 水測法：天然蜂蜜會緩慢沉入底部。
                (4) 紙巾吸水法：天然蜂蜜不易滲透紙巾。`
    },
    {
      title: "蜂蜜的保存方式？",
      content: `最佳保存方式：
                (1) 儲存環境：陰涼乾燥，避免陽光與高溫。
                (2) 避免水分：使用乾燥湯匙。
                (3) 容器選擇：玻璃或食品級塑膠最佳。
                (4) 結晶處理：可使用 40°C 溫水回溶。`
    },
    {
      title: "蜂蜜的營養價值？",
      content: `蜂蜜的營養價值：
                蜂蜜含有多種維生素（如B群、C）、礦物質
                （如鉀、鈣、鎂）、胺基酸與天然酵素。
                天然蜂蜜還有抗氧化物，有助於提升免疫力
                與促進消化。`
    }
  ];

  return (
    <div className="bg-yellow-50 py-24 sm:py-32 relative overflow-hidden">
      {/* 蜂蜜流動動畫 */}
      <motion.div
        className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-400 to-transparent"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-amber-700 sm:text-5xl">
          蜂蜜品質檢測平台
        </h1>
        <p className="mt-4 text-center text-lg text-gray-700">
          讓消費者買得安心，讓蜂農賣得放心
        </p>

        {/* Bento Grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* 蜂蜜科普 */}
          <div className="relative lg:row-span-2 bg-white shadow-lg rounded-xl border border-gray-300 p-6">
            <h3 className="text-xl font-semibold text-amber-700 mb-4">蜂蜜科普</h3>
            {knowledgeCards.map((card, index) => (
              <div
                key={index}
                className="cursor-pointer bg-gray-100 p-4 mt-4 rounded-lg whitespace-pre-wrap"
                onClick={() => {
                  setModalContent(card.content);
                  setModalOpen(true);
                }}
              >
                <h4 className="text-lg font-medium text-amber-700">{card.title}</h4>
                <p className="mt-2 text-gray-600 underline">點擊查看更多</p>
              </div>
            ))}
          </div>

          {/* 蜂農故事 */}
          <div className="relative bg-white shadow-lg rounded-xl border border-gray-300 p-6">
            <h3 className="text-xl font-semibold text-amber-700 mb-4">蜂農故事</h3>
            <Link href="/beekeeper-story/1" className="block mb-4">
              <div className="cursor-pointer bg-gray-100 p-4 rounded-lg w-full">
                <h4 className="text-lg font-medium text-amber-700">阿德的養蜂日常</h4>
                <p className="mt-2 text-gray-600">來自台南的小農阿德，世代確保純真蜂蜜。</p>
              </div>
            </Link>
            <Link href="/beekeeper-story/2" className="block">
              <div className="cursor-pointer bg-gray-100 p-4 rounded-lg w-full">
                <h4 className="text-lg font-medium text-amber-700">小芳的山林蜂園</h4>
                <p className="mt-2 text-gray-600">小芳在南投山區與蜜蜂共舞，堅持自然養殖，守護生態。</p>
              </div>
            </Link>
          </div>

          {/* 標章查詢 */}
          <LabelQuery />

          {/* 蜂蜜小測驗 */}
          <div className="relative bg-white shadow-lg rounded-xl border border-gray-300 p-6">
            <h3 className="text-xl font-semibold text-amber-700">蜂蜜小測驗</h3>
            {quizResult === "" ? (
              <>
                <p className="mt-2 text-gray-600">{quizQuestions[quizStep].question}</p>
                {quizQuestions[quizStep].options.map((option) => (
                  <button
                    key={option}
                    className="mt-2 w-full bg-amber-600 hover:bg-amber-700 transition-all text-white p-2 rounded-lg"
                    onClick={() => handleQuizAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </>
            ) : (
              <>
                <p className="mt-2 text-gray-600">
                  {quizResult}
                </p>
                <button
                  className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-lg"
                  onClick={() => {
                    setQuizStep(0);
                    setQuizAnswers([]);
                    setQuizResult("");
                  }}
                >
                  重新測驗
                </button>
              </>
            )}
          </div>
        </div>

        {/* 檢測申請 */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/members/login" className="bg-green-600 hover:bg-green-700 transition-all text-white px-6 py-3 rounded-lg text-lg font-semibold">
            申請蜂蜜檢測
          </Link>
        </div>
      </div>

      {/* 彈出視窗 (Modal) */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <pre className="text-gray-800 whitespace-pre-wrap">{modalContent}</pre>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded-lg"
              onClick={() => setModalOpen(false)}
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
