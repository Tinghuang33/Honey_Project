"use client";

import axiosInstance from "../../utils/axiosConfig";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthProvider } from "@/components/AuthContext";
import Footer from "@/components/Footer";
import NavbarAdmin from "@/components/Navbar-admin";


// 定義用戶角色類型
type UserRole = "user" | "inspector" | "admin";

const RoleControl: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [role, setRole] = useState<UserRole>("user");
  const [message, setMessage] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("user");

  useEffect(() => {
    axiosInstance
      .get(`get_user_info/${localStorage.getItem("account")}`)
      .then((res) => setUserRole(res.data.role))
      .catch((err) => console.error("Failed to fetch user role", err));
  }, []);

  const handleRoleChange = async () => {
    if (userRole !== "admin") {
      setMessage("❌ 你沒有權限更改角色！");
      return;
    }

    if (!account || !role) {
      setMessage("⚠️ 請輸入完整的帳號與角色！");
      return;
    }

    try {
      const response = await axiosInstance.patch(`/change_role/${localStorage.getItem("token")}`, {
        account: account,
        role: role,
      });
      if (response.status === 200) {
        setMessage(`✅ 成功將帳號 ${account} 的角色設置為 ${role}！`);
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      setMessage("❌ 更改角色失敗，請檢查帳號或網路問題！");
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <NavbarAdmin />
        <main className="bg-gray-100 flex-1 p-6">
          <div className="bg-green-50 py-24 sm:py-32 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyan-800 to-transparent"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <div className="relative z-10 max-w-lg mx-auto text-center text-gray-700">
              <h1 className="text-xl font-bold mb-4">用戶角色設定</h1>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="輸入用戶帳號"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="user">User</option>
                  <option value="inspector">Inspector</option>
                </select>
                <button
                  onClick={handleRoleChange}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  更改角色
                </button>
                {message && <p className="text-gray-700 mt-2">{message}</p>}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default RoleControl;