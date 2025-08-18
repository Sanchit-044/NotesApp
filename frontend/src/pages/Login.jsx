import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login({ onNavigate, onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  // ✅ Frontend validation
  const validate = () => {
    const errors = [];
    if (!email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push("Invalid email format");
    }

    if (!pw) {
      errors.push("Password is required");
    } else if (pw.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    return errors;
  };

  const login = async () => {
    // Run validation before hitting backend
    const errors = validate();
    if (errors.length > 0) {
      setMsg(errors.join(", "));
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        onLogin(); // ✅ update App state
        onNavigate("dashboard");
      } else {
        if (data.errors) {
          // show multiple backend errors if any
          setMsg(data.errors.map((err) => err.msg).join(", "));
        } else {
          setMsg(data.msg || "Incorrect email or password");
        }
      }
    } catch (err) {
      setMsg("Network error, please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-0">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center
