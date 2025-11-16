import Link from "next/link";
import { useState } from "react";
import ESNLogo from "@/components/esthetic-components/ESNLogo";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className="bg-slate-900 text-white shadow-lg">
                <nav className="px-4 py-4 flex justify-start items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex flex-col gap-1.5 cursor-pointer p-32"
                    >
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                    </button>
                    <div></div>
                    <div className="flex-1 flex justify-center">
                        <ESNLogo/>
                    </div>
                </nav>
            </header>

            {isOpen && (
                <div
                    className="fixed inset-0"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-slate-800 text-white shadow-lg transform transition-transform duration-300 z-50 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4 space-y-4">
                    <Link href="/" className="block py-2 hover:text-blue-400">
                        Events
                    </Link>
                    <Link href="/about" className="block py-2 hover:text-blue-400">
                        About Us
                    </Link>
                    <Link href="/contact" className="block py-2 hover:text-blue-400">
                        Contact
                    </Link>
                </div>
            </aside>
        </>
    );
}