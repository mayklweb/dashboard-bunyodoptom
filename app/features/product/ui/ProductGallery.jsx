import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }) {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-3">
      <div className="w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[active]}
          alt={name}
          width={800}
          height={600}
          className="w-full h-full object-cover"
        />
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
              <Image
                src={src}
                alt={`${name} ${i + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}