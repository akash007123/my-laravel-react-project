import React from "react";
import { useForm } from "@inertiajs/react";

type FormProps = { onSubmitted?: () => void };

export default function Create({ onSubmitted }: FormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        fullname: "",
        email: "",
        phone: "",
        designation: "",
        company: "",
        message: "",
        rating: 5,
        profile: null as File | null,
        is_active: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post("/testimonials", {
            onSuccess: () => {
                reset();
                onSubmitted?.();
            },
        });
    }

    return (
        <div className="w-full">
    <div className="w-full bg-white rounded-xl shadow p-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Share your feedback
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={data.fullname}
                    onChange={(e) => setData("fullname", e.target.value)}
                    className="input-style"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="input-style"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    placeholder="Phone"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    className="input-style"
                />
                <input
                    type="text"
                    placeholder="Designation"
                    value={data.designation}
                    onChange={(e) => setData("designation", e.target.value)}
                    className="input-style"
                />
            </div>

            <input
                type="text"
                placeholder="Company"
                value={data.company}
                onChange={(e) => setData("company", e.target.value)}
                className="input-style w-full"
            />

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData("profile", e.target.files?.[0] || null)}
                        className="input-style"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Rating</label>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const index = i + 1;
                            const active = index <= (data.rating || 0);
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() => setData("rating", index)}
                                    className="p-0.5"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill={active ? "#FACC15" : "#E5E7EB"}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <textarea
                placeholder="Message"
                value={data.message}
                onChange={(e) => setData("message", e.target.value)}
                rows={3}
                className="input-style w-full"
            />

            <button
                type="submit"
                disabled={processing}
                className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
            >
                {processing ? "Saving..." : "Submit"}
            </button>
        </form>
    </div>
</div>

    );
}
