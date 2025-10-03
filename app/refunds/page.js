"use client"
import Navbar from "@/components/navbar";

export default function RefundsPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white px-20 py-12 mx-auto">
                <h1 className="text-4xl font-bold text-amber-400 mb-6 text-center">Cancellation & Refund Policy</h1>
                <p className="text-gray-300 mb-4 text-sm text-center">Last updated on 21-07-2025 17:23:37</p>

                <p className="text-gray-300 mb-4 text-lg">
                    KANCHAN SHUKLA believes in helping its customers as far as possible, and has therefore a liberal
                    cancellation policy. Under this policy:
                </p>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                    <li>Cancellations will be considered only if the request is made immediately after placing the order.
                        However, the cancellation request may not be entertained if the orders have been communicated to the
                        vendors/merchants and they have initiated the process of shipping them</li>
                    <li>KANCHAN SHUKLA does not accept cancellation requests for perishable items like flowers, eatables
                        etc. However, refund/replacement can be made if the customer establishes that the quality of product
                        delivered is not good.
                    </li>
                    <li>In case of receipt of damaged or defective items please report the same to our Customer Service team.
                        The request will, however, be entertained once the merchant has checked and determined the same at his
                        own end. This should be reported within 7 Days days of receipt of the products. In case you feel that the
                        product received is not as shown on the site or as per your expectations, you must bring it to the notice of
                        our customer service within 7 Days days of receiving the product. The Customer Service Team after
                        looking into your complaint will take an appropriate decision.
                    </li>
                    <li>In case of complaints regarding products that come with a warranty from manufacturers, please refer
                        the issue to them. In case of any Refunds approved by the KANCHAN SHUKLA, it’ll take 1-2 Days
                        days for the refund to be processed to the end customer.</li>
                </ul>
            </div>
        </>
    )
}
