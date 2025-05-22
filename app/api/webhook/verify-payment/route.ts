import { verifyWebhookSignature } from "@/lib/razorpay";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 400 },
      );
    }

    const isValidSignature = verifyWebhookSignature(
      rawBody,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(payload.payload.payment.entity);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload.payload.payment.entity);
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  console.log("Payment captured:", payment.id, payment);
  // await db.payments.update({ id: payment.order_id, status: 'completed' })
}

async function handlePaymentFailed(payment: any) {
  console.log("Payment failed:", payment.id, payment);
  // await db.payments.update({ id: payment.order_id, status: 'failed' })
}
