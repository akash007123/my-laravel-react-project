import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { motion } from "framer-motion";

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden px-4">
      
                {/* Floating 3D Elements */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: [0, -20, 0], opacity: 1 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-2xl blur-lg"
                />
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: [0, 20, 0], opacity: 1 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 right-10 w-28 h-28 rounded-3xl bg-gradient-to-tr from-indigo-400 to-purple-600 shadow-xl blur-md rotate-12"
                />

                {/* Glassmorphism Card */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-6xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
                >
                    
                    {/* Left Side: Form */}
                    <div className="p-8 flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <motion.h2
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="text-3xl font-extrabold text-gray-800"
                            >
                                Welcome Back
                            </motion.h2>
                            <p className="text-gray-500 mt-3 text-lg">
                                Sign in to your account to continue ✨
                            </p>
                        </div>

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm text-center"
                            >
                                {status}
                            </motion.div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className={`mt-1 w-full p-4 rounded-lg border transition shadow-sm ${
                                        errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block font-medium text-gray-700">Password</label>
                                    {canResetPassword && (
                                        <a href={route('password.request')} className="text-sm text-blue-600 hover:underline">
                                            Forgot password?
                                        </a>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className={`mt-1 w-full p-4 rounded-lg border transition shadow-sm ${
                                        errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-lg font-semibold text-lg shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                                {processing ? 'Signing In...' : 'Sign In'}
                            </motion.button>
                        </form>

                        {/* Register Link */}
                        <p className="text-center text-gray-600 mt-6">
                            Don't have an account?{" "}
                            <a href={route('register')} className="text-blue-600 hover:underline font-semibold">
                                Sign up
                            </a>
                        </p>
                    </div>

                    {/* Right Side: Illustration with Animation */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hidden md:flex bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-10"
                    >
                        <motion.img
                            src="https://www.icegif.com/wp-content/uploads/2025/01/bird-icegif-1.gif"
                            alt="Login Illustration"
                            className="w-4/5 drop-shadow-2xl"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}
