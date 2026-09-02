import { useState } from "react";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-3">
      <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
        <img src={images[active]} alt={name} className="w-full h-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                active === i ? "border-primary" : "border-white"
              }`}
            >
              <img src={src} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}