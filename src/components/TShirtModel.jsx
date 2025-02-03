import { Center, Decal, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";

export function TShirtModel({
  tshirtColor,
  frontDesignTexture,
  backDesignTexture,
  onViewChange,
  selectedView,
  designTexture,
}) {
  // Load both front and back textures
  const frontTexture = useTexture(designTexture || "/2.webp");
  const backTexture = useTexture(backDesignTexture || "/2.webp");

  const { nodes, materials } = useGLTF("/3Dmodels/front.glb");
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(tshirtColor);
    }
  }, [tshirtColor]);

  const handleFrontClick = () => onViewChange("front");
  const handleBackClick = () => onViewChange("back");

  return (
    <Center>
      <group dispose={null}>
        <group scale={0.09} position={[0, -1, 5]}>
          {/* Base T-shirt mesh */}
          <mesh
            geometry={nodes.Object_0.geometry}
            material={materials.material}
            ref={meshRef}
          />

          {/* Front Design */}
          <mesh geometry={nodes.Object_0_1.geometry} onClick={handleFrontClick}>
            <meshBasicMaterial transparent={false} />
            <Decal
              position={[0, 30, 15]}
              rotation={[0, 0, 0]}
              scale={[65, 65, 35]}
            >
              <meshStandardMaterial
                map={frontTexture}
                toneMapped={false}
                transparent={true}
                polygonOffset={true}
                polygonOffsetFactor={-1}
                side={2}
                alphaTest={0.1}
                depthTest={true}
              />
            </Decal>
          </mesh>

          {/* Back Design */}
          <mesh
            geometry={nodes.Object_0_1.geometry}
            onClick={handleBackClick}
            rotation={[0, Math.PI, 0]} // Rotate 180 degrees to show back
          >
            <meshBasicMaterial transparent={false} />
            <Decal
              position={[0, 30, -15]} // Adjusted Z position for back
              rotation={[0, Math.PI, 0]} // Rotate decal to face outward
              scale={[65, 65, 35]}
            >
              <meshStandardMaterial
                map={backTexture}
                toneMapped={false}
                transparent={true}
                polygonOffset={true}
                polygonOffsetFactor={-1}
                side={2}
                alphaTest={0.1}
                depthTest={true}
              />
            </Decal>
          </mesh>
        </group>
      </group>
    </Center>
  );
}

useGLTF.preload("/3Dmodels/front.glb");
