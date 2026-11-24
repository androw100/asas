import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { applyFinishToModel } from '../utils/materialMapping';
import { getItemBounds } from '../utils/roomUtils';

// Renders an individual placed piece of furniture in the 3D room with smooth, free drag & drop
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

        // Map variant names from glTF KHR_materials_variants extension
        const variantsDef = gltf.parser.json?.extensions?.KHR_materials_variants?.variants;
        const meshesDef = gltf.parser.json?.meshes;

        if (Array.isArray(variantsDef) && Array.isArray(meshesDef)) {
          meshesDef.forEach((mesh) => {
            mesh.primitives?.forEach((prim) => {
              const mappings = prim.extensions?.KHR_materials_variants?.mappings;
              if (Array.isArray(mappings)) {
                mappings.forEach((mapping) => {
                  const mat = mats[mapping.material];
                  if (mat && Array.isArray(mapping.variants)) {
                    mapping.variants.forEach((vIdx) => {
                      const vName = variantsDef[vIdx]?.name;
                      if (vName) {
                        dict[vName] = mat;
                      }
                    });
                  }
                });
              }
            });
          });
        }

        setEmbeddedMaterials(dict);
      }).catch(() => {});
    }
    return () => { isMounted = false; };
  }, [gltf]);

  // Clone scene so multiple instances of same model can exist independently
  const centeredModel = useMemo(() => {
    if (!gltf?.scene) return null;
    const cloned = gltf.scene.clone(true);

    // Auto-center model at (0, 0, 0) and align bottom base to Y = 0 (exact feet-on-floor alignment)
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);

    cloned.position.set(-center.x, -box.min.y, -center.z);

    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    const container = new THREE.Group();
    container.add(cloned);
    return { container, cloned };
  }, [gltf]);

  // Apply finish directly to the rendered model whenever finish or embedded materials are ready
  useEffect(() => {
    if (centeredModel?.cloned && item.finish) {
      const allMaterials = {
        ...(gltf.materials || {}),
        ...embeddedMaterials
      };
      applyFinishToModel(centeredModel.cloned, item.finish, item, allMaterials);
    }
  }, [centeredModel, item.finish, item, embeddedMaterials, gltf.materials]);

  return (
    <group
      ref={groupRef}
      position={[item.x, 0.04, item.z]}
      rotation={[0, (item.rotation * Math.PI) / 180, 0]}
      scale={item.scale || item.plannerScale || [0.35, 0.35, 0.35]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.instanceId);
        onStartDrag(item.instanceId, e);
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
      {/* 3D Model Instance with Physics-Accurate Directional Shadows */}
      {centeredModel?.container && <primitive object={centeredModel.container} />}
    </group>
  );
}

// Global active plane raycaster: strictly clamped inside the physical room boundaries
function FloorDragListener({
  draggingItemId,
  dragOffsetRef,
  placedItems = [],
  roomWidth = 5.0,
  roomDepth = 4.0,
  onUpdatePosition,
  onEndDrag
}) {
  const { camera, raycaster, gl } = useThree();
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.04), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!draggingItemId) return;

    const currentItem = placedItems.find((it) => it.instanceId === draggingItemId);

    const handlePointerMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

      if (clientX === undefined || clientY === undefined) return;

      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      if (raycaster.ray.intersectPlane(floorPlane, intersectPoint)) {
        // Enforce strict room boundary constraint: model NEVER exits the room
        const bounds = getItemBounds(currentItem, roomWidth, roomDepth);
        const rawX = intersectPoint.x + dragOffsetRef.current.x;
        const rawZ = intersectPoint.z + dragOffsetRef.current.z;

        const targetX = Math.max(bounds.minX, Math.min(bounds.maxX, rawX));
        const targetZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, rawZ));

        onUpdatePosition(draggingItemId, Number(targetX.toFixed(2)), Number(targetZ.toFixed(2)));
      }
    };

    const handlePointerUp = () => {
      onEndDrag();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [draggingItemId, camera, raycaster, gl, floorPlane, intersectPoint, dragOffsetRef, placedItems, roomWidth, roomDepth, onUpdatePosition, onEndDrag]);

  return null;
}

// Camera transition controller
function RoomCameraController({ cameraMode, roomWidth = 5.0, roomDepth = 4.0 }) {
  const { camera } = useThree();

  useEffect(() => {
    const maxDim = Math.max(roomWidth, roomDepth);
    if (cameraMode === 'top') {
      // 2D Floor Plan Top-Down view scaled to room size
      camera.position.set(0.001, Math.max(9, maxDim * 2.0), 0.001);
      camera.lookAt(0, 0, 0);
    } else if (cameraMode === 'eye') {
      // Eye-level realistic interior walk angle
      camera.position.set(0, 1.5, roomDepth * 0.95);
      camera.lookAt(0, 0.8, 0);
    } else {
      // Free 3D isometric perspective
      camera.position.set(roomWidth * 0.95, Math.max(4.5, maxDim * 0.9), roomDepth * 1.15);
      camera.lookAt(0, 0.6, 0);
    }
  }, [cameraMode, camera, roomWidth, roomDepth]);

  return null;
}

// 1-Meter Rectangular Grid Lines matching the exact width and depth of the room
function RoomRectangularGrid({ width, depth, y = 0.042 }) {
  const linePositions = useMemo(() => {
    const points = [];
    const halfW = width / 2;
    const halfD = depth / 2;

    // Lines parallel to Z (spaced 1m along X)
    for (let x = -halfW + 1; x < halfW - 0.05; x += 1) {
      points.push(x, y, -halfD, x, y, halfD);
    }
    // Lines parallel to X (spaced 1m along Z)
    for (let z = -halfD + 1; z < halfD - 0.05; z += 1) {
      points.push(-halfW, y, z, halfW, y, z);
    }

    return new Float32Array(points);
  }, [width, depth, y]);

  if (linePositions.length === 0) return null;

  return (
    <lineSegments key={`lines-${width}-${depth}`}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#948576" transparent opacity={0.55} />
    </lineSegments>
  );
}

// Architectural Room Floor & 4-Sided Inward-Facing Walls (Disappear when in front of camera)
function ArchitecturalRoomFloor({
  roomWidth = 5.0,
  roomDepth = 4.0,
  floorColor = '#EAE4DC',
  wallColor = '#F3EFE8',
  showWalls = true
}) {
  const halfW = roomWidth / 2;
  const halfD = roomDepth / 2;
  const borderThickness = 0.08; // 8 cm wide architectural skirting
  const borderHeight = 0.14; // 14 cm visible wall baseboard trim
  const wallHeight = 2.8; // 2.8m standard ceiling height

  return (
    <group key={`room-floor-v5-${roomWidth}-${roomDepth}-${floorColor}-${wallColor}`} position={[0, 0, 0]}>
      {/* 1. Large Studio Infinity Base Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#EDE7E0"
          roughness={0.9}
          metalness={0.01}
        />
      </mesh>

      {/* 2. Elevated Room Platform (4cm high platform matching exact roomWidth x roomDepth) */}
      <mesh
        key={`room-platform-${roomWidth}-${roomDepth}-${floorColor}`}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <boxGeometry args={[roomWidth, 0.04, roomDepth]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.55}
          metalness={0.04}
        />
      </mesh>

      {/* 3. Exact 1-meter floor measurement grid lines */}
      <RoomRectangularGrid
        width={roomWidth}
        depth={roomDepth}
        y={0.042}
      />

      {/* 4. Realistic 4-Sided Inward-Facing Walls (FrontSide normals face inward: near wall automatically culls/disappears!) */}
      {showWalls && (
        <group>
          {/* North Wall (Back Wall) - Facing +Z (toward room center) */}
          <mesh
            position={[0, 0.04 + wallHeight / 2, -halfD]}
            rotation={[0, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[roomWidth, wallHeight]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.88}
              metalness={0.02}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* South Wall (Front Wall) - Facing -Z (toward room center, disappears when camera is in front!) */}
          <mesh
            position={[0, 0.04 + wallHeight / 2, halfD]}
            rotation={[0, Math.PI, 0]}
            receiveShadow
          >
            <planeGeometry args={[roomWidth, wallHeight]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.88}
              metalness={0.02}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* West Wall (Left Wall) - Facing +X (toward room center) */}
          <mesh
            position={[-halfW, 0.04 + wallHeight / 2, 0]}
            rotation={[0, Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[roomDepth, wallHeight]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.88}
              metalness={0.02}
              side={THREE.FrontSide}
            />
          </mesh>

          {/* East Wall (Right Wall) - Facing -X (toward room center, disappears when camera is on the right!) */}
          <mesh
            position={[halfW, 0.04 + wallHeight / 2, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            receiveShadow
          >
            <planeGeometry args={[roomDepth, wallHeight]} />
            <meshStandardMaterial
              color={wallColor}
              roughness={0.88}
              metalness={0.02}
              side={THREE.FrontSide}
            />
          </mesh>
        </group>
      )}

      {/* 5. Elegant Architectural Skirting Border Framing the Room Boundaries */}
      {/* North Trim (back wall edge) */}
      <mesh position={[0, 0.04 + borderHeight / 2, -halfD]}>
        <boxGeometry key={`north-${roomWidth}`} args={[roomWidth + borderThickness * 2, borderHeight, borderThickness]} />
        <meshStandardMaterial color="#42352B" roughness={0.35} />
      </mesh>
      {/* South Trim (front wall edge) */}
      <mesh position={[0, 0.04 + borderHeight / 2, halfD]}>
        <boxGeometry key={`south-${roomWidth}`} args={[roomWidth + borderThickness * 2, borderHeight, borderThickness]} />
        <meshStandardMaterial color="#42352B" roughness={0.35} />
      </mesh>
      {/* West Trim (left wall edge) */}
      <mesh position={[-halfW, 0.04 + borderHeight / 2, 0]}>
        <boxGeometry key={`west-${roomDepth}`} args={[borderThickness, borderHeight, roomDepth]} />
        <meshStandardMaterial color="#42352B" roughness={0.35} />
      </mesh>
      {/* East Trim (right wall edge) */}
      <mesh position={[halfW, 0.04 + borderHeight / 2, 0]}>
        <boxGeometry key={`east-${roomDepth}`} args={[borderThickness, borderHeight, roomDepth]} />
        <meshStandardMaterial color="#42352B" roughness={0.35} />
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
  floorColor = '#EAE4DC',
  wallColor = '#F3EFE8',
  roomWidth = 5.0,
  roomDepth = 4.0,
  lightIntensity = 1.0
}) {
  const controlsRef = useRef();
  const [draggingItemId, setDraggingItemId] = useState(null);
  const dragOffsetRef = useRef({ x: 0, z: 0 });

  // Handle pointer down on an item to start dragging (Calculated at ground level Y=0.04 for 0-jump precision!)
  const handleStartDrag = (itemId, e) => {
    const item = placedItems.find((p) => p.instanceId === itemId);
    if (!item) return;

    setDraggingItemId(itemId);

    // Compute exact ground intersection at floor level Y=0.04 on click
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.04);
    const groundPoint = new THREE.Vector3();

    const ray = e?.raycaster?.ray || e?.ray;
    if (ray && ray.intersectPlane(floorPlane, groundPoint)) {
      dragOffsetRef.current = {
        x: item.x - groundPoint.x,
        z: item.z - groundPoint.z
      };
    } else if (e?.point) {
      dragOffsetRef.current = {
        x: item.x - e.point.x,
        z: item.z - e.point.z
      };
    } else {
      dragOffsetRef.current = { x: 0, z: 0 };
    }

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    document.body.style.cursor = 'grabbing';
  };

  // Stop dragging
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
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{
          position: [6.5, 6.2, 7.5],
          fov: 40,
          near: 0.1,
          far: 150
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={() => onSelectItem(null)}
      >
        {/* Warm Studio Background Tone */}
        <color attach="background" args={['#F5F0EB']} />

        {/* Studio Lighting Calibrated to Exact Product Page Color Balance (Scalable via lightIntensity) */}
        <ambientLight intensity={1.0 * lightIntensity} color="#FFFFFF" />

        {/* Main Sun/Key Directional Light (Casts soft, clean, real-time shadows on the floor) */}
        <directionalLight
          position={[6, 11, 7]}
          intensity={1.35 * lightIntensity}
          color="#FFFDF9"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-camera-near={0.5}
          shadow-camera-far={35}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />

        {/* Soft Interior Ambient Fill Lights for Crisp Color & Fabric Vibrancy */}
        <directionalLight position={[-6, 7, -5]} intensity={0.5 * lightIntensity} color="#FFFFFF" />
        <directionalLight position={[0, -1, 5]} intensity={0.25 * lightIntensity} color="#F4EFEB" />
        <pointLight position={[0, 4.5, 0]} intensity={0.3 * lightIntensity} color="#FFFDF5" distance={20} />

        {/* High-End Studio Environment Reflections for Realistic Texture Specularity */}
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.6 * lightIntensity} />
        </Suspense>

        {/* Architectural Metric Room Floor with Exact Room Dimensions & Framing */}
        <ArchitecturalRoomFloor
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          floorColor={floorColor}
          wallColor={wallColor}
        />

        {/* Global Active Floor Drag Listener (Clamped Strictly Inside Room) */}
        <FloorDragListener
          draggingItemId={draggingItemId}
          dragOffsetRef={dragOffsetRef}
          placedItems={placedItems}
          roomWidth={roomWidth}
          roomDepth={roomDepth}
          onUpdatePosition={onUpdatePosition}
          onEndDrag={handleEndDrag}
        />

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

        {/* Camera Preset Handler */}
        <RoomCameraController
          cameraMode={cameraMode}
          roomWidth={roomWidth}
          roomDepth={roomDepth}
        />

        {/* Orbit Controls with Free Unrestricted Orbit & Blender-Style Right-Click Pan */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          panSpeed={1.0}
          screenSpacePanning={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
          enableDamping
          dampingFactor={0.06}
          minDistance={1.8}
          maxDistance={40}
          maxPolarAngle={cameraMode === 'top' ? 0.05 : Math.PI / 2 - 0.05}
          target={[0, 0.6, 0]}
        />
      </Canvas>
    </div>
  );
}
