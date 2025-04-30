"use client";

import axiosInstance from "../../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

interface StoryData {
  name: string;
  apiray_name: string;
  apiray_address: string;
  story: string;
}

export default function Self_story() {
  const [stories, setStories] = useState<StoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/get_all_story");
        setStories(response.data);
      } catch (error) {
        console.error("取得故事失敗", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="bg-gray-100 flex-1 p-6">
            <div className="mt-4 p-6 bg-white rounded-lg shadow">
              <div className="bg-yellow-50 py-24 sm:py-32 relative overflow-hidden">
                {/* 蜂蜜流動動畫 */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-400 to-transparent"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                ></motion.div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <h1 className="text-4xl text-center font-bold text-amber-700 sm:text-5xl">
                    蜂農故事
                  </h1>
                  <p className="mt-4 text-center text-lg text-gray-700">
                    介紹一些蜂農故事~
                  </p>
                  {loading ? (
                    <p className="text-center text-gray-600">載入中...</p>
                  ) : (
                    <Swiper spaceBetween={10} slidesPerView={3} autoplay={{ delay: 3000 }}>
                      {stories.map((story, index) => (
                        <SwiperSlide key={index}>
                          <div className="mb-4 p-4 border rounded-lg bg-white shadow">
                            <p className="mt-2 font-semibold text-amber-700">蜂農：{story.name}</p>
                            <p className="mt-2 font-semibold text-amber-700">經營蜂場：{story.apiray_name}</p>
                            <p className="mt-2 font-semibold text-amber-700">蜂場地址：{story.apiray_address}</p>
                            <p className="mt-2 text-gray-700">血汗故事：{story.story}</p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}