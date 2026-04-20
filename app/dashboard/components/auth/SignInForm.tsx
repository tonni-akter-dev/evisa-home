"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Image from "next/image";
import closeeye from "../../../../public/eye-close.svg";
import openEye from "../../../../public/eye.svg";
import Label from "../form/Label";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://visa-consultancy-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.msg || "Invalid credentials",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Login Successful 🎉",
          text: "Welcome back!",
        });

        localStorage.setItem("token", data.token); // ✅ Save token
        localStorage.setItem("email", formData.email);
        setFormData({
          email: "",
          password: "",
        });
        router.push("/dashboard/e-visa-list");
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-3xl">Sign In</h1>
          <p className="text-sm text-black ">
            Enter your email and password to sign in!
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                  id="email"
                  name="email"
                  // value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    id="password"
                    name="password"
                    // value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <Image src={openEye} alt="" />
                    ) : (
                      <Image src={closeeye} alt="" />
                    )}
                  </span>
                </div>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  // type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
