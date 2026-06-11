import { getProductIds } from "@dashboardpack/core/lib/data";
import ProductDetail from "./product-detail";

export function generateStaticParams() {
  return getProductIds().map((id) => ({ id }));
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductDetail params={params} />;
}
