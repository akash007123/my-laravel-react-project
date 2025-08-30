import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC] flex flex-col">
                <header className="w-full p-6 lg:px-12 flex justify-between items-center shadow-sm bg-white dark:bg-[#111]">
                    <div className="text-xl font-semibold">Ayush Gawde</div>
                    <nav className="flex gap-4 text-sm">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded border px-4 py-1.5 hover:border-gray-400 dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded border px-4 py-1.5 hover:border-gray-400 dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded border px-4 py-1.5 hover:border-gray-400 dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 px-6 py-16 lg:px-20">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold mb-4">Welcome to <span className="text-blue-600">Ayush's Community</span></h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                            Make connections and grow with us.
                        </p>
                        <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
                            Ayush's Community is a space for creators, learners, and builders to come together and thrive. Whether you're just starting out or looking to expand your network, you'll find support, inspiration, and opportunities here.
                        </p>
                        <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
                            Join discussions, attend live events, share your projects, or simply connect with like-minded people who are as passionate as you are. Growth is better together.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href={route('register')}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Join the Community
                            </Link>
                            {/* <Link
                                href={route('login')}
                                className="text-blue-600 hover:underline"
                            >
                                Already have an account?
                            </Link> */}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <img
                            className="w-64 h-64 lg:w-80 lg:h-100 object-cover rounded-xl shadow-lg"
                            src="https://ik.imagekit.io/sentyaztie/1755843575_Image_20250806_173846.jpeg?updatedAt=1756451723962"
                            alt="Profilics Logo"
                        />
                    </div>
                </section>

                {/* <section className="bg-gray-100 dark:bg-[#1b1b1b] py-16 px-6 lg:px-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded shadow">
                            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Fast" className="h-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Optimized for speed and responsiveness so your users have the best experience.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded shadow">
                            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png" alt="Secure" className="h-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Built with best practices for security and scalability.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded shadow">
                            <img src="https://cdn-icons-png.flaticon.com/512/3208/3208676.png" alt="Community" className="h-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Active Community</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Join a growing network of contributors and developers building together.
                            </p>
                        </div>
                    </div>
                </section> */}

                <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                    © {new Date().getFullYear()} Ayush's Community. All rights reserved.
                </footer>
            </div>
        </>
    );
}
