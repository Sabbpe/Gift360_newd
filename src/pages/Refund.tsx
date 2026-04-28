import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Refund() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>
          
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. General Refund Principles</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Refunds are governed by RBI PPI rules and Gift360 internal policies.</li>
                <li>Refunds are provided only in exceptional cases.</li>
                <li>Once a voucher is issued/activated, a refund is generally not possible unless mandated by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Refund Eligibility Scenarios</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">a) Technical Errors</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Platform malfunction or system error leads to duplicate charges.</li>
                <li>Voucher codes not being generated/delivered after successful payment.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">b) Payment Issues</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Payment debited but voucher not issued within the stipulated time (usually 24-48 hours).</li>
                <li>Unintended multiple debits for the same transaction.</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">c) Voucher Activation Errors</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Voucher cannot be redeemed due to platform or brand-end technical issues.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Non-Refundable Situations</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Change of mind after purchase.</li>
                <li>Partial use of a voucher.</li>
                <li>Voucher already activated/redeemed (even partially).</li>
                <li>Expired vouchers (unless technical error is proven).</li>
                <li>Loss or theft of voucher code (user responsibility to safeguard codes).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Refund Process</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Step 1: Request Submission</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Users must submit a refund request via email or in-app support within 7 days of purchase.</li>
                    <li>Provide transaction ID, proof of payment, and detailed reason for refund.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Step 2: Review & Approval</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Gift360 team reviews the request within 5-7 business days.</li>
                    <li>Users may be asked to provide additional information or documentation.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Step 3: Refund Processing</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>If approved, refund will be processed to the original payment method.</li>
                    <li>Refund timeline: 7-14 business days depending on the bank/payment gateway.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Orders can only be cancelled before voucher generation/activation.</li>
                <li>Post-activation, cancellation is not possible unless there's a technical error on Gift360's end.</li>
                <li>For bulk orders, cancellation must be requested within 24 hours of order placement.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Contact for Refund Queries</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@gift360.io
                </p>
                {/* <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +91-XXXXXXXXXX
                </p> */}
                <p className="text-gray-700">
                  <strong>Support Hours:</strong> Mon-Sat, 9:00 AM - 6:00 PM IST
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gift360 reserves the right to reject refund requests that don't meet eligibility criteria.</li>
                <li>This policy is subject to change; users will be notified of updates via email or platform notifications.</li>
                <li>For disputes, users can escalate to regulatory authorities as per RBI PPI guidelines.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
