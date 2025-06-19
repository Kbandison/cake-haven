// /app/orders/page.tsx
import { OrdersProvider } from "@/context/OrdersContext";

export default function OrdersPage() {
  return (
    <OrdersProvider>
      <OrdersTableOrHistoryComponent />
    </OrdersProvider>
  );
}
