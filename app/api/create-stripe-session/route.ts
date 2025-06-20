/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/create-stripe-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  const { orderId, items, customer } = await req.json();

  // Fallback logic for base URL (local/dev/prod safe)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    customer_email: customer.email,
    success_url: `${baseUrl}/checkout/success?order=${orderId}`,
    cancel_url: `${baseUrl}/checkout/cancel?order=${orderId}`,
    metadata: {
      orderId,
      customerEmail: customer.email,
    },
  });

  return NextResponse.json({ id: session.id, url: session.url });
}
