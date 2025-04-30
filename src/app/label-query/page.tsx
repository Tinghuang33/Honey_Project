"use client";

import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import LabelQuery from "@/components/LabelQuery";

const Query = () => {


  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="bg-gray-100 flex-1 p-6">
            <div className="mt-4 p-6 bg-white rounded-lg shadow">
              <div className="bg-yellow-50 py-24 sm:py-32 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-400 to-transparent"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                ></motion.div>

                <div className="mx-auto max-w-md px-6 lg:px-8 text-center">
                  <h1 className="text-4xl font-bold text-amber-700 sm:text-5xl">
                    蜂蜜標章查詢
                  </h1>
                  <p className="mt-4 text-lg text-gray-700">
                    輸入標章編號，查詢蜂蜜資訊
                  </p>
                  <br /><br />
                  <LabelQuery/>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Query;
