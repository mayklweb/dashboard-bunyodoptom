import { Link } from "react-router-dom";
import { FavoriteIcon } from "../../../assets/icons";
import { useFavoritesStore } from "../../../app/store/useFavoritesStore";

function ProductCard({ product, onClick }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const liked = isFavorite(product?.id);

  const imagePath = product?.images?.[0]?.url;

  const imageUrl = `https://api.bunyodoptom.uz${imagePath}`;

  const cardClass = "flex flex-col items-start gap-5 border-0 shadow-none";

  const content = (
    <div className="w-full relative">
      <div className="rounded-xl overflow-hidden mb-2.5">
        <img
          width={300}
          height={225}
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start gap-0.5 w-full">
        <h2 className="w-full font-medium text-black text-base tracking-tight leading-[100%] truncate">
          {product.name}
        </h2>
        <p className="font-medium text-[#000000cc] text-base tracking-tight">
          {product.price?.toLocaleString()} so'm
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => toggleFavorite(product)}
        className="p-1 absolute top-2 right-2 z-[3] bg-white rounded-full cursor-pointer"
      >
        <FavoriteIcon
          className={`w-5 h-5 transition-colors ${
            liked ? "fill-red text-red" : "text-black"
          }`}
        />
      </button>

      {onClick ? (
        <div onClick={onClick} className={`${cardClass} cursor-pointer`}>
          {content}
        </div>
      ) : (
        <Link to={`/product/${product.id}`} className={cardClass}>
          {content}
        </Link>
      )}
    </div>
  );
}

export default ProductCard;
