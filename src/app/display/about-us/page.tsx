"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaClipboardList, FaSeedling, FaMobileAlt, FaUserShield } from "react-icons/fa";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
// import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="bg-gray-100 flex-1 p-6">
            <div className="mt-4 p-6 bg-white rounded-lg shadow relative overflow-hidden">
              {/* <Image
                src="/images/honey-bg.jpg"
                alt="蜂蜜背景"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 w-full h-full opacity-10 z-0"
              /> */}
              <div className="relative z-10">
                <div className="bg-yellow-50 py-24 sm:py-32 relative overflow-hidden rounded-xl">
                  <motion.div
                    className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-400 to-transparent"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  ></motion.div>
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h1 className="text-4xl text-center font-bold text-amber-700 sm:text-5xl">
                      關於我們
                    </h1>
                    <motion.div
                      className="mt-6 text-center text-lg text-gray-700 space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p><strong>
                        我們是一群來自嘉義大學資訊管理學系的學生，開發「TRUST 蜜」蜂蜜檢測系統，
                        希望建立一個快速、準確、低成本的蜂蜜檢測平台。
                      </strong></p>
                      <p><strong>
                        相較於傳統需昂貴儀器的方式，我們以奈米銀試劑搭配手機影像技術，
                        判斷蜂蜜摻糖比例並即時給出結果，讓蜂農可在有需要時透過此網頁平台申請檢測，
                        獲取檢測標章自證產品純度。
                      </strong></p>
                      <p><strong>
                        同時，網頁平台整合檢測申請、檢測紀錄查詢、標章認證查詢、蜂農故事展示、
                        蜂蜜科普等功能，提升蜂蜜產業透明度與消費者信任度。
                      </strong></p>
                    </motion.div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <FeatureCard icon={<FaCheckCircle className="text-green-500 w-6 h-6" />} title="檢驗成本低廉" desc="僅約 1000 元，友善中小蜂農。" />
                      <FeatureCard icon={<FaMobileAlt className="text-blue-500 w-6 h-6" />} title="快速行動檢測" desc="現場檢測，幾分鐘內出結果。" />
                      <FeatureCard icon={<FaClipboardList className="text-orange-500 w-6 h-6" />} title="多功能平台整合" desc="集結申請、紀錄、提醒、知識。" />
                      <FeatureCard icon={<FaUserShield className="text-purple-500 w-6 h-6" />} title="提升市場信任度" desc="透過標章讓消費者安心選購。" />
                      <FeatureCard icon={<FaSeedling className="text-lime-600 w-6 h-6" />} title="推動永續發展" desc="為台灣蜂蜜建立良性循環。" />
                    </div>

                    <div className="mt-16">
                      <h2 className="text-2xl font-semibold text-amber-700 mb-4">蜂農操作流程</h2>
                      <ol className="font-bold list-decimal pl-6 text-gray-700 space-y-2">
                        <li>註冊與登入平台帳號</li>
                        <li>線上申請蜂蜜檢驗</li>
                        <li>等待檢測人員前往現場</li>
                        <li>以手機錄製反應過程，系統分析判定純度</li>
                        <li>合格者獲發檢測標章，可供消費者查詢</li>
                      </ol>
                    </div>

                    <div className="mt-16">
                      <h2 className="text-2xl font-semibold text-amber-700 mb-4">影片示範流程</h2>
                      <div className="aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg">
                        <video
                          src="/videos/demo.mp4"
                          title="蜂蜜檢測示範影片"
                          controls
                          className="w-full h-full"
                        ></video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </AuthProvider>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      className="flex flex-col items-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
      whileHover={{ scale: 1.05 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-amber-700 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm text-center">{desc}</p>
    </motion.div>
  );
}