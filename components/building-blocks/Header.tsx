"use client";

import Link from "next/link";
import { useState } from "react";
import ESNLogo from "@/components/esthetic-components/ESNLogo";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            <header className="top-0 left-0 right-0 bg-slate-900 text-white shadow-lg z-10">
                <nav className="px-4 py-4 flex justify-start items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex flex-col gap-1.5 cursor-pointer p-6"
                    >
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                    </button>
                    <div></div>
                    <div className="flex-1 flex justify-center">
                        <ESNLogo link={true}/>
                    </div>
                </nav>
            </header>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-50 transition duration-300 ease-in-out"
                    onClick={closeMenu}
                ></div>
            )}

            <aside
                className={`top-0 left-0 h-full w-64 bg-slate-800 text-white shadow-lg transform transition-transform duration-300 z-50 fixed ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4 space-y-4">
                    <Link href="/events" className="block py-2 hover:text-blue-400" onClick={closeMenu}>
                        Events
                    </Link>
                    <Link href="/about" className="block py-2 hover:text-blue-400" onClick={closeMenu}>
                        About Us
                    </Link>
                    <Link href="/contact" className="block py-2 hover:text-blue-400" onClick={closeMenu}>
                        Contact
                    </Link>
                </div>
            </aside>
        </>
    );
}