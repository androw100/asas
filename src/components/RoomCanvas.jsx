import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { applyFinishToModel } from '../utils/materialMapping';
import { getItemBounds, snapToRoomWall } from '../utils/roomUtils';
import { assetUrl } from '../utils/assetUrl';
import { useRealProgress } from '../utils/realProgressTracker';

// Wireframe placeholder showing furniture position while GLB is downloading
function ItemLoadingPlaceholder({ item }) {
  if (item?.structuralType) return null;
  const fp = item?.footprint || { width: 1.5, depth: 1.0 };
  const h = 0.75;
  return (
    <group position={[item.x, 0.04 + h / 2, item.z]} rotation={[0, ((item.rotation || 0) * Math.PI) / 180, 0]}>
      <mesh>
        <boxGeometry args={[fp.width, h, fp.depth]} />
        <meshStandardMaterial color="#8F8275" transparent opacity={0.25} wireframe />
      </mesh>
    </group>
  );
}

// Live asset download indicator with REAL byte streaming progress
function RoomProgressOverlay() {
  const { active, percent, loadedMB, totalMB } = useRealProgress();
  if (!active || percent >= 100) return null;
  return (
    <div className="planner-assets-loading-overlay">
      <div className="planner-loading-card">
        <div className="planner-loading-spinner" />
        <div className="planner-loading-text">
          <span>جارٍ تنزيل موديلات الغرفة...</span>
          <span className="planner-loading-percent">{percent}%</span>
          <span className="planner-loading-bytes">({loadedMB} / {totalMB} ميجابايت)</span>
        </div>
        <div className="planner-progress-track">
          <div className="planner-progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

// Protects individual 3D items from crashing the whole canvas if a model fails to fetch
class ItemErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('Placed item 3D render warning:', err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Global Canvas Error Boundary for WebGL / Device context errors
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(err, errInfo) {
    console.error('Room Canvas WebGL error:', err, errInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F0EAE1',
          color: '#4A4633',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>تعذر تشغيل العارض ثلاثي الأبعاد</h3>
          <p style={{ fontSize: '0.9rem', color: '#736B63', marginBottom: '16px' }}>يرجى التحقق من اتصال الإنترنت أو تفعيل تسريع الرسوميات (WebGL).</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#4A4633',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Procedural 3D Architectural Door (Realistic Architrave Casing, Flush Leaf, CNC Grooves, Luxury Lever Set)
function ProceduralDoor({ item, isSelected }) {
  const finishObj = Array.isArray(item.finish) ? item.finish[0] : item.finish;
  const finishColor = finishObj?.color || '#9E6D3B';
  const finishRoughness = finishObj?.roughness ?? 0.38;
  const finishMetalness = finishObj?.metalness ?? 0.02;
  const frameColor = finishObj?.frameColor || finishColor;

  const handleColor = (finishColor === '#1B1C1E' || finishColor === '#303338') ? '#D4AF37' : '#C5A059';

  const doorWidth = 0.95;
  const doorHeight = 2.15;
  const frameDepth = 0.13;
  const postWidth = 0.065;
  const casingThickness = 0.018;

  const leafWidth = doorWidth - postWidth * 2 + 0.01;
  const leafHeight = doorHeight - postWidth + 0.005;
  const leafThickness = 0.044;

  return (
    <group position={[0, 0, 0]}>
      {/* Selection Highlight */}
      {isSelected && (
        <mesh position={[0, doorHeight / 2, 0]}>
          <boxGeometry args={[doorWidth + 0.08, doorHeight + 0.06, frameDepth + 0.06]} />
          <meshBasicMaterial color="#C5A880" wireframe transparent opacity={0.4} />
        </mesh>
      )}

      {/* 1. Inner Structural Jamb Throat (بطانة الحلق الداخلي للباب) */}
      {/* Left Jamb */}
      <mesh position={[-doorWidth / 2 + postWidth / 2, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[postWidth, doorHeight, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>
      {/* Right Jamb */}
      <mesh position={[doorWidth / 2 - postWidth / 2, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[postWidth, doorHeight, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>
      {/* Top Jamb Header */}
      <mesh position={[0, doorHeight - postWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth, postWidth, frameDepth]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>

      {/* 2. Front Architrave Casing (البرواز المعماري الخارجي للباب - 3 جهات مفتوحة من المنتصف!) */}
      {/* Front Left Casing */}
      <mesh position={[-doorWidth / 2 + postWidth / 2, doorHeight / 2, frameDepth / 2 + casingThickness / 2]} castShadow>
        <boxGeometry args={[postWidth + 0.02, doorHeight + 0.01, casingThickness]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>
      {/* Front Right Casing */}
      <mesh position={[doorWidth / 2 - postWidth / 2, doorHeight / 2, frameDepth / 2 + casingThickness / 2]} castShadow>
        <boxGeometry args={[postWidth + 0.02, doorHeight + 0.01, casingThickness]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>
      {/* Front Top Casing */}
      <mesh position={[0, doorHeight - postWidth / 2 + 0.01, frameDepth / 2 + casingThickness / 2]} castShadow>
        <boxGeometry args={[doorWidth + 0.04, postWidth + 0.02, casingThickness]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>

      {/* 3. Back Architrave Casing (البرواز المعماري الخلفي للباب) */}
      {/* Back Left Casing */}
      <mesh position={[-doorWidth / 2 + postWidth / 2, doorHeight / 2, -frameDepth / 2 - casingThickness / 2]} castShadow>
        <boxGeometry args={[postWidth + 0.02, doorHeight + 0.01, casingThickness]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>
      {/* Back Right Casing */}
      <mesh position={[doorWidth / 2 - postWidth / 2, doorHeight / 2, -frameDepth / 2 - casingThickness / 2]} castShadow>
        <boxGeometry args={[postWidth + 0.02, doorHeight + 0.01, casingThickness]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>
      {/* Back Top Casing */}
      <mesh position={[0, doorHeight - postWidth / 2 + 0.01, -frameDepth / 2 - casingThickness / 2]} castShadow>
        <boxGeometry args={[doorWidth + 0.04, postWidth + 0.02, casingThickness]} />
        <meshStandardMaterial color={frameColor} roughness={finishRoughness} metalness={finishMetalness} />
      </mesh>

      {/* 4. Luxury Door Leaf (درفة الباب الرئيسية - واضحة 100% وتتغير ألوانها فورياً) */}
      <group position={[0, leafHeight / 2, 0.005]}>
        {/* Main Solid Door Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[leafWidth, leafHeight, leafThickness]} />
          <meshStandardMaterial
            color={finishColor}
            roughness={finishRoughness}
            metalness={finishMetalness}
          />
        </mesh>

        {/* Modern CNC Accent Grooves (خطوط حفر معمارية أفقية مودرن على الوجهين) */}
        {[0.35, 0.08, -0.22, -0.52].map((yOff, idx) => (
          <group key={`groove-${idx}`} position={[0, yOff, 0]}>
            {/* Front Inlay Groove */}
            <mesh position={[0, 0, leafThickness / 2 + 0.001]} castShadow>
              <boxGeometry args={[leafWidth * 0.84, 0.008, 0.003]} />
              <meshStandardMaterial color="#1E1A16" roughness={0.6} />
            </mesh>
            {/* Back Inlay Groove */}
            <mesh position={[0, 0, -leafThickness / 2 - 0.001]} castShadow>
              <boxGeometry args={[leafWidth * 0.84, 0.008, 0.003]} />
              <meshStandardMaterial color="#1E1A16" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Stainless Steel / Brass Hinges on Pivot Edge (3 مفصلات أبواب واقعية) */}
        {[-0.75, 0, 0.75].map((hY, idx) => (
          <mesh key={`hinge-${idx}`} position={[-leafWidth / 2 - 0.003, hY, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 12]} />
            <meshStandardMaterial color="#8E857B" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Latch Faceplate on Strike Edge */}
        <mesh position={[leafWidth / 2 + 0.001, 0, 0]}>
          <boxGeometry args={[0.003, 0.14, 0.024]} />
          <meshStandardMaterial color={handleColor} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 5. Luxury Architectural Lever Handle Set (Front) */}
        <group position={[leafWidth / 2 - 0.085, 0, leafThickness / 2]}>
          {/* Backplate Escutcheon (لوحة المقبض الخلفية الأنيقة) */}
          <mesh position={[0, 0, 0.004]}>
            <boxGeometry args={[0.042, 0.22, 0.008]} />
            <meshStandardMaterial color={handleColor} metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Handle Pivot Hub */}
          <mesh position={[0, 0.05, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.016, 16]} />
            <meshStandardMaterial color={handleColor} metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Ergonomic Lever Handle Bar */}
          <mesh position={[-0.055, 0.05, 0.024]}>
            <boxGeometry args={[0.12, 0.016, 0.014]} />
            <meshStandardMaterial color={handleColor} metalness={0.92} roughness={0.15} />
          </mesh>
          {/* Key Cylinder Hole */}
          <mesh position={[0, -0.05, 0.009]}>
            <cylinderGeometry args={[0.006, 0.006, 0.004, 12]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#1A1816" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>

        {/* Luxury Architectural Lever Handle Set (Back) */}
        <group position={[leafWidth / 2 - 0.085, 0, -leafThickness / 2]}>
          <mesh position={[0, 0, -0.004]}>
            <boxGeometry args={[0.042, 0.22, 0.008]} />
            <meshStandardMaterial color={handleColor} metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.05, -0.016]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.016, 16]} />
            <meshStandardMaterial color={handleColor} metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh position={[-0.055, 0.05, -0.024]}>
            <boxGeometry args={[0.12, 0.016, 0.014]} />
            <meshStandardMaterial color={handleColor} metalness={0.92} roughness={0.15} />
          </mesh>
          <mesh position={[0, -0.05, -0.009]}>
            <cylinderGeometry args={[0.006, 0.006, 0.004, 12]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#1A1816" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Floor Threshold Strip (عتبة سفلية نحاسية راقية) */}
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[doorWidth + 0.02, 0.012, frameDepth + 0.02]} />
        <meshStandardMaterial color="#6E5A44" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Procedural 3D Architectural Single Wood Window (Single Panoramic Pane, Solid Timber Frame & Sill, Brass Latch)
function ProceduralWindow({ item, isSelected }) {
  const finishObj = Array.isArray(item.finish) ? item.finish[0] : item.finish;
  const woodColor = finishObj?.color || '#9E6D3B';
  const sillColor = finishObj?.sillColor || '#7A5229';
  const woodRoughness = finishObj?.roughness ?? 0.42;
  const woodMetalness = finishObj?.metalness ?? 0.02;

  const winWidth = 1.35;
  const winHeight = 1.40;
  const frameDepth = 0.085;
  const frameThick = 0.065;
  const elevation = 0.90; // Standard 90cm elevation from floor

  return (
    <group position={[0, elevation, 0]}>
      {/* Selection Glow */}
      {isSelected && (
        <mesh position={[0, winHeight / 2, 0.02]}>
          <boxGeometry args={[winWidth + 0.12, winHeight + 0.12, frameDepth + 0.06]} />
          <meshBasicMaterial color="#C5A880" wireframe transparent opacity={0.4} />
        </mesh>
      )}

      {/* 1. Realistic Outdoor Sky & Landscape Vista (يغطي الجدار خلف النافذة ويحاكي ضوء النهار الطبيعي) */}
      <group position={[0, winHeight / 2, -0.01]}>
        {/* Sky Daylight Aperture Backplate */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[winWidth - 0.02, winHeight - 0.02]} />
          <meshBasicMaterial color="#DDF0FB" />
        </mesh>
        {/* Warm Horizon Sunlight Glow (توهج شروق/نهار دافئ في أسفل الأفق) */}
        <mesh position={[0, -winHeight * 0.25, 0.001]}>
          <planeGeometry args={[winWidth - 0.02, winHeight * 0.5]} />
          <meshBasicMaterial color="#FFF8ED" transparent opacity={0.8} />
        </mesh>
        {/* Distant Lush Horizon Silhouette (أشجار خضراء ناعمة في الأفق تعطي واقعية مذهلة للنافذة) */}
        <mesh position={[0, -winHeight * 0.42, 0.002]}>
          <planeGeometry args={[winWidth - 0.02, winHeight * 0.18]} />
          <meshBasicMaterial color="#4A6B53" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* 2. Heavy Solid Wood Window Sill (جلسة خشبية سميكة فاخرة بارزة لداخل الغرفة) */}
      <mesh position={[0, -0.02, 0.045]} castShadow receiveShadow>
        <boxGeometry args={[winWidth + 0.16, 0.045, frameDepth + 0.085]} />
        <meshStandardMaterial color={sillColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Beveled Sill Base Support (دعامة خشبية مشطوفة أسفل الجلسة) */}
      <mesh position={[0, -0.05, 0.03]} castShadow>
        <boxGeometry args={[winWidth + 0.10, 0.02, frameDepth + 0.04]} />
        <meshStandardMaterial color={sillColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>

      {/* 3. Outer Solid Wood Perimeter Frame (إطار خشب طبيعي مصمت محيط بالكامل) */}
      {/* Left Wood Post */}
      <mesh position={[-winWidth / 2 + frameThick / 2, winHeight / 2, frameDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[frameThick, winHeight, frameDepth]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Right Wood Post */}
      <mesh position={[winWidth / 2 - frameThick / 2, winHeight / 2, frameDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[frameThick, winHeight, frameDepth]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Top Wood Header */}
      <mesh position={[0, winHeight - frameThick / 2, frameDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[winWidth, frameThick, frameDepth]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Bottom Wood Rail */}
      <mesh position={[0, frameThick / 2, frameDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[winWidth, frameThick, frameDepth]} />
        <meshStandardMaterial color={woodColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>

      {/* 4. Inner Beveled Wood Casing Trim (حواف وتفريزات خشبية متدرجة تحيط بالزجاج لإبراز فخامة النجارة) */}
      {/* Inner Top Casing */}
      <mesh position={[0, winHeight - frameThick - 0.01, frameDepth / 2 + 0.008]} castShadow>
        <boxGeometry args={[winWidth - frameThick * 2, 0.02, 0.02]} />
        <meshStandardMaterial color={sillColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Inner Bottom Casing */}
      <mesh position={[0, frameThick + 0.01, frameDepth / 2 + 0.008]} castShadow>
        <boxGeometry args={[winWidth - frameThick * 2, 0.02, 0.02]} />
        <meshStandardMaterial color={sillColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Inner Left Casing */}
      <mesh position={[-winWidth / 2 + frameThick + 0.01, winHeight / 2, frameDepth / 2 + 0.008]} castShadow>
        <boxGeometry args={[0.02, winHeight - frameThick * 2, 0.02]} />
        <meshStandardMaterial color={sillColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>
      {/* Inner Right Casing */}
      <mesh position={[winWidth / 2 - frameThick - 0.01, winHeight / 2, frameDepth / 2 + 0.008]} castShadow>
        <boxGeometry args={[0.02, winHeight - frameThick * 2, 0.02]} />
        <meshStandardMaterial color={sillColor} roughness={woodRoughness} metalness={woodMetalness} />
      </mesh>

      {/* 5. Luxury Brass Window Latch Handle (مقبض نحاسي جانبي أنيق للنافذة) */}
      <group position={[winWidth / 2 - frameThick / 2, winHeight / 2, frameDepth + 0.015]}>
        {/* Brass Base Plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.024, 0.08, 0.008]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.18} />
        </mesh>
        {/* Brass Pivot & Horizontal Lever */}
        <mesh position={[-0.03, 0.015, 0.012]}>
          <boxGeometry args={[0.065, 0.014, 0.014]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>

      {/* 6. Single Clear Panoramic Crystal Glass Pane (لوح زجاجي موحد نقي بقطعة واحدة بدون أي قواطع) */}
      <mesh position={[0, winHeight / 2, frameDepth * 0.4]}>
        <boxGeometry args={[winWidth - frameThick * 2 + 0.015, winHeight - frameThick * 2 + 0.015, 0.012]} />
        <meshPhysicalMaterial
          color="#F2FAFF"
          transmission={0.88}
          opacity={0.25}
          transparent
          roughness={0.03}
          ior={1.52}
          reflectivity={0.92}
          metalness={0.05}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
}

// Procedural 3D Architectural Pillar / Column (Fluted Classical Round or Layered Modern Square)
function ProceduralColumn({ item, isSelected, round = false }) {
  const finishObj = Array.isArray(item.finish) ? item.finish[0] : item.finish;
  const columnColor = finishObj?.color || '#F6F6F8';
  const trimColor = finishObj?.trimColor || '#E2E2E6';
  const colRoughness = finishObj?.roughness ?? 0.25;
  const colMetalness = finishObj?.metalness ?? 0.04;

  const colHeight = 2.80; // Full 2.80m room ceiling height
  const colSize = 0.44;

  // Generate 16 radial fluted ribs for high-end classical round pillar realism
  const flutedRibs = useMemo(() => {
    const ribs = [];
    const count = 16;
    const radius = colSize / 2 + 0.004;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      ribs.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rot: -angle
      });
    }
    return ribs;
  }, [colSize]);

  return (
    <group position={[0, 0, 0]}>
      {/* Selection Box */}
      {isSelected && (
        <mesh position={[0, colHeight / 2, 0]}>
          <boxGeometry args={[colSize + 0.12, colHeight + 0.06, colSize + 0.12]} />
          <meshBasicMaterial color="#C5A880" wireframe transparent opacity={0.45} />
        </mesh>
      )}

      {round ? (
        /* ================= Classical Fluted Round Pillar ================= */
        <group>
          {/* Base Plinth Block (قاعدة سفلية مربعة متدرجة) */}
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[colSize + 0.12, 0.12, colSize + 0.12]} />
            <meshStandardMaterial color={trimColor} roughness={0.4} metalness={0.03} />
          </mesh>
          {/* Torus Moulding (طوق دائري متدرج ينقل القاعدة للشافت) */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[colSize / 2 + 0.04, colSize / 2 + 0.06, 0.06, 32]} />
            <meshStandardMaterial color={trimColor} roughness={0.35} metalness={0.03} />
          </mesh>

          {/* Main Round Column Shaft */}
          <mesh position={[0, colHeight / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[colSize / 2, colSize / 2, colHeight - 0.44, 32]} />
            <meshStandardMaterial
              color={columnColor}
              roughness={colRoughness}
              metalness={colMetalness}
            />
          </mesh>

          {/* 16 Vertical Fluted Relief Ribs (تضليع معمارى حقيقي يلقي ظلال واقعية) */}
          {flutedRibs.map((rib, idx) => (
            <mesh key={`rib-${idx}`} position={[rib.x, colHeight / 2, rib.z]} rotation={[0, rib.rot, 0]} castShadow>
              <boxGeometry args={[0.024, colHeight - 0.46, 0.012]} />
              <meshStandardMaterial
                color={columnColor}
                roughness={colRoughness}
                metalness={colMetalness}
              />
            </mesh>
          ))}

          {/* Capital Astragal Neck Ring (طوق التاج السفلي) */}
          <mesh position={[0, colHeight - 0.18, 0]} castShadow>
            <cylinderGeometry args={[colSize / 2 + 0.04, colSize / 2 + 0.02, 0.06, 32]} />
            <meshStandardMaterial color={trimColor} roughness={0.35} metalness={0.03} />
          </mesh>
          {/* Capital Abacus Cap (تاج علوي معماري يلتصق بالسقف) */}
          <mesh position={[0, colHeight - 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[colSize + 0.12, 0.12, colSize + 0.12]} />
            <meshStandardMaterial color={trimColor} roughness={0.4} metalness={0.03} />
          </mesh>
        </group>
      ) : (
        /* ================= Luxury Modern Clad Square Pillar ================= */
        <group>
          {/* 1. Multi-Tier Base Plinth (قاعدة مودرن متدرجة مع خط فاصل معدني) */}
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[colSize + 0.10, 0.12, colSize + 0.10]} />
            <meshStandardMaterial color={trimColor} roughness={0.45} metalness={0.05} />
          </mesh>
          {/* Inset Shadow Reveal Gap (خط ظل أسود/برونزي غاطس يعطي لمسة معمارية فاخرة) */}
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[colSize + 0.02, 0.025, colSize + 0.02]} />
            <meshStandardMaterial color="#2B2621" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.17, 0]} castShadow>
            <boxGeometry args={[colSize + 0.06, 0.055, colSize + 0.06]} />
            <meshStandardMaterial color={trimColor} roughness={0.4} metalness={0.05} />
          </mesh>

          {/* 2. Main Square Column Shaft */}
          <mesh position={[0, colHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[colSize, colHeight - 0.44, colSize]} />
            <meshStandardMaterial
              color={columnColor}
              roughness={colRoughness}
              metalness={colMetalness}
            />
          </mesh>

          {/* 3. Recessed Modern Accent Panels on 4 Faces (تجاويف ديكورية أنيقة على الأوجه الأربعة) */}
          {/* Front Panel */}
          <mesh position={[0, colHeight / 2, colSize / 2 + 0.002]} castShadow>
            <boxGeometry args={[colSize * 0.76, colHeight - 0.58, 0.004]} />
            <meshStandardMaterial color={columnColor} roughness={colRoughness * 0.9} metalness={colMetalness} />
          </mesh>
          {/* Back Panel */}
          <mesh position={[0, colHeight / 2, -colSize / 2 - 0.002]} castShadow>
            <boxGeometry args={[colSize * 0.76, colHeight - 0.58, 0.004]} />
            <meshStandardMaterial color={columnColor} roughness={colRoughness * 0.9} metalness={colMetalness} />
          </mesh>
          {/* Left Panel */}
          <mesh position={[-colSize / 2 - 0.002, colHeight / 2, 0]} castShadow>
            <boxGeometry args={[0.004, colHeight - 0.58, colSize * 0.76]} />
            <meshStandardMaterial color={columnColor} roughness={colRoughness * 0.9} metalness={colMetalness} />
          </mesh>
          {/* Right Panel */}
          <mesh position={[colSize / 2 + 0.002, colHeight / 2, 0]} castShadow>
            <boxGeometry args={[0.004, colHeight - 0.58, colSize * 0.76]} />
            <meshStandardMaterial color={columnColor} roughness={colRoughness * 0.9} metalness={colMetalness} />
          </mesh>

          {/* 4. Top Ceiling Capital Cornice (تاج علوي معماري متدرج عند السقف) */}
          <mesh position={[0, colHeight - 0.17, 0]} castShadow>
            <boxGeometry args={[colSize + 0.06, 0.055, colSize + 0.06]} />
            <meshStandardMaterial color={trimColor} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, colHeight - 0.13, 0]}>
            <boxGeometry args={[colSize + 0.02, 0.025, colSize + 0.02]} />
            <meshStandardMaterial color="#2B2621" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, colHeight - 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[colSize + 0.10, 0.12, colSize + 0.10]} />
            <meshStandardMaterial color={trimColor} roughness={0.45} metalness={0.05} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Renders an architectural structural item (Door, Window, Column) with full interactivity
function PlacedStructuralItem({
  item,
  isSelected,
  onSelect,
  isDraggingThis,
  onStartDrag
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={groupRef}
      position={[item.x, 0.04, item.z]}
      rotation={[0, (((item.rotation || 0) * Math.PI) / 180), 0]}
      scale={item.scale || [1, 1, 1]}
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
      {item.structuralType === 'door' && (
        <ProceduralDoor item={item} isSelected={isSelected} />
      )}
      {item.structuralType === 'window' && (
        <ProceduralWindow item={item} isSelected={isSelected} />
      )}
      {(item.structuralType === 'column' || item.structuralType === 'column-round') && (
        <ProceduralColumn
          item={item}
          isSelected={isSelected}
          round={item.structuralType === 'column-round'}
        />
      )}
    </group>
  );
}

// Renders an individual placed piece of furniture in the 3D room with smooth, free drag & drop
function PlacedGLTFItem({
  item,
  isSelected,
  onSelect,
  isDraggingThis,
  onStartDrag
}) {
  const finalModelUrl = assetUrl(item.modelUrl);
  const gltf = useGLTF(finalModelUrl);
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

// Switcher component: delegates to PlacedStructuralItem for doors/windows/columns or PlacedGLTFItem for 3D GLB furniture
function PlacedFurnitureItem(props) {
  if (props.item?.structuralType) {
    return <PlacedStructuralItem {...props} />;
  }
  return <PlacedGLTFItem {...props} />;
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

  // Use refs for items and callbacks so listener does not re-subscribe on every pixel drag
  const itemsRef = useRef(placedItems);
  itemsRef.current = placedItems;
  const updatePosRef = useRef(onUpdatePosition);
  updatePosRef.current = onUpdatePosition;
  const endDragRef = useRef(onEndDrag);
  endDragRef.current = onEndDrag;

  useEffect(() => {
    if (!draggingItemId) return;

    const handlePointerMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

      if (clientX === undefined || clientY === undefined) return;

      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      if (raycaster.ray.intersectPlane(floorPlane, intersectPoint)) {
        const currentItem = itemsRef.current.find((it) => it.instanceId === draggingItemId);
        if (!currentItem) return;

        const rawX = intersectPoint.x + dragOffsetRef.current.x;
        const rawZ = intersectPoint.z + dragOffsetRef.current.z;

        // Windows strictly glide along the room walls (North, South, East, West) and auto-align!
        if (currentItem.structuralType === 'window') {
          const snapped = snapToRoomWall(rawX, rawZ, currentItem, roomWidth, roomDepth);
          if (updatePosRef.current) {
            updatePosRef.current(draggingItemId, snapped.x, snapped.z, snapped.rotation);
          }
          return;
        }

        // Standard furniture models: strictly clamped inside room boundaries
        const bounds = getItemBounds(currentItem, roomWidth, roomDepth);
        const targetX = Math.max(bounds.minX, Math.min(bounds.maxX, rawX));
        const targetZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, rawZ));

        if (updatePosRef.current) {
          updatePosRef.current(draggingItemId, Number(targetX.toFixed(2)), Number(targetZ.toFixed(2)));
        }
      }
    };

    const handlePointerUp = () => {
      if (endDragRef.current) {
        endDragRef.current();
      }
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
  }, [draggingItemId, camera, raycaster, gl, floorPlane, intersectPoint, dragOffsetRef, roomWidth, roomDepth]);

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

  // Global safeguard: Ensure controls and dragging state NEVER freeze or get stuck
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setDraggingItemId(null);
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
      document.body.style.cursor = 'auto';
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, []);

  // Stop dragging
  const handleEndDrag = () => {
    setDraggingItemId(null);
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
    document.body.style.cursor = 'auto';
  };

  return (
    <div
      className="room-canvas-viewport"
      onContextMenu={(e) => e.preventDefault()}
    >
      <RoomProgressOverlay />
      <CanvasErrorBoundary>
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

          {/* Realistic Sky/Ground Hemisphere Ambient Fill (0ms, 100% Offline, Zero External CORS calls) */}
          <hemisphereLight
            skyColor="#FFFFFF"
            groundColor="#D8D0C5"
            intensity={0.65 * lightIntensity}
          />

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
            <ItemErrorBoundary key={item.instanceId}>
              <Suspense fallback={<ItemLoadingPlaceholder item={item} />}>
                <PlacedFurnitureItem
                  item={item}
                  isSelected={selectedItemId === item.instanceId}
                  onSelect={onSelectItem}
                  isDraggingThis={draggingItemId === item.instanceId}
                  onStartDrag={handleStartDrag}
                />
              </Suspense>
            </ItemErrorBoundary>
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
      </CanvasErrorBoundary>
    </div>
  );
}
