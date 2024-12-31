import { useState, useEffect } from "react";

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Nettoyage de l'événement lors du démontage du composant
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

export default useWindowDimensions;
