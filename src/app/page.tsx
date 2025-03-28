"use client";
import Image from "next/image";
import { use, useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect to dashboard
      window.location.href = "/users";
    } else {
      // Redirect to login
      window.location.href = "/login";
    }
  }, []);
  return <></>;
}
