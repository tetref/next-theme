import { getProductIds } from "@dashboardpack/core/lib/data";
import EditProduct from "./edit-product";

export function generateStaticParams() {
  return getProductIds().map((id) => ({ id }));
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditProduct params={params} />;
}
