import { getOrderIds } from "@dashboardpack/core/lib/data";
import OrderDetail from "./order-detail";

export function generateStaticParams() {
  return getOrderIds().map((id) => ({ id }));
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <OrderDetail params={params} />;
}
