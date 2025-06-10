/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
//interface
interface ImageProps {
  src: string;
  local: boolean | undefined;
  style?: React.CSSProperties | undefined;
  name: string;
  className?: string;
  image?: boolean;
  width?: number;
  height?: number;
}

const Img = ({ src, local, name, className, width, height }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (local) {
    return <img className={className} src={src} alt={`${name}-Image`} />;
  }

  useEffect(() => {
    const handleImageLoad = () => setIsLoading(false);
    const handleImageError = () => setError("Image failed to load.");

    const image = new Image();
    image.onload = handleImageLoad;
    image.onerror = handleImageError;
    image.src = src;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  if (isLoading) {
    return (
      <div style={{ width: "100%", height: "auto", display: "grid" }}>
        <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>
          Image is loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", height: "auto", display: "grid" }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "red",
            textAlign: "justify",
          }}
        >
          Failed to load the Image:
          {error}
        </p>
      </div>
    );
  }

  return (
    <img
      width={width}
      height={height}
      className={className}
      src={src}
      alt={`${src}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "placeholder.svg";
      }}
    />
  );
};

export default Img;
