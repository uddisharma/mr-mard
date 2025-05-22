import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(
  amount: number,
  currency = "INR",
  receipt: string,
) {
  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    });

    return { success: true, data: order };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return { success: false, error: "Failed to create payment order" };
  }
}

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string = process.env.NEXT_PUBLIC_RAZORPAY_WEBHOOK_SECRET || "",
) {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}
