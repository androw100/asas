import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, RefreshCw, Eye, Maximize2 } from 'lucide-react';
import { applyFinishToModel } from '../utils/materialMapping';
import LoadingState from './LoadingState';
import ModelErrorState from './ModelErrorState';

// WebGL Compatibility Detection
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Error Boundary for Three.js rendering
class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

// Controls camera transitions smoothly based on presets
function CameraPresetController({ cameraPreset, defaultPos, defaultTarget, controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    const baseDist = Math.hypot(defaultPos[0], defaultPos[1], defaultPos[2]) || 6;
    const targetY = defaultTarget[1] || 1.35;

    switch (cameraPreset) {
      case 'front':
        camera.position.set(0, targetY + 0.15, baseDist * 0.95);
        break;
      case 'side':
        camera.position.set(baseDist * 0.95, targetY + 0.15, 0);
        break;
      case 'sideLeft':
        camera.position.set(-baseDist * 0.95, targetY + 0.15, 0);
        break;
      case 'back':
        camera.position.set(0, targetY + 0.15, -baseDist * 0.95);
        break;
      case 'top':
        camera.position.set(0.01, targetY + baseDist * 0.95, 0.01);
        break;
      case 'threequarter':
      default:
        camera.position.set(defaultPos[0], defaultPos[1], defaultPos[2]);
        break;
    }

    controlsRef.current.target.set(defaultTarget[0], targetY, defaultTarget[2]);
    controlsRef.current.update();
  }, [cameraPreset, defaultPos, defaultTarget, camera, controlsRef]);

  return null;
}

// Renders the GLTF model with finish application
function GLTFModel({ url, product, finish }) {
  const gltf = useGLTF(url);
  const [embeddedMaterials, setEmbeddedMaterials] = useState({});

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
      }).catch((err) => {
        console.warn('Failed to load embedded GLTF materials:', err);
      });
    }
    return () => { isMounted = false; };
  }, [gltf]);

  useEffect(() => {
    if (gltf?.scene && finish) {
      const allMaterials = {
        ...(gltf.materials || {}),
        ...embeddedMaterials
      };
      applyFinishToModel(gltf.scene, finish, product, allMaterials);
    }
  }, [gltf, finish, product, embeddedMaterials]);

  return (
    <Center top>
      <primitive object={gltf.scene} castShadow receiveShadow />
    </Center>
  );
}

export default function ProductViewer({
  product,
  selectedFinish,
  onOpenStudioModal,
  isInsideModal = false,
  fullWindow = false
}) {
  const [webGLSupported] = useState(() => checkWebGLSupport());
  const [modelStatus, setModelStatus] = useState('loaded');
  const [cameraPreset, setCameraPreset] = useState('threequarter');
  const [autoRotate, setAutoRotate] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadError, setLoadError] = useState(null);

  const controlsRef = useRef();

  const activeModelUrl = product?.modelUrl;

  const defaultCamPos = useMemo(() => {
    return product?.cameraDefaults?.position || [8.7, 5.5, 10.2];
  }, [product]);

  const defaultCamTarget = useMemo(() => {
    return product?.cameraDefaults?.target || [0, 1.35, 0];
  }, [product]);

  const handleZoom = (factor) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      offset.multiplyScalar(factor);
      camera.position.addVectors(target, offset);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    setCameraPreset('threequarter');
    setAutoRotate(false);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!webGLSupported) {
    return (
      <div className="viewer-wrapper">
        <ModelErrorState modelUrl={activeModelUrl} errorType="webgl" />
      </div>
    );
  }

  const showOverlayError = (modelStatus === 'missing' || modelStatus === 'error');

  const angleOptions = [
    { id: 'threequarter', label: 'منظور 3/4' },
    { id: 'front', label: 'الواجهة' },
    { id: 'side', label: 'الجانب الأيمن' },
    { id: 'sideLeft', label: 'الجانب الأيسر' },
    { id: 'back', label: 'الجهة الخلفية' },
    { id: 'top', label: 'من الأعلى' }
  ];

  const hintLabel = isInsideModal
    ? '🖱️ كليك شمال: تدوير • 🖱️ كليك يمين: تحريك المنظور (Pan) • العجلة: زووم'
    : (product?.category?.includes('كنب') || product?.name?.includes('أريكة') || product?.name?.includes('كنبة')
      ? 'اسحب لتدوير الأريكة • كليك يمين لتحريك المنظور'
      : 'اسحب لتدوير المجسم • كليك يمين لتحريك المنظور');

  return (
    <div className={`viewer-master-container ${isInsideModal ? 'inside-modal' : ''} ${fullWindow ? 'full-window' : ''}`}>
      {/* Main 3D Canvas Box */}
      <div
        className={`viewer-wrapper ${fullWindow ? 'full-window' : ''}`}
        aria-label={`عارض ثلاثي الأبعاد لـ ${product?.name}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Floating Top Controls (360, Zoom In, Zoom Out, Studio Window) */}
        <div className="viewer-floating-top-controls">
          <button
            type="button"
            className={`viewer-control-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="دوران 360 درجة"
          >
            <RefreshCw size={15} className={autoRotate ? 'spin-anim' : ''} />
            <span>360°</span>
          </button>

          <button
            type="button"
            className="viewer-control-btn"
            onClick={() => handleZoom(0.85)}
            title="تكبير"
          >
            <ZoomIn size={16} />
            <span>تكبير</span>
          </button>

          <button
            type="button"
            className="viewer-control-btn"
            onClick={() => handleZoom(1.15)}
            title="تصغير"
          >
            <ZoomOut size={16} />
            <span>تصغير</span>
          </button>

          {!isInsideModal && onOpenStudioModal && (
            <button
              type="button"
              className="viewer-control-btn viewer-open-modal-btn"
              onClick={onOpenStudioModal}
              title="فتح في استوديو نافذة متصفح منفصلة"
            >
              <Maximize2 size={15} />
              <span>استوديو 3D</span>
            </button>
          )}
        </div>

        {/* Interaction Hint Pill */}
        <div className="viewer-hint-pill">
          <span>{hintLabel}</span>
        </div>

        {/* Main 3D Canvas */}
        {!showOverlayError && (
          <div className="viewer-canvas-container">
            <ThreeErrorBoundary
              key={`${activeModelUrl}_${retryCount}`}
              onError={(err) => {
                console.error('Three.js Error in ProductViewer:', err);
                setLoadError(err?.message || String(err));
                setModelStatus('missing');
              }}
              fallback={
                <ModelErrorState
                  modelUrl={activeModelUrl}
                  errorType="missing"
                  errorMessage={loadError}
                  onRetry={() => {
                    setLoadError(null);
                    setModelStatus('loaded');
                    setRetryCount((c) => c + 1);
                  }}
                />
              }
            >
              <Canvas
                shadows
                dpr={[1, 1.8]}
                camera={{
                  position: defaultCamPos,
                  fov: product?.cameraDefaults?.fov || 38,
                  near: 0.1,
                  far: 200
                }}
                gl={{
                  antialias: true,
                  powerPreference: 'high-performance',
                  alpha: true
                }}
              >
                {/* Clean Lighting for Warm Studio Aesthetic */}
                <ambientLight intensity={0.95} color="#FFFFFF" />
                <directionalLight
                  position={[5, 9, 6]}
                  intensity={1.35}
                  color="#FFFDF9"
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                  shadow-bias={-0.0001}
                />
                <directionalLight position={[-6, 5, -5]} intensity={0.5} color="#FFFFFF" />
                <directionalLight position={[0, -2, 5]} intensity={0.25} color="#F4EFEB" />

                <Suspense fallback={null}>
                  <Environment preset="city" />
                </Suspense>

                {/* Model */}
                <Suspense fallback={null}>
                  <GLTFModel
                    url={activeModelUrl}
                    product={product}
                    finish={selectedFinish}
                  />
                </Suspense>

                {/* Realistic Soft Contact Shadow */}
                <ContactShadows
                  position={[0, 0, 0]}
                  opacity={0.42}
                  scale={22}
                  blur={2.4}
                  far={8}
                  resolution={512}
                  color="#5C5346"
                />

                {/* Orbit Controls with Left-Click Rotate, Middle Dolly & Right-Click Pan */}
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
                  minDistance={1.2}
                  maxDistance={50.0}
                  autoRotate={autoRotate}
                  autoRotateSpeed={1.5}
                  maxPolarAngle={Math.PI / 2 + 0.05}
                  target={defaultCamTarget}
                />

                {/* Camera Preset Handler */}
                <CameraPresetController
                  cameraPreset={cameraPreset}
                  defaultPos={defaultCamPos}
                  defaultTarget={defaultCamTarget}
                  controlsRef={controlsRef}
                />
              </Canvas>
            </ThreeErrorBoundary>
          </div>
        )}
      </div>

      {/* 6 Angle Thumbnails Row (Matches Image 2 exactly) */}
      <div className="viewer-perspective-thumbnails-row">
        {angleOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`angle-thumb-card ${cameraPreset === opt.id ? 'active' : ''}`}
            onClick={() => {
              setCameraPreset(opt.id);
              setAutoRotate(false);
            }}
          >
            <div className="angle-thumb-preview">
              <img
                src={product.thumbnail}
                alt={opt.label}
                className="angle-thumb-mini-img"
              />
            </div>
            <span className="angle-thumb-label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
