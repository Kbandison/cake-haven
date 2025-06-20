/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabaseClient";

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  // Get the raw body as a buffer
  const rawBody = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle event types
  switch (event.type) {
    // app/api/webhook/route.ts (snippet)
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      // 1. Mark order as paid
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      // 2. Get order items
      const { data: items } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      // 3. Decrement stock
      if (items) {
        for (const item of items) {
          await supabase.rpc("decrement_product_stock", {
            product_id: item.product_id,
            qty: item.quantity,
          });
        }
      }
      break;
    }

    // Optional: handle more event types
    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
