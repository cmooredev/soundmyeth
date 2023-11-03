import { useRef } from "react";

export const Lights: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[0, 10, 10]}
        castShadow
        shadow-mapSize-height={1000}
        shadow-mapSize-width={1000}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={["#00FF00", "#00FFFF", 5]} />
    </>
  );
};
