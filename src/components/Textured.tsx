import { useRef } from "react";
import { Mesh } from "three";
import { useTexture } from "@react-three/drei";
import img from "/textures/asphalt/asphalt_02_diff_1k.png";
import { useFrame } from "@react-three/fiber";

interface TexturedProps {
  position: [number, number, number];
}

export const Textured: React.FC<TexturedProps> = ({ position }) => {
  const map = useTexture(img);
  const myMesh = useRef<Mesh>(null!);
  const normalMap = useTexture("/textures/asphalt/asphalt_02_nor_gl_1k.png");
  const roughnessMap = useTexture("/textures/asphalt/asphalt_02_rough_1k.png");
  useFrame(({ clock }) => {
    myMesh.current.rotation.x = clock.getElapsedTime();
  });
  return (
    <>
      <mesh
        ref={myMesh}
        visible
        scale={[0.5, 0.5, 0.5]}
        position={position}
        castShadow
      >
        <sphereGeometry args={[1, 200, 200]} />
        <meshStandardMaterial
          map={map}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementScale={0.05}
        />
      </mesh>
    </>
  );
};
