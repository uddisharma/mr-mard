"use server";

import { orderSchema } from "@/schemas";
import crypto from "crypto";
import { z } from "zod";
//@ts-ignore
import { createOrder } from "@/lib/razorpay";
import { generateQRCode } from "@/lib/qrcode";
import { v4 as uuidv4 } from "uuid";

type OrderResponse = {
  success: boolean;
  orderId?: string;
  keyId?: string;
  error?: string;
};

export async function createOrder(
  data: z.infer<typeof orderSchema>,
): Promise<OrderResponse> {
  try {
    const validatedData = orderSchema.parse(data);

    const url = "https://api.razorpay.com/v1/orders";

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials are not configured");
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.description || "Failed to create order");
    }

    return {
      success: true,
      orderId: result.id,
      keyId: keyId,
    };
  } catch (error) {
    console.error("Order creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): Promise<boolean> {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("Razorpay secret key is not configured");
    }

    const payload = `${orderId}|${paymentId}`;

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(payload);
    const generatedSignature = hmac.digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function createPaymentOrder(formData: FormData) {
  try {
    const amountStr = formData.get("amount") as string;
    const amount = Number.parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
      return { success: false, error: "Invalid amount" };
    }

    const receipt = `receipt_${uuidv4()}`;

    const orderResponse = await createOrder({
      amount,
      currency: "INR",
      receipt,
    });

    if (!orderResponse.success) {
      return orderResponse;
    }

    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/${orderResponse.orderId}`;

    const qrCodeDataUrl = await generateQRCode(paymentUrl);

    return {
      success: true,
      data: {
        order: orderResponse.orderId,
        qrCode: qrCodeDataUrl,
        paymentUrl,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
