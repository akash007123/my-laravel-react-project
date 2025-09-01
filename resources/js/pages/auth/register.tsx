import { Head, useForm, Link} from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { motion } from "framer-motion";

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
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
                    className="max-w-5xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden"
                >
                    
                    {/* Left Side: Form */}
                    <div className="p-6 flex flex-col justify-center">
                        <div className="text-center mb-6">
                            <motion.h2
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                                className="text-2xl font-extrabold text-gray-800"
                            >
                                Create an Account
                            </motion.h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                Join us today and unlock amazing features ✨
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`mt-1 w-full p-3 rounded-lg border transition shadow-sm ${
                                        errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className={`mt-1 w-full p-3 rounded-lg border transition shadow-sm ${
                                        errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Password</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className={`mt-1 w-full p-3 rounded-lg border transition shadow-sm ${
                                        errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block font-medium text-gray-700 text-sm">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className={`mt-1 w-full p-3 rounded-lg border transition shadow-sm ${
                                        errors.password_confirmation ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold text-base shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? 'Creating Account...' : 'Create Account'}
                            </motion.button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 mt-4 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                                Log in
                            </Link>
                        </p>
                    </div>

                    {/* Right Side: Illustration with Animation */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hidden md:flex bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-8"
                    >
                        <motion.img
                            src="https://www.icegif.com/wp-content/uploads/2025/01/bird-icegif-1.gif"
                            alt="Signup Illustration"
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
