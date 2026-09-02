import ProductCard from "./ProductCard";

export default function RecommendedProducts({ products}) {
  return (
    <section className="mt-10 pb-20">
      <div className="container">
        <h2 className="text-xl font-semibold mb-5">Tavsiya etilgan mahsulotlar</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((item) => (
              <ProductCard product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}