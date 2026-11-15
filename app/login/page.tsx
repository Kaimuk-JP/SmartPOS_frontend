"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { login } from "@/lib/api/auth";

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);
    // ซ่อนปุ่ม Demo Login เมื่อ build ด้วย NEXT_PUBLIC_HIDE_DEMO_LOGIN=1 (เช่นเซิร์ฟเวอร์จริงที่เปลี่ยนรหัสแล้ว)
    const showDemoLogin = process.env.NEXT_PUBLIC_HIDE_DEMO_LOGIN !== '1';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const performLogin = async (username: string, password: string) => {
        const data = await login(username, password);

        // Store token & user info
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            // Also set a cookie so the middleware can see it
            document.cookie = `access_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
        }
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success(`Welcome back, ${data.user.username}!`);

        // Redirect based on user role
        if (data.user.role === 'admin') {
            router.push('/admin/dashboard');
        } else {
            router.push('/sale');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await performLogin(formData.username, formData.password);
        } catch (error) {
            console.error(error);
            toast.error("เข้าสู่ระบบล้มเหลว ตรวจสอบชื่อผู้ใช้และรหัสผ่าน");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setDemoLoading(true);
        setFormData({ username: "smartpos", password: "123456789" });

        try {
            await performLogin("smartpos", "123456789");
        } catch (error) {
            console.error(error);
            toast.error("Demo login ล้มเหลว กรุณาลองใหม่อีกครั้ง");
        } finally {
            setDemoLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                {/* Decor elements */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex justify-center items-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4 text-indigo-600 shadow-sm">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
                        <p className="text-slate-500 mt-2 text-sm">เข้าสู่ระบบจัดการร้านค้า</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || demoLoading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 mt-4 transition-all ${loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                }`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    {showDemoLogin && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={demoLoading || loading}
                            className={`w-full py-3 rounded-xl font-bold border-2 border-indigo-200 flex items-center justify-center gap-2 transition-all ${demoLoading
                                ? 'bg-indigo-50 text-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 active:scale-95'
                                }`}
                        >
                            {demoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Demo Login</>}
                        </button>
                    </div>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            Secured by Smart POS Cloud
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
