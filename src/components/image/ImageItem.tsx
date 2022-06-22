import { useEffect, useState } from "react";
import { Placeholder } from "rsuite";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import "react-lazy-load-image-component/src/effects/blur.css";

interface Props {
  url: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  isMobile: boolean;
  containerWidth: number;
  onPress: () => void;
}

const ImageItem: React.FC<Props> = ({
  url,
  width,
  height,
  style,
  isMobile,
  containerWidth,
  onPress,
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    console.log(containerWidth);
  }, [containerWidth]);

  return (
    <div className="image-container">
      {!imageLoaded && (
        <Placeholder.Graph
          active
          style={{
            width: isMobile
              ? `calc(${document.body.offsetWidth * 0.6}px - 20px - 1.2rem)`
              : `calc(${containerWidth * 0.4}px - 20px - 1.6rem)`,
            height: isMobile ? "40vh" : "50vh",
          }}
        />
      )}
      {/* <LazyLoadImage alt={url} effect="blur" src={url} style={style} /> */}
      <img
        src={url}
        alt={url}
        width={width}
        height={height}
        className={`${imageLoaded ? "" : "d-none"}`}
        style={style}
        onLoad={() => {
          setImageLoaded(true);
        }}
        onClick={onPress}
      />
    </div>
  );
};

export default ImageItem;
