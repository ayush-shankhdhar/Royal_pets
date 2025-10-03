import { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <PaymentSuccessPage />
    </Suspense>
  );
}