export default function ProductDetails({ product }) {
  const details = [
    { label: "Narxi", value: `${product.price.toLocaleString()} so'm` },
    product.kg_price && {
      label: "Kg narxi",
      value: `${product.kg_price.toLocaleString()} so'm`,
    },
    product.piece_price && {
      label: "Dona narxi",
      value: `${product.piece_price.toLocaleString()} so'm`,
    },
    {
      label: "Mavjud",
      value: product.stock_qty > 0 ? `${product.stock_qty} dona` : "Tugagan",
      valueClass:
        product.stock_qty > 0 ? "text-green-500" : "text-red-500",
    },
  ].filter(Boolean);

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      {details.map(({ label, value, valueClass }) => (
        <div key={label} className="flex items-center gap-2">
          <p className="text-sm text-gray-500">{label}</p>
          <div className="flex-auto border-b border-dotted" />
          <p className={`text-sm font-semibold ${valueClass ?? ""}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}