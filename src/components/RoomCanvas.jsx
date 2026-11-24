import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { applyFinishToModel } from '../utils/materialMapping';

// Renders an individual placed piece of furniture in the 3D room with drag handle & highlights
function PlacedFurnitureItem({
  item,
  isSelected,
  onSelect,
  isDraggingThis,
  onStartDrag
}) {
  const gltf = useGLTF(item.modelUrl);
  const groupRef = useRef();
  const [embeddedMaterials, setEmbeddedMaterials] = useState({});
  const [hovered, setHovered] = useState(false);

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
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.instanceId);
        onStartDrag(item.instanceId, e.point);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'grab';
      }}
      onPointerOut={() => {
        setHovered(false);
        if (!isDraggingThis) {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      {/* 3D Model Instance */}
      {clonedScene && <primitive object={clonedScene} />}

      {/* Selection & Hover indicator ring on the floor */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.25, 1.35, 48]} />
          <meshBasicMaterial
            color={isSelected ? '#4A4633' : '#8C7A5B'}
            side={THREE.DoubleSide}
            transparent
            opacity={isSelected ? 0.95 : 0.5}
          />
        </mesh>
      )}

      {/* Center Drag Anchor Icon on floor when selected */}
      {isSelected && (
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 24]} />
          <meshBasicMaterial color="#4A4633" transparent opacity={0.35} />
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
function RoomCameraController({ cameraMode, roomWidth, roomDepth }) {
  const { camera } = useThree();

  useEffect(() => {
    const maxDim = Math.max(roomWidth, roomDepth);

    if (cameraMode === 'top') {
      // 2D Floor Plan Top View
      camera.position.set(0.01, maxDim * 2.2, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (cameraMode === 'eye') {
      // Eye-level realistic interior walk angle
      camera.position.set(0, 1.8, roomDepth * 0.7);
      camera.lookAt(0, 1.1, 0);
    } else {
      // Free 3D isometric perspective
      camera.position.set(roomWidth * 0.85, maxDim * 0.9, roomDepth * 0.95);
      camera.lookAt(0, 1.0, 0);
    }
  }, [cameraMode, roomWidth, roomDepth, camera]);

  return null;
}

// 3D Room Environment with Dynamic Width & Depth and Single Solid Color Floor
function RoomStructure({
  roomWidth = 5.0,
  roomDepth = 4.0,
  floorColor = '#EAE4DC',
  wallColor = '#FAF8F5'
}) {
  const halfW = roomWidth / 2;
  const halfD = roomDepth / 2;
  const wallHeight = 4.0;

  return (
    <group>
      {/* 1. Single Solid Unified Floor without rugs or splits */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle Room Perimeter Border Line */}
      <lineSegments position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(roomWidth, roomDepth)]} />
        <lineBasicMaterial color="#BDB4A6" transparent opacity={0.6} linewidth={2} />
      </lineSegments>

      {/* 2. Back Wall */}
      <mesh position={[0, wallHeight / 2, -halfD]} receiveShadow>
        <planeGeometry args={[roomWidth, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* 3. Left Wall */}
      <mesh position={[-halfW, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* 4. Right Wall */}
      <mesh position={[halfW, wallHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, wallHeight]} />
        <meshStandardMaterial color={wallColor} roughness={0.85} />
      </mesh>

      {/* Modern Floor Baseboard trims */}
      <mesh position={[0, 0.08, -halfD + 0.02]}>
        <boxGeometry args={[roomWidth, 0.16, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[-halfW + 0.02, 0.08, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, 0.16, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[halfW - 0.02, 0.08, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[roomDepth, 0.16, 0.04]} />
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
  roomWidth = 5.0,
  roomDepth = 4.0,
  floorColor = '#EAE4DC',
  wallColor = '#FAF8F5'
}) {
  const controlsRef = useRef();
  const [draggingItemId, setDraggingItemId] = useState(null);
  const dragOffsetRef = useRef({ x: 0, z: 0 });

  // Handle pointer down on a specific item to start drag
  const handleStartDrag = (itemId, hitPoint) => {
    const item = placedItems.find((p) => p.instanceId === itemId);
    if (!item) return;

    setDraggingItemId(itemId);
    dragOffsetRef.current = {
      x: item.x - hitPoint.x,
      z: item.z - hitPoint.z
    };

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    document.body.style.cursor = 'grabbing';
  };

  // Handle dragging pointer across the room floor
  const handlePointerMoveFloor = (e) => {
    if (!draggingItemId) return;
    e.stopPropagation();

    const hit = e.point;
    const halfW = roomWidth / 2 - 0.6;
    const halfD = roomDepth / 2 - 0.6;

    // Apply offset and constrain to room boundaries
    const targetX = Math.max(-halfW, Math.min(halfW, hit.x + dragOffsetRef.current.x));
    const targetZ = Math.max(-halfD, Math.min(halfD, hit.z + dragOffsetRef.current.z));

    onUpdatePosition(draggingItemId, Number(targetX.toFixed(2)), Number(targetZ.toFixed(2)));
  };

  // Stop dragging on pointer up or out
  const handleEndDrag = () => {
    if (draggingItemId) {
      setDraggingItemId(null);
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <div
      className="room-canvas-viewport"
      onPointerUp={handleEndDrag}
      onPointerLeave={handleEndDrag}
    >
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [roomWidth * 0.85, 6.2, roomDepth * 0.95], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerMissed={() => onSelectItem(null)}
      >
        {/* Sky / Ambient background */}
        <color attach="background" args={['#F7F4EE']} />

        {/* Ambient Room Lighting */}
        <ambientLight intensity={0.9} color="#FFFFFF" />

        {/* Sunlight streaming into the room */}
        <directionalLight
          position={[roomWidth * 0.8, 9, roomDepth * 0.8]}
          intensity={1.4}
          color="#FFFDF8"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Soft Interior Fill Light */}
        <directionalLight position={[-roomWidth * 0.7, 7, -roomDepth * 0.7]} intensity={0.45} color="#FFF5EB" />
        <pointLight position={[0, 4, 0]} intensity={0.65} color="#FFF8EF" distance={15} />

        {/* 3D Room Architecture (Single Solid Color Floor) */}
        <RoomStructure
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          floorColor={floorColor}
          wallColor={wallColor}
        />

        {/* Invisible Raycast Drag Plane across the floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.005, 0]}
          onPointerMove={handlePointerMoveFloor}
          onPointerUp={handleEndDrag}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Placed Furniture Items */}
        {placedItems.map((item) => (
          <Suspense key={item.instanceId} fallback={null}>
            <PlacedFurnitureItem
              item={item}
              isSelected={selectedItemId === item.instanceId}
              onSelect={onSelectItem}
              isDraggingThis={draggingItemId === item.instanceId}
              onStartDrag={handleStartDrag}
            />
          </Suspense>
        ))}

        {/* Camera Controller */}
        <RoomCameraController
          cameraMode={cameraMode}
          roomWidth={roomWidth}
          roomDepth={roomDepth}
        />

        {/* Orbit Controls with Room Constraints */}
        <OrbitControls
          ref={controlsRef}
          enablePan={cameraMode === 'top'}
          enableDamping
          dampingFactor={0.06}
          minDistance={2.5}
          maxDistance={30}
          maxPolarAngle={cameraMode === 'top' ? 0.05 : Math.PI / 2 - 0.02}
          target={[0, 1.0, 0]}
        />
      </Canvas>
    </div>
  );
}
