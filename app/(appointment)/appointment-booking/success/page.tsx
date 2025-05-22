import { razorpayInstance } from "@/lib/razorpay";
import { PaymentDetails } from "@/components/others/payment-details";
import { notFound } from "next/navigation";

export default async function PaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  try {
    const order = await razorpayInstance.orders.fetch(orderId);

    if (!order) {
      return notFound();
    }

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
        <PaymentDetails
          orderId={order.id}
          amount={Number(order.amount) / 100}
          currency={order.currency}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return notFound();
  }
}
