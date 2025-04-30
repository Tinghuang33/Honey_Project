"use client";

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Bento from '../components/Bento';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from "@/components/AuthContext";

const Home = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="bg-gray-100 flex-1 p-6">
            <div className="mt-4 p-6 bg-white rounded-lg shadow">
              <Bento />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Home;