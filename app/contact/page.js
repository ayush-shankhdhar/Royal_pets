"use client"

import Navbar from "@/components/navbar"

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white py-12 px-20">
                <h1 className="text-4xl font-bold mb-6 text-center text-amber-400">Contact Us</h1>
                <p className="mb-4 text-gray-300 text-lg">
                    <span className="text-white font-semibold">Last updated on 19-07-2025 20:48:07</span><br /><br /><br />You may contact us using the information below:</p>
                <p className="mb-4 text-gray-300 text-lg">Merchant Legal entity name: KANCHAN SHUKLA</p>
                <p className="mb-4 text-gray-300 text-lg">Registered Address: Bareilly, UTTAR PRADESH, PIN: 243001</p>
                <p className="mb-4 text-gray-300 text-lg">Operational Address: Bareilly cantt s.o, bareilly, uttar pradesh, india, 243001</p>
                <p className="mb-4 text-gray-300 text-lg">Bareilly, UTTAR PRADESH, PIN: 243001</p>
                <p className="mb-4 text-gray-300 text-lg">Telephone No: 8630212263</p>
                <p className="mb-4 text-gray-300 text-lg">E-Mail ID: kanchanshukla8630@gmail.com</p>
            </div>
        </>
    )
}
