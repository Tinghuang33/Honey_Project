"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosConfig";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const account = localStorage.getItem("account");

    if (!token || !account) {
      console.error("No token or account found in localStorage");
      router.push("/home");
      return;
    }

    try {
      axiosInstance
        .get(`/get_user_info/${account}`)
        .then((res) => {
          const role = res.data.role;
          console.log("User role:", role);

          if (role === "inspector") {
            router.push("/inspector");
          } else if (role === "user") {
            router.push("/dashboard");
          } else if (role === "admin") {
            router.push("/role-control");
          } else {
            router.push("/home");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user role", err);
          router.push("/home");
        });
    } catch (err) {
      console.error("Invalid Token", err);
      router.push("/home");
    }
  }, []);

  return null;
}