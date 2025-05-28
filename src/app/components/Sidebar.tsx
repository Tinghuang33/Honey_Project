"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from "@/components/AuthContext"; // ←這邊引用你自己的 AuthContext

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();

  const memberItems = [
    { key: 'sub1', label: '-會員中心-', 
      children: [
        { name: '會員資料', link: '/dashboard/profile' },
        { name: '提供蜂農故事', link: '/dashboard/story' },
        { name: '提供蜂蜜知識', link: '/dashboard/bee-education' },
      ]
    },
    { key: 'sub2', label: '-標章管理-', 
      children: [
        { name: '申請檢測', link: '/dashboard/apply' },
        { name: '申請紀錄', link: '/dashboard/record' },
      ]
    },
  ];

  const visitorItems = [
    { key: 'sub3', label: '-有關蜂農-', 
      children: [
        { name: '蜂農故事', link: '/display/self-story' },
        { name: '蜂蜜科普', link: '/display/knowledge' },
        { name: '關於我們', link: '/display/about-us' },
        { name: '查詢標章', link: '/label-query' },
      ]
    },
  ];

  return (
    <aside className="w-64 bg-amber-50 text-yellow-500 text-center p-4">
      <ul>

        {/* 如果有登入，顯示會員功能 */}
        {isAuthenticated && memberItems.map(submenu => (
          <li key={submenu.key}>
            <div className="text-xl text-center font-bold space-x-2">
              <span>{submenu.label}</span>
            </div>
            <ul className="p-4">
              {submenu.children.map((option, index) => (
                <li className="p-2 hover:underline" key={index}>
                  <Link href={option.link}>{option.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}

        {/* 不管有沒有登入都顯示蜂農相關功能 */}
        {visitorItems.map(submenu => (
          <li key={submenu.key}>
            <div className="text-xl text-center font-bold space-x-2">
              <span>{submenu.label}</span>
            </div>
            <ul className="p-4">
              {submenu.children.map((option, index) => (
                <li className="p-2 hover:underline" key={index}>
                  <Link href={option.link}>{option.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}

        {isAuthenticated && (
          <div className="mt-4">
            <button 
              onClick={logout} 
              className="text-red-500 font-bold hover:underline"
            >
              登出
            </button>
          </div>
        )}

      </ul>
    </aside>
  );
};

export default Sidebar;
