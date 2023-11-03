import { useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useSpring, a } from "@react-spring/three";

interface AnimatedProps {
  showForm: boolean;
  setShowForm: (showForm: boolean) => void;
}

export const Animated: React.FC<AnimatedProps> = ({ setShowForm }) => {
  const { camera } = useThree();
  const [active, setActive] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const hideObjectAndShowForm = () => {
    setShowForm(true);
  };

  const { scale: scaleUp } = useSpring({
    scale: active ? [1.2, 1.2, 1.2] : [1, 1, 1],
    config: { duration: 500 },
    transparent: true,
    opacity: !animationFinished ? 1 : 0,
    onRest: () => {
      setAnimationFinished(true);
    },
  });

  const { rotationSpeed } = useSpring({
    rotationSpeed: active ? 2.5 : 1,
    config: { duration: 500 },
  });

  const { scale: scaleDown, opacity } = useSpring({
    scale: animationFinished ? [0.2, 0.2, 0.2] : [1.2, 1.2, 1.2],
    transparent: true,
    opacity: animationFinished ? 0 : 1,
    config: { duration: 500 },
    onRest: () => {
      setActive(false);
      setTimeout(hideObjectAndShowForm, 400);
    },
  });

  useFrame(({ clock }) => {
    // Update camera position
    camera.position.x = model.scene.position.x;
    camera.position.y = model.scene.position.y;
    camera.position.z = model.scene.position.z + 5;
    camera.lookAt(model.scene.position);

    // Update material opacity
    model.scene.traverse((object: any) => {
      if (object.isMesh) {
        object.material.opacity = opacity.get();
      }
    });

    // Update model rotation
    model.scene.rotation.y = rotationSpeed.get() * clock.getElapsedTime();
  });

  const handleClick = () => {
    setActive(true);
    setAnimationFinished(false);
  };

  let model = useLoader(GLTFLoader, "/models/ethereum.glb");

  model.scene.position.set(0, 0, 0);
  model.scene.traverse((object: any) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.material.transparent = true;
      console.log(object.material);
    }
  });

  return (
    <a.mesh
      onClick={handleClick}
      scale={
        animationFinished
          ? scaleDown.to((s) => [s, s, s])
          : scaleUp.to((s) => [s, s, s])
      }
    >
      <primitive object={model.scene} />
    </a.mesh>
  );
};
