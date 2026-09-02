import { useCartStore } from "../../../app/store/useCartStore";
import { useFavoritesStore } from "../../../app/store/useFavoritesStore";
import { FavoriteIcon, MinusIcon, PlusIcon } from "../../../assets/icons";

export default function ProductActions({ product }) {
  const { addToCart, inc, dec, remove, getQuantity } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const qty = getQuantity(product.id);
  const liked = isFavorite(product.id);

  return (
    <div className="flex gap-4 mt-2">
      <button
        onClick={() => toggleFavorite(product)}
        className="bg-accent p-4 rounded-xl"
      >
        <FavoriteIcon
          className={liked ? "fill-error text-error" : "text-black"}
        />
      </button>

      {qty === 0 ? (
        <button
          onClick={() =>
            addToCart({
              ...product,
              count: 1,
              mainImage: `https://api.bunyodoptom.uz${product?.images[0].url}`,
            })
          }
          className="w-full h-12 bg-primary text-white rounded-xl"
        >
          Savatga qo'shish
        </button>
      ) : (
        <div className="flex w-full justify-between bg-primary/10 rounded-xl p-2">
          <button
            onClick={() => (qty === 1 ? remove(product.id) : dec(product.id))}
          >
            <MinusIcon />
          </button>
          <span>{qty}</span>
          <button onClick={() => inc(product.id)}>
            <PlusIcon />
          </button>
        </div>
      )}
    </div>
  );
}
