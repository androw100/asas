import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Compass } from 'lucide-react';
import { applyFinishToModel } from '../utils/materialMapping';
import LoadingState from './LoadingState';
import ModelErrorState from './ModelErrorState';
import ProceduralFurniture from './ProceduralFurniture';
import { ThreeErrorBoundary } from './ThreeErrorBoundary';

// Helper to check WebGL support
function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
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

// Controller component to smoothly reposition camera to presets
function CameraPresetController({ cameraPreset, defaultPos, defaultTarget }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!cameraPreset) return;

    let targetPos = [...defaultPos];
    switch (cameraPreset) {
      case 'front':
        targetPos = [0, defaultPos[1] * 0.9, defaultPos[2] * 1.1];
        break;
      case 'side':
        targetPos = [defaultPos[0] * 1.3, defaultPos[1] * 0.9, 0];
        break;
      case 'top':
        targetPos = [0.1, defaultPos[1] * 2.2, 0.1];
        break;
      case 'threequarter':
      default:
        targetPos = [...defaultPos];
        break;
    }

    camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
    camera.lookAt(new THREE.Vector3(...defaultTarget));
    camera.updateProjectionMatrix();
  }, [cameraPreset, camera, defaultPos, defaultTarget]);

  return null;
}

// Renders the GLTF model with finish application
function GLTFModel({ url, product, finish }) {
  const { scene } = useGLTF(url);

  // Clone scene deeply so cached GLTF scene is never mutated
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  // Apply material changes whenever finish or product mapping changes
  useEffect(() => {
    if (clonedScene && finish) {
      applyFinishToModel(clonedScene, finish, product);
    }
  }, [clonedScene, finish, product]);

  return (
    <Center top>
      <primitive object={clonedScene} castShadow receiveShadow />
    </Center>
  );
}

export default function ProductViewer({ product, selectedFinish }) {
  const [webGLSupported] = useState(() => checkWebGLSupport());
  const [modelStatus, setModelStatus] = useState('checking'); // 'checking' | 'loaded' | 'missing' | 'error'
  const [useProcedural, setUseProcedural] = useState(false);
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [cameraPreset, setCameraPreset] = useState('threequarter');
  const [retryCount, setRetryCount] = useState(0);

  const controlsRef = useRef();

  const activeModelUrl = customModelUrl || product?.modelUrl;

  const defaultCamPos = useMemo(() => {
    return product?.cameraDefaults?.position || [2.8, 2.0, 3.4];
  }, [product]);

  const defaultCamTarget = useMemo(() => {
    return product?.cameraDefaults?.target || [0, 0.4, 0];
  }, [product]);

  // Check if GLB file exists at path before triggering Drei's useGLTF
  useEffect(() => {
    if (customModelUrl) {
      return;
    }

    if (!activeModelUrl) {
      return;
    }

    let isSubscribed = true;

    fetch(activeModelUrl, { method: 'HEAD' })
      .then((res) => {
        if (!isSubscribed) return;
        if (res.ok) {
          setModelStatus('loaded');
        } else {
          setModelStatus('missing');
        }
      })
      .catch(() => {
        if (!isSubscribed) return;
        setModelStatus('missing');
      });

    return () => {
      isSubscribed = false;
    };
  }, [activeModelUrl, retryCount, customModelUrl]);

  // Handle local user-selected GLB file for instantaneous testing
  const handleLocalFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomModelUrl(url);
      setUseProcedural(false);
      setModelStatus('loaded');
    }
  };

  const handleResetCamera = () => {
    setCameraPreset('threequarter');
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!webGLSupported) {
    return (
      <div className="viewer-wrapper">
        <ModelErrorState
          modelUrl={activeModelUrl}
          errorType="webgl"
        />
      </div>
    );
  }

  const showOverlayError = (modelStatus === 'missing' || modelStatus === 'error') && !useProcedural;

  return (
    <div className="viewer-wrapper" aria-label={`عارض ثلاثي الأبعاد لـ ${product?.name}`}>
      {/* Viewer Hints & Badges */}
      <div className="viewer-hint">
        <Compass size={14} />
        <span>اسحب للتدوير 360° • قرّب باللمس أو العجلة</span>
      </div>

      <div className="viewer-badge-status">
        {customModelUrl ? (
          <span className="badge" style={{ borderColor: 'var(--color-accent)' }}>
            مجسم محلي نشط
          </span>
        ) : useProcedural ? (
          <span className="badge" style={{ opacity: 0.85 }}>
            معاينة ثلاثية الأبعاد
          </span>
        ) : modelStatus === 'loaded' ? (
          <span className="badge">مجسم 3D حقيقي</span>
        ) : null}
      </div>

      {/* Fallback & State Overlays */}
      {modelStatus === 'checking' && !useProcedural && (
        <LoadingState message="جارٍ تجهيز المجسم ثلاثي الأبعاد..." />
      )}

      {showOverlayError && (
        <ModelErrorState
          modelUrl={activeModelUrl}
          errorType="missing"
          onRetry={() => {
            setModelStatus('checking');
            setRetryCount((c) => c + 1);
          }}
          onFileSelect={handleLocalFileSelect}
          onEnableProcedural={() => setUseProcedural(true)}
        />
      )}

      {/* Main 3D Canvas */}
      {(!showOverlayError || useProcedural) && (
        <div className="viewer-canvas-container">
          <ThreeErrorBoundary
            onError={() => {
              setModelStatus('error');
              setUseProcedural(true);
            }}
            fallback={
              <ModelErrorState
                modelUrl={activeModelUrl}
                errorType="corrupt"
                onRetry={() => {
                  setModelStatus('checking');
                  setRetryCount((c) => c + 1);
                }}
                onFileSelect={handleLocalFileSelect}
                onEnableProcedural={() => setUseProcedural(true)}
              />
            }
          >
            <Canvas
              shadows
              dpr={[1, 1.8]}
              camera={{
                position: defaultCamPos,
                fov: product?.cameraDefaults?.fov || 40
              }}
              gl={{
                antialias: true,
                powerPreference: 'high-performance',
                alpha: true
              }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.75} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              />
              <directionalLight position={[-5, 4, -5]} intensity={0.4} color="#C4A477" />
              <Environment preset="city" />

              {/* Models */}
              <Suspense fallback={null}>
                {useProcedural ? (
                  <ProceduralFurniture product={product} finish={selectedFinish} />
                ) : (
                  <GLTFModel
                    url={activeModelUrl}
                    product={product}
                    finish={selectedFinish}
                  />
                )}
              </Suspense>

              {/* Floor Shadow Grounding */}
              <ContactShadows
                position={[0, 0, 0]}
                opacity={0.65}
                scale={12}
                blur={1.6}
                far={4}
                resolution={512}
                color="#0D0D0C"
              />

              {/* Orbit Controls */}
              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                enableDamping
                dampingFactor={0.06}
                minDistance={1.2}
                maxDistance={6.5}
                maxPolarAngle={Math.PI / 2 + 0.05} // منع الكاميرا من النزول تحت الأرض
                target={defaultCamTarget}
              />

              {/* Camera Preset Handler */}
              <CameraPresetController
                cameraPreset={cameraPreset}
                defaultPos={defaultCamPos}
                defaultTarget={defaultCamTarget}
              />
            </Canvas>
          </ThreeErrorBoundary>
        </div>
      )}

      {/* Floating Viewport Toolbar */}
      <div className="viewer-toolbar" role="toolbar" aria-label="أدوات التحكم بالعارض ثلاثي الأبعاد">
        <button
          className={`viewer-preset-btn ${cameraPreset === 'threequarter' ? 'active' : ''}`}
          onClick={() => setCameraPreset('threequarter')}
          title="منظور ثلاثي"
        >
          منظور 3/4
        </button>
        <button
          className={`viewer-preset-btn ${cameraPreset === 'front' ? 'active' : ''}`}
          onClick={() => setCameraPreset('front')}
          title="الواجهة الأمامية"
        >
          الواجهة
        </button>
        <button
          className={`viewer-preset-btn ${cameraPreset === 'side' ? 'active' : ''}`}
          onClick={() => setCameraPreset('side')}
          title="المنظر الجانبي"
        >
          الجانب
        </button>
        <button
          className={`viewer-preset-btn ${cameraPreset === 'top' ? 'active' : ''}`}
          onClick={() => setCameraPreset('top')}
          title="منظور علوي"
        >
          من الأعلى
        </button>

        <div style={{ width: '1px', height: '18px', background: 'var(--color-border)', margin: '0 4px' }} />

        <button
          className="btn-icon"
          style={{ width: '32px', height: '32px' }}
          onClick={handleResetCamera}
          title="إعادة ضبط زاوية الكاميرا"
          aria-label="إعادة ضبط زاوية الكاميرا"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
