import React, { useMemo } from 'react';

export default function ProceduralFurniture({ product, finish }) {
  // Extract active colors for material groups
  const woodColor = useMemo(() => {
    if (finish?.target === 'wood') return finish.color;
    const defaultWood = product?.finishes?.find((f) => f.target === 'wood');
    return defaultWood ? defaultWood.color : '#C6A477';
  }, [finish, product]);

  const upholsteryColor = useMemo(() => {
    if (finish?.target === 'upholstery') return finish.color;
    const defaultUph = product?.finishes?.find((f) => f.target === 'upholstery');
    return defaultUph ? defaultUph.color : '#D9D2C5';
  }, [finish, product]);

  const stoneColor = useMemo(() => {
    if (finish?.target === 'stone') return finish.color;
    const defaultStone = product?.finishes?.find((f) => f.target === 'stone');
    return defaultStone ? defaultStone.color : '#D6CEBF';
  }, [finish, product]);

  const metalColor = useMemo(() => {
    if (finish?.target === 'metal') return finish.color;
    const defaultMetal = product?.finishes?.find((f) => f.target === 'metal');
    return defaultMetal ? defaultMetal.color : '#A88E67';
  }, [finish, product]);

  const isTable = product?.category === 'Tables';
  const isDecor = product?.category === 'Decor';
  const isLounge = product?.category === 'Lounge';

  if (isTable) {
    // Stylized Architectural Monolith Table
    return (
      <group position={[0, -0.4, 0]}>
        {/* Tabletop */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.08, 1.2]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Pedestal Base Left */}
        <mesh position={[-0.8, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.24, 0.32, 0.88, 32]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        {/* Pedestal Base Right */}
        <mesh position={[0.8, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.24, 0.32, 0.88, 32]} />
          <meshStandardMaterial
            color={stoneColor}
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  if (isDecor) {
    // Sculptural Bronze Vessel
    return (
      <group position={[0, -0.4, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.45, 0.9, 32]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.35}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.2, 0.04, 16, 32]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>
      </group>
    );
  }

  if (isLounge) {
    // Minimalist Daybed
    return (
      <group position={[0, -0.3, 0]}>
        {/* Legs / Frame */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.14, 0.9]} />
          <meshStandardMaterial
            color={metalColor}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
        {/* Cushioned Mattress */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.35, 0.86]} />
          <meshStandardMaterial
            color={upholsteryColor}
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
        {/* Bolster Pillow */}
        <mesh position={[-0.8, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.78, 32]} />
          <meshStandardMaterial
            color={upholsteryColor}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  // Default: Atelier Chair
  return (
    <group position={[0, -0.4, 0]}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.1, 0.72]} />
        <meshStandardMaterial
          color={upholsteryColor}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.9, -0.32]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.76, 0.36, 0.08]} />
        <meshStandardMaterial
          color={woodColor}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Rear Uprights */}
      <mesh position={[-0.32, 0.7, -0.32]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={woodColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.32, 0.7, -0.32]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color={woodColor} roughness={0.5} />
      </mesh>

      {/* 4 Wooden Legs */}
      <mesh position={[-0.32, 0.22, 0.3]} rotation={[0.04, 0, -0.04]} castShadow>
        <cylinderGeometry args={[0.024, 0.018, 0.48, 16]} />
        <meshStandardMaterial color={woodColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.32, 0.22, 0.3]} rotation={[0.04, 0, 0.04]} castShadow>
        <cylinderGeometry args={[0.024, 0.018, 0.48, 16]} />
        <meshStandardMaterial color={woodColor} roughness={0.5} />
      </mesh>
      <mesh position={[-0.32, 0.22, -0.3]} rotation={[-0.04, 0, -0.04]} castShadow>
        <cylinderGeometry args={[0.024, 0.018, 0.48, 16]} />
        <meshStandardMaterial color={woodColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.32, 0.22, -0.3]} rotation={[-0.04, 0, 0.04]} castShadow>
        <cylinderGeometry args={[0.024, 0.018, 0.48, 16]} />
        <meshStandardMaterial color={woodColor} roughness={0.5} />
      </mesh>
    </group>
  );
}
