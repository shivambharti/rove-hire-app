"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from "lucide-react";
import { signIn } from "next-auth/react"; // Use the client-side signIn
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("login---", res)
    if (res?.error) {
      alert("Invalid credentials!");
      setLoading(false);
    } else {
      router.push("/dashboard"); // Redirect on success
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <main className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <Briefcase className="w-10 h-10 text-[#ad2c00]" />
          </div>
          <h1 className="text-3xl font-bold text-[#ad2c00] tracking-tight">ROVE Hire</h1>
          <p className="text-gray-500 mt-2">Precision Recruitment Tool</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold mb-6">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#ad2c00]/20 focus:border-[#ad2c00] outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-[#ad2c00] hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#ad2c00]/20 focus:border-[#ad2c00] outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 bg-[#ad2c00] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#872000] transition-all disabled:opacity-70"
            >
              {loading ? "Authenticating..." : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}