/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { Center, Decal, useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";

export function TshirtModel({
  tshirtColor,
  designTexture,
  designTextureBack,
  onViewChange,
}) {
  const { nodes, materials } = useGLTF("/3Dmodels/02.glb");
  const texture = useTexture(
    designTexture || "/3Dmodels/textures/design-fallback.png"
  );
  const textureBack = useTexture(
    designTextureBack || "/3Dmodels/textures/design-fallback.png"
  );
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(tshirtColor); // ✅ Dynamically update color
    }
  }, [tshirtColor]);

  const handleClick = (view) => {
    onViewChange(view);
  };

  return (
    <Center position={[0, 0.1, 0]}>
      <group dispose={null}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            scale={7.5}
            position={[0, 0, 2]}
            castShadow
            receiveShadow
            geometry={nodes["T-Shirt_1"].geometry}
            material={materials.Shirt}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["T-Shirt_2"].geometry}
            scale={7.5}
            position={[0, 0, 2]}
            material={materials["front.001"]}
          >
            <meshBasicMaterial transparent opacity={0} />
            <Decal
              // debug // Makes "bounding box" of the decal visible
              position={[0, 0.2, -0.31]} //{pos} // Position of the decal
              rotation={[-Math.PI / 2 - 0.05, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
              scale={[0.52, 0.7, 0.5]} //{scale} // Scale of the decal
              onClick={() => handleClick("front")}
            >
              <meshStandardMaterial
                map={texture}
                toneMapped={false}
                transparent
                polygonOffset
                polygonOffsetFactor={-1} // The mesh should take precedence over the original
              />
            </Decal>
          </mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["T-Shirt_3"].geometry}
            material={materials.back}
            scale={7.5}
            position={[0, 0, 2]}
          >
            <meshBasicMaterial transparent opacity={0} />
            <Decal
              // debug // Makes "bounding box" of the decal visible
              position={[0, -0.2, -0.27]} //{pos} // Position of the decal
              rotation={[Math.PI / 2 - 0.2, 0, Math.PI]} // Rotation of the decal (can be a vector or a degree in radians)
              scale={[0.52, 0.7, 0.5]} //{scale} // Scale of the decal
              onClick={() => handleClick("back")}
            >
              <meshStandardMaterial
                map={textureBack}
                toneMapped={false}
                transparent
                polygonOffset
                polygonOffsetFactor={-1} // The mesh should take precedence over the original
              />
            </Decal>
          </mesh>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["T-Shirt_4"].geometry}
            material={materials["left hand"]}
            scale={7.5}
            position={[0, 0, 2]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["T-Shirt_5"].geometry}
            material={materials["right hand"]}
            scale={7.5}
            position={[0, 0, 2]}
          />
        </group>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes["T-Shirt001"].geometry}
            material={materials.background}
            scale={7.5}
            position={[0, 0, 2]}
            ref={meshRef}
          />
        </group>
      </group>
    </Center>
  );
}

useGLTF.preload("/3Dmodels/02.glb");
