import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { applyFinishToModel } from '../utils/materialMapping';

// Renders an individual placed piece of furniture in the 3D room
function PlacedFurnitureItem({
  item,
  isSelected,
  onSelect,
  onUpdatePosition
}) {
  const gltf = useGLTF(item.modelUrl);
  const groupRef = useRef();
  const [embeddedMaterials, setEmbeddedMaterials] = useState({});

  // Parse embedded materials from GLTF
  useEffect(() => {
    let isMounted = true;
    if (gltf?.parser) {
      gltf.parser.getDependencies('material').then((mats) => {
        if (!isMounted || !Array.isArray(mats)) return;
        const dict = {};
        mats.forEach((m, idx) => {
          if (m) {
            if (m.name) dict[m.name] = m;
            dict[idx] = m;
          }
        });
        setEmbeddedMaterials(dict);
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [gltf]);

  // Apply finish if specified
  useEffect(() => {
    if (gltf?.scene && item.finish) {
      const allMaterials = {
        ...(gltf.materials || {}),
        ...embeddedMaterials
      };
      applyFinishToModel(gltf.scene, item.finish, item, allMaterials);
    }
  }, [gltf, item, embeddedMaterials]);

  // Clone scene so multiple instances of same model can exist independently
  const clonedScene = useMemo(() => {
    if (!gltf?.scene) return null;
    const cloned = gltf.scene.clone(true);
    // Enable shadows on all meshes
    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltf]);

  return (
    <group
      ref={groupRef}
      position={[item.x, 0, item.z]}
      rotation={[0, (item.rotation * Math.PI) / 180, 0]}
      scale={item.scale || [1, 1, 1]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.instanceId);
      }}
    >
      {/* 3D Model Instance */}
      {clonedScene && <primitive object={clonedScene} />}

      {/* Selection indicator ring on the floor */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.4, 48]} />
          <meshBasicMaterial color="#4A4633" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      )}

      {/* Item Contact Shadow */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={6}
        blur={1.8}
        far={3}
        color="#383025"
      />
    </group>
  );
}

// Controls camera transitions based on preset modes
function RoomCameraController({ cameraMode }) {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraMode === 'top') {
      // 2D Floor Plan Top View
      camera.position.set(0.01, 14, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (cameraMode === 'eye') {
      // Eye-level realistic interior walk angle
      camera.position.set(0, 2.0, 7.5);
      camera.lookAt(0, 1.2, 0);
    } else {
      // Free 3D isometric perspective
      camera.position.set(7.5, 6.2, 8.5);
      camera.lookAt(0, 1.0, 0);
    }
  }, [cameraMode, camera]);

  return null;
}

// 3D Room Environment (Floor, Walls, Window Light, Baseboards, Rug)
function RoomStructure({ floorType = 'parquet', wallColor = '#F7F3EE' }) {
  // Floor colors
  const floorColors = {
    parquet: '#B89772',
    darkWood: '#4A3728',
    marble: '#EBE7DF',
    concrete: '#9C968F'
  };

  const activeFloorColor = floorColors[floorType] || floorColors.parquet;

  return (
    <group>
      {/* 1. Main Room Floor (8m x 7m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 8]} />
        <meshStandardMaterial
          color={activeFloorColor}
          roughness={floorType === 'marble' ? 0.25 : 0.65}
          metalness={floorType === 'marble' ? 0.1 : 0.05}
        />
      </mesh>

      {/* Decorative Modern Rug in the center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.2]} receiveShadow>
        <planeGeometry args={[4.2, 3.2]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.95} />
      </mesh>

      {/* 2. Back Wall */}
      <mesh position={[0, 2.2, -4]} receiveShadow>
        <planeGeometry args={[9, 4.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* 3. Left Wall */}
      <mesh position={[-4.5, 2.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* 4. Right Wall with Architectural Window Cutout */}
      <mesh position={[4.5, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>

      {/* Modern Floor Baseboard trims */}
      <mesh position={[0, 0.08, -3.98]}>
        <boxGeometry args={[9, 0.16, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[-4.48, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.16, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[4.48, 0.08, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[8, 0.16, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
    </group>
  );
}

export default function RoomCanvas({
  placedItems = [],
  selectedItemId,
  onSelectItem,
  onUpdatePosition,
  cameraMode = 'perspective',
  floorType = 'parquet',
  wallColor = '#F7F3EE'
}) {
  const controlsRef = useRef();

  return (
    <div className="room-canvas-viewport">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [7.5, 6.2, 8.5], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onClick={() => onSelectItem(null)}
      >
        {/* Sky / Ambient background */}
        <color attach="background" args={['#FAF8F5']} />

        {/* Ambient Room Lighting */}
        <ambientLight intensity={0.85} color="#FFFFFF" />

        {/* Sunlight streaming into the room */}
        <directionalLight
          position={[6, 9, 7]}
          intensity={1.4}
          color="#FFFDF8"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Soft Interior Fill Light */}
        <directionalLight position={[-5, 7, -3]} intensity={0.45} color="#FFF5EB" />
        <pointLight position={[0, 4, 0]} intensity={0.65} color="#FFF8EF" distance={12} />

        {/* 3D Room Architecture */}
        <RoomStructure floorType={floorType} wallColor={wallColor} />

        {/* Placed Furniture Items */}
        {placedItems.map((item) => (
          <Suspense key={item.instanceId} fallback={null}>
            <PlacedFurnitureItem
              item={item}
              isSelected={selectedItemId === item.instanceId}
              onSelect={onSelectItem}
              onUpdatePosition={onUpdatePosition}
            />
          </Suspense>
        ))}

        {/* Camera Controller */}
        <RoomCameraController cameraMode={cameraMode} />

        {/* Orbit Controls with Room Constraints */}
        <OrbitControls
          ref={controlsRef}
          enablePan={cameraMode === 'top'}
          enableDamping
          dampingFactor={0.06}
          minDistance={2.5}
          maxDistance={22}
          maxPolarAngle={cameraMode === 'top' ? 0.05 : Math.PI / 2 - 0.02}
          target={[0, 1.0, 0]}
        />
      </Canvas>
    </div>
  );
}
