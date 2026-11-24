import React, { useState, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  RotateCw,
  ShoppingBag,
  Move,
  Eye,
  Maximize2,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Copy,
  Ruler,
  Sliders,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { products, tableFinishes } from '../data/products';
import RoomCanvas from '../components/RoomCanvas';
import LoadingState from '../components/LoadingState';
import { getItemBounds } from '../utils/roomUtils';

function getDefaultProductFinish(product) {
  if (!product?.finishes || product.finishes.length === 0) return null;
  const fabric = product.finishes.find((f) => f.group === 'fabric' || f.target === 'fabric');
  const wood = product.finishes.find((f) => f.group === 'wood' || f.target === 'wood');
  if (fabric && wood) {
    return [fabric, wood];
  }
  return product.finishes[0];
}

export default function RoomPlanner() {
  // Room Dimensions Simulation State (in meters)
  const [roomWidth, setRoomWidth] = useState(5.0);
  const [roomDepth, setRoomDepth] = useState(4.0);
  const [showDimensionModal, setShowDimensionModal] = useState(false);

  // Single Solid Floor Color State (No contrasting rugs)
  const [floorColor, setFloorColor] = useState('#EAE4DC');

  // Architectural Wall Color State
  const [wallColor, setWallColor] = useState('#F3EFE8');

  // Room Lighting Simulation (1.0 = balanced studio, 0.4 = evening, 1.8 = bright daylight)
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [showLightingPopup, setShowLightingPopup] = useState(false);

  // Preset default layout: Modern Living Room with Sofa, Coffee Table, and Chair
  const defaultLayout = useMemo(() => {
    const sofa = products.find((p) => p.category === 'الكنب') || products[0];
    const table = products.find((p) => p.category === 'طاولات') || products[2];
    const chair = products.find((p) => p.category === 'كراسي') || products[1];

    return [
      {
        instanceId: 'item-sofa-1',
        ...sofa,
        scale: sofa.plannerScale || [0.35, 0.35, 0.35],
        footprint: sofa.footprint || { width: 2.4, depth: 1.15 },
        x: 0,
        z: -0.7,
        rotation: 0,
        finish: getDefaultProductFinish(sofa)
      },
      {
        instanceId: 'item-table-1',
        ...table,
        scale: table.plannerScale || [0.225, 0.225, 0.225],
        footprint: table.footprint || { width: 2.43, depth: 1.28 },
        x: 0,
        z: 0.75,
        rotation: 0,
        finish: getDefaultProductFinish(table)
      },
      {
        instanceId: 'item-chair-1',
        ...chair,
        scale: chair.plannerScale || [0.30, 0.30, 0.30],
        footprint: chair.footprint || { width: 0.68, depth: 0.65 },
        x: -1.6,
        z: 0.1,
        rotation: 35,
        finish: getDefaultProductFinish(chair)
      }
    ];
  }, []);

  const [placedItems, setPlacedItems] = useState(defaultLayout);
  const [selectedItemId, setSelectedItemId] = useState('item-sofa-1');
  const [cameraMode, setCameraMode] = useState('perspective'); // 'perspective' | 'top' | 'eye'
  const [catalogFilter, setCatalogFilter] = useState('الكل');
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Active selected item in room
  const selectedItem = useMemo(() => {
    return placedItems.find((item) => item.instanceId === selectedItemId) || null;
  }, [placedItems, selectedItemId]);

  // Bounding box limits for the currently selected item inside the room
  const itemBounds = useMemo(() => {
    if (!selectedItem) return { minX: -2, maxX: 2, minZ: -2, maxZ: 2 };
    return getItemBounds(selectedItem, roomWidth, roomDepth);
  }, [selectedItem, roomWidth, roomDepth]);

  // Total price of all items in the room
  const totalRoomPrice = useMemo(() => {
    return placedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [placedItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Direct interactive dragging position update from RoomCanvas (strictly clamped)
  const handleDirectPositionUpdate = (instanceId, x, z) => {
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === instanceId) {
          const bounds = getItemBounds(item, roomWidth, roomDepth);
          const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, x));
          const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, z));
          return { ...item, x: Number(clampedX.toFixed(2)), z: Number(clampedZ.toFixed(2)) };
        }
        return item;
      })
    );
  };

  // 2. Add item from catalog into the room (strictly clamped inside room boundary)
  const handleAddItemToRoom = (product) => {
    const newInstanceId = `item-${product.id}-${Date.now()}`;
    const scale = product.plannerScale || [0.35, 0.35, 0.35];
    const footprint = product.footprint || { width: 1.5, depth: 1.0 };
    const tempItem = { footprint, rotation: 0 };
    const bounds = getItemBounds(tempItem, roomWidth, roomDepth);

    // Place near center with slight random offset to prevent overlap
    const jitterX = (Math.random() - 0.5) * 0.4;
    const jitterZ = (Math.random() - 0.5) * 0.4;
    const targetX = Math.max(bounds.minX, Math.min(bounds.maxX, jitterX));
    const targetZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, jitterZ));

    const newItem = {
      instanceId: newInstanceId,
      ...product,
      scale,
      footprint,
      x: Number(targetX.toFixed(2)),
      z: Number(targetZ.toFixed(2)),
      rotation: 0,
      finish: getDefaultProductFinish(product)
    };

    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemId(newInstanceId);
    showToast(`تمت إضافة "${product.name.split('(')[0].trim()}" داخل الغرفة`);
  };

  // 3. Remove item from room
  const handleRemoveItem = (instanceId) => {
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    if (selectedItemId === instanceId) {
      setSelectedItemId(null);
    }
    showToast('تمت إزالة القطعة من الغرفة');
  };

  // 4. Move item position via D-pad buttons (strictly clamped)
  const handleMoveItemByStep = (dx, dz) => {
    if (!selectedItemId || !selectedItem) return;
    const bounds = getItemBounds(selectedItem, roomWidth, roomDepth);
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === selectedItemId) {
          const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, Number((item.x + dx).toFixed(2))));
          const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, Number((item.z + dz).toFixed(2))));
          return { ...item, x: clampedX, z: clampedZ };
        }
        return item;
      })
    );
  };

  // 5. Rotate item (automatically reclamps position to stay within walls)
  const handleRotateItem = (deltaAngle) => {
    if (!selectedItemId || !selectedItem) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === selectedItemId) {
          const newRot = (item.rotation + deltaAngle + 360) % 360;
          const rotatedTemp = { ...item, rotation: newRot };
          const bounds = getItemBounds(rotatedTemp, roomWidth, roomDepth);
          const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, item.x));
          const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, item.z));
          return { ...item, rotation: newRot, x: Number(clampedX.toFixed(2)), z: Number(clampedZ.toFixed(2)) };
        }
        return item;
      })
    );
  };

  // 6. Duplicate item
  const handleDuplicateItem = () => {
    if (!selectedItem) return;
    const newInstanceId = `item-${selectedItem.id}-${Date.now()}`;
    const bounds = getItemBounds(selectedItem, roomWidth, roomDepth);
    const newX = Math.min(bounds.maxX, selectedItem.x + 0.4);
    const newZ = Math.min(bounds.maxZ, selectedItem.z + 0.4);

    const duplicate = {
      ...selectedItem,
      instanceId: newInstanceId,
      x: Number(newX.toFixed(2)),
      z: Number(newZ.toFixed(2))
    };
    setPlacedItems((prev) => [...prev, duplicate]);
    setSelectedItemId(newInstanceId);
    showToast(`تم تكرار "${selectedItem.name.split('(')[0].trim()}"`);
  };

  // 7. Change finish/color of selected item in real-time
  const handleChangeItemFinish = (newFinish) => {
    if (!selectedItemId || !selectedItem) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === selectedItemId) {
          const targetGroup = newFinish.group || newFinish.target || 'all';
          let updatedFinish;

          if (Array.isArray(item.finish)) {
            const filtered = item.finish.filter(
              (f) => (f.group || f.target) !== targetGroup
            );
            updatedFinish = [...filtered, newFinish];
          } else if (item.finish && (item.finish.group || item.finish.target) && (item.finish.group || item.finish.target) !== targetGroup) {
            updatedFinish = [item.finish, newFinish];
          } else {
            updatedFinish = newFinish;
          }

          return { ...item, finish: updatedFinish };
        }
        return item;
      })
    );
    showToast(`تم تطبيق "${newFinish.name.split('(')[0].trim()}"`);
  };

  // 8. Room Dimension Presets (automatically reclamp all items inside new boundaries)
  const handleSetDimensionPreset = (w, d) => {
    setRoomWidth(w);
    setRoomDepth(d);
    setPlacedItems((prev) =>
      prev.map((item) => {
        const bounds = getItemBounds(item, w, d);
        const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, item.x));
        const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, item.z));
        return { ...item, x: Number(clampedX.toFixed(2)), z: Number(clampedZ.toFixed(2)) };
      })
    );
    setShowDimensionModal(false);
    showToast(`تم ضبط أبعاد الغرفة على: ${w}م × ${d}م (${(w * d).toFixed(1)} م²)`);
  };

  const handleWidthChange = (w) => {
    setRoomWidth(w);
    setPlacedItems((prev) =>
      prev.map((item) => {
        const bounds = getItemBounds(item, w, roomDepth);
        const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, item.x));
        return { ...item, x: Number(clampedX.toFixed(2)) };
      })
    );
  };

  const handleDepthChange = (d) => {
    setRoomDepth(d);
    setPlacedItems((prev) =>
      prev.map((item) => {
        const bounds = getItemBounds(item, roomWidth, d);
        const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, item.z));
        return { ...item, z: Number(clampedZ.toFixed(2)) };
      })
    );
  };

  // 9. Load layout presets with calibrated scale and placement
  const handleApplyPreset = (presetName) => {
    if (presetName === 'empty') {
      setPlacedItems([]);
      setSelectedItemId(null);
      showToast('تم تفريغ الغرفة - يمكنك البدء بالتأثيث من الكتالوج');
    } else if (presetName === 'modernLiving') {
      setPlacedItems(defaultLayout);
      setSelectedItemId(defaultLayout[0].instanceId);
      showToast('تم تطبيق نموذج "غرفة معيشة متكاملة"');
    } else if (presetName === 'lounge') {
      const sofa = products.find((p) => p.category === 'الكنب') || products[0];
      const chair1 = products.find((p) => p.id === 'chair-1') || products[1];
      const chair2 = products.find((p) => p.id === 'chair-2') || products[2];
      setPlacedItems([
        {
          instanceId: 'lounge-1',
          ...sofa,
          scale: sofa.plannerScale || [0.35, 0.35, 0.35],
          footprint: sofa.footprint || { width: 2.4, depth: 1.15 },
          x: 0,
          z: -0.8,
          rotation: 0
        },
        {
          instanceId: 'lounge-2',
          ...chair1,
          scale: chair1.plannerScale || [0.30, 0.30, 0.30],
          footprint: chair1.footprint || { width: 0.68, depth: 0.65 },
          x: -1.4,
          z: 0.3,
          rotation: 40
        },
        {
          instanceId: 'lounge-3',
          ...chair2,
          scale: chair2.plannerScale || [0.22, 0.22, 0.22],
          footprint: chair2.footprint || { width: 0.62, depth: 0.67 },
          x: 1.4,
          z: 0.3,
          rotation: -40
        }
      ]);
      setSelectedItemId('lounge-1');
      showToast('تم تطبيق نموذج "جلسة استقبال فاخرة"');
    }
  };

  // Filter catalog products
  const filteredCatalog = useMemo(() => {
    if (catalogFilter === 'الكل') return products;
    return products.filter((p) => p.category === catalogFilter);
  }, [catalogFilter]);

  const handleBuyEntireRoom = () => {
    showToast(`تمت إضافة جميع قطع الغرفة (${placedItems.length} قطع) إلى سلة التسوق بنجاح!`);
  };

  // Solid floor color palettes
  const solidFloorColors = [
    { id: 'cream', name: 'عاجي كريمي', hex: '#EAE4DC' },
    { id: 'beige', name: 'بيج دافئ', hex: '#DFD5C7' },
    { id: 'oak', name: 'خشب أوك موحد', hex: '#B5936D' },
    { id: 'grey', name: 'رمادي معاصر', hex: '#C4BEB6' }
  ];

  // Architectural Wall Color Palettes
  const architecturalWallColors = [
    { id: 'alabaster', name: 'أبيض عاجي لؤلؤي', hex: '#F3EFE8' },
    { id: 'warm-greige', name: 'غريج دافئ ناعم', hex: '#E4DDD4' },
    { id: 'soft-sand', name: 'رملي بيج كلاسيكي', hex: '#D8CEBE' },
    { id: 'sage-mist', name: 'أخضر هادئ (Sage)', hex: '#CFD7CC' },
    { id: 'slate-sky', name: 'سماوي ضبابي مودرن', hex: '#CCD3D9' },
    { id: 'dusty-terracotta', name: 'وردي ترابي دافئ', hex: '#E0D4CF' },
    { id: 'charcoal', name: 'رمادي فحمي عصري', hex: '#3E4348' }
  ];

  const currentArea = (roomWidth * roomDepth).toFixed(1);

  return (
    <div className="room-planner-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="planner-toast">
          <Check size={18} color="#2E6B44" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Planner Bar */}
      <div className="planner-top-bar">
        <div className="container planner-top-container">
          <div className="planner-branding">
            <nav aria-label="مسار التصفح" className="planner-breadcrumbs">
              <Link to="/" className="crumb-link">الرئيسية</Link>
              <ChevronLeft size={14} className="crumb-separator" />
              <span className="crumb-current">مصمم ومحاكي الغرف ثلاثي الأبعاد</span>
            </nav>
            <div className="planner-title-row">
              <h1 className="planner-main-title">محاكي تأثيث الغرفة الواقعي</h1>
              {/* Room Dimensions Badge */}
              <button
                type="button"
                className="planner-dimension-badge-btn"
                onClick={() => setShowDimensionModal(!showDimensionModal)}
                title="تعديل وتحديد مساحة الغرفة"
              >
                <Ruler size={15} />
                <span>المساحة: {roomWidth}م × {roomDepth}م ({currentArea} م²)</span>
              </button>
            </div>
          </div>

          {/* Quick Controls: Views, Solid Floor Tones, Dimensions */}
          <div className="planner-top-actions">
            {/* Camera View Switcher */}
            <div className="planner-pill-group" role="group" aria-label="زوايا الكاميرا">
              <button
                type="button"
                className={`planner-pill-btn ${cameraMode === 'perspective' ? 'active' : ''}`}
                onClick={() => setCameraMode('perspective')}
                title="منظور ثلاثي الأبعاد حر"
              >
                <span>3D حر</span>
              </button>
              <button
                type="button"
                className={`planner-pill-btn ${cameraMode === 'eye' ? 'active' : ''}`}
                onClick={() => setCameraMode('eye')}
                title="منظور عين الإنسان الواقعي"
              >
                <Eye size={14} />
                <span>عين الإنسان</span>
              </button>
              <button
                type="button"
                className={`planner-pill-btn ${cameraMode === 'top' ? 'active' : ''}`}
                onClick={() => setCameraMode('top')}
                title="مخطط علوي 2D (Floor Plan)"
              >
                <span>مخطط علوي</span>
              </button>
            </div>

            {/* Single Solid Floor Color Selector */}
            <div className="planner-floor-palette-group" title="اختر لون الأرضية">
              <span className="palette-label">الأرضية:</span>
              <div className="palette-swatches">
                {solidFloorColors.map((fc) => (
                  <button
                    key={fc.id}
                    type="button"
                    className={`floor-swatch-circle ${floorColor === fc.hex ? 'active' : ''}`}
                    style={{ backgroundColor: fc.hex }}
                    onClick={() => setFloorColor(fc.hex)}
                    title={fc.name}
                  />
                ))}
                {/* Custom Floor Color Picker */}
                <label className="custom-color-picker-label" title="اختيار لون مخصص للأرضية">
                  <input
                    type="color"
                    value={floorColor}
                    onChange={(e) => setFloorColor(e.target.value)}
                    className="custom-color-native-input"
                    aria-label="لون مخصص للأرضية"
                  />
                  <span className="custom-color-picker-btn" style={{ backgroundColor: floorColor }}>🎨</span>
                </label>
              </div>
            </div>

            {/* Architectural Wall Color Selector */}
            <div className="planner-floor-palette-group" title="اختر لون الجدران">
              <span className="palette-label">الجدران:</span>
              <div className="palette-swatches">
                {architecturalWallColors.map((wc) => (
                  <button
                    key={wc.id}
                    type="button"
                    className={`floor-swatch-circle ${wallColor === wc.hex ? 'active' : ''}`}
                    style={{ backgroundColor: wc.hex }}
                    onClick={() => setWallColor(wc.hex)}
                    title={wc.name}
                  />
                ))}
                {/* Custom Wall Color Picker */}
                <label className="custom-color-picker-label" title="اختيار لون مخصص للجدران">
                  <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="custom-color-native-input"
                    aria-label="لون مخصص للجدران"
                  />
                  <span className="custom-color-picker-btn" style={{ backgroundColor: wallColor }}>🎨</span>
                </label>
              </div>
            </div>

            {/* Interactive Room Lighting Control Widget */}
            <div className="planner-lighting-wrapper">
              <button
                type="button"
                className={`planner-lighting-btn ${showLightingPopup ? 'active' : ''}`}
                onClick={() => setShowLightingPopup(!showLightingPopup)}
                title="التحكم في شدة وأجواء إضاءة الغرفة"
              >
                <Sun size={15} />
                <span>الإضاءة: {Math.round(lightIntensity * 100)}%</span>
              </button>

              {showLightingPopup && (
                <div className="planner-lighting-dropdown">
                  <div className="lighting-dropdown-header">
                    <div className="lighting-title">
                      <Sun size={15} />
                      <span>التحكم في إضاءة الغرفة</span>
                    </div>
                    <span className="lighting-val-badge">{Math.round(lightIntensity * 100)}%</span>
                  </div>

                  <div className="lighting-slider-row">
                    <input
                      type="range"
                      min="0.4"
                      max="1.8"
                      step="0.05"
                      value={lightIntensity}
                      onChange={(e) => setLightIntensity(Number(e.target.value))}
                      className="lighting-range-input"
                    />
                    <div className="lighting-scale-labels">
                      <span>خافت 40%</span>
                      <span>100% متوازن</span>
                      <span>مشرق 180%</span>
                    </div>
                  </div>

                  <div className="lighting-presets-grid">
                    <button
                      type="button"
                      className={`lighting-preset-btn ${Math.abs(lightIntensity - 1.0) < 0.05 ? 'active' : ''}`}
                      onClick={() => setLightIntensity(1.0)}
                    >
                      <Sparkles size={13} />
                      <span>استوديو (100%)</span>
                    </button>
                    <button
                      type="button"
                      className={`lighting-preset-btn ${Math.abs(lightIntensity - 1.35) < 0.05 ? 'active' : ''}`}
                      onClick={() => setLightIntensity(1.35)}
                    >
                      <Sun size={13} />
                      <span>نهاري مشرق (135%)</span>
                    </button>
                    <button
                      type="button"
                      className={`lighting-preset-btn ${Math.abs(lightIntensity - 0.75) < 0.05 ? 'active' : ''}`}
                      onClick={() => setLightIntensity(0.75)}
                    >
                      <Sliders size={13} />
                      <span>دافئ هادئ (75%)</span>
                    </button>
                    <button
                      type="button"
                      className={`lighting-preset-btn ${Math.abs(lightIntensity - 0.5) < 0.05 ? 'active' : ''}`}
                      onClick={() => setLightIntensity(0.5)}
                    >
                      <Moon size={13} />
                      <span>مسائي خافت (50%)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Layout Presets Dropdown */}
            <select
              className="planner-preset-select"
              onChange={(e) => handleApplyPreset(e.target.value)}
              defaultValue="modernLiving"
              aria-label="نماذج غرف جاهزة"
            >
              <option value="modernLiving">نموذج: غرفة معيشة متكاملة</option>
              <option value="lounge">نموذج: جلسة استقبال فاخرة</option>
              <option value="empty">غرفة فارغة (ابدأ من الصفر)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Dimensions Setup Modal / Dropdown Dialog */}
      {showDimensionModal && (
        <div className="planner-dimension-popup-card">
          <div className="dimension-popup-header">
            <div className="dimension-title-wrap">
              <Ruler size={16} />
              <h3>تحديد أبعاد ومساحة الغرفة</h3>
            </div>
            <button
              type="button"
              className="dimension-close-btn"
              onClick={() => setShowDimensionModal(false)}
            >
              ✕
            </button>
          </div>

          <p className="dimension-hint">
            اختر نموذج مساحة جاهز أو اضبط العرض والطول بالمتر لمحاكاة غرفتك الحقيقية:
          </p>

          {/* Quick presets */}
          <div className="dimension-presets-grid">
            <button
              type="button"
              className={`dim-preset-card ${roomWidth === 3.5 && roomDepth === 3.5 ? 'active' : ''}`}
              onClick={() => handleSetDimensionPreset(3.5, 3.5)}
            >
              <span className="dim-name">صغيرة</span>
              <span className="dim-spec">3.5 × 3.5 م (12 م²)</span>
            </button>
            <button
              type="button"
              className={`dim-preset-card ${roomWidth === 5.0 && roomDepth === 4.0 ? 'active' : ''}`}
              onClick={() => handleSetDimensionPreset(5.0, 4.0)}
            >
              <span className="dim-name">متوسطة</span>
              <span className="dim-spec">5.0 × 4.0 م (20 م²)</span>
            </button>
            <button
              type="button"
              className={`dim-preset-card ${roomWidth === 6.5 && roomDepth === 5.0 ? 'active' : ''}`}
              onClick={() => handleSetDimensionPreset(6.5, 5.0)}
            >
              <span className="dim-name">واسعة</span>
              <span className="dim-spec">6.5 × 5.0 م (32.5 م²)</span>
            </button>
            <button
              type="button"
              className={`dim-preset-card ${roomWidth === 8.0 && roomDepth === 6.0 ? 'active' : ''}`}
              onClick={() => handleSetDimensionPreset(8.0, 6.0)}
            >
              <span className="dim-name">صالة مفتوحة</span>
              <span className="dim-spec">8.0 × 6.0 م (48 م²)</span>
            </button>
          </div>

          {/* Custom dimension sliders */}
          <div className="dimension-sliders-box">
            <div className="dim-slider-row">
              <label htmlFor="room-width-slider">عرض الغرفة (أفقي): <strong>{roomWidth} متر</strong></label>
              <input
                id="room-width-slider"
                type="range"
                min="3.0"
                max="10.0"
                step="0.5"
                value={roomWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
              />
            </div>
            <div className="dim-slider-row">
              <label htmlFor="room-depth-slider">طول الغرفة (عمق): <strong>{roomDepth} متر</strong></label>
              <input
                id="room-depth-slider"
                type="range"
                min="3.0"
                max="10.0"
                step="0.5"
                value={roomDepth}
                onChange={(e) => handleDepthChange(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-apply-dimensions"
            onClick={() => {
              setShowDimensionModal(false);
              showToast(`تم تطبيق المساحة الجديدة: ${roomWidth}م × ${roomDepth}م`);
            }}
          >
            تأكيد وتطبيق أبعاد الغرفة
          </button>
        </div>
      )}

      {/* Main Studio Workspace: 3D Room Left/Center, Furniture Catalog Right */}
      <div className="planner-main-workspace">
        {/* 1. 3D Canvas Viewport */}
        <div className="planner-viewport-area">
          <Suspense fallback={<LoadingState message="جارٍ تجهيز محاكي الغرفة 3D..." />}>
            <RoomCanvas
              placedItems={placedItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onUpdatePosition={handleDirectPositionUpdate}
              onRotateItem={(id, angle) => handleRotateItem(angle)}
              onDuplicateItem={handleDuplicateItem}
              onDeleteItem={handleRemoveItem}
              cameraMode={cameraMode}
              roomWidth={roomWidth}
              roomDepth={roomDepth}
              floorColor={floorColor}
              wallColor={wallColor}
              lightIntensity={lightIntensity}
            />
          </Suspense>

          {/* Interactive Navigation & Drag Hint Pill */}
          <div className="planner-canvas-hint">
            <span>🖱️ كليك شمال: تدوير المنظور • 🖱️ كليك يمين: تحريك الكاميرا (Pan مثل بلندر) • اسحب القطع بالماوس أو اللمس</span>
          </div>

          {/* Floating Inspector Panel for Selected Item */}
          {selectedItem && (
            <div className="planner-selected-inspector" role="region" aria-label="أدوات تحريك وتلوين القطعة">
              <div className="inspector-header">
                <div>
                  <span className="inspector-item-tag">{selectedItem.category}</span>
                  <h3 className="inspector-item-name">{selectedItem.name.split('(')[0].trim()}</h3>
                  <span className="inspector-item-price">SAR {selectedItem.price.toLocaleString('en-US')}</span>
                </div>
                <div className="inspector-header-buttons">
                  <button
                    type="button"
                    className="inspector-action-btn"
                    onClick={handleDuplicateItem}
                    title="تكرار القطعة"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    className="inspector-action-btn delete-btn"
                    onClick={() => handleRemoveItem(selectedItem.instanceId)}
                    title="حذف من الغرفة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Color & Finish Selection Section for the Model */}
              {selectedItem.finishes && selectedItem.finishes.length > 0 && (() => {
                const fabricFinishes = selectedItem.finishes.filter((f) => f.group === 'fabric' || f.target === 'fabric');
                const woodFinishes = selectedItem.finishes.filter((f) => f.group === 'wood' || f.target === 'wood');

                const isFinishActive = (f) => {
                  if (Array.isArray(selectedItem.finish)) {
                    return selectedItem.finish.some((itemF) => itemF?.id === f.id);
                  }
                  return selectedItem.finish?.id === f.id;
                };

                return (
                  <div className="inspector-finishes-box">
                    {fabricFinishes.length > 0 && (
                      <div className="finishes-subgroup">
                        <div className="finishes-header-row">
                          <span className="finishes-label">قماش وتنجيد القطعة:</span>
                        </div>
                        <div className="inspector-swatches-row">
                          {fabricFinishes.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              className={`inspector-swatch-circle ${isFinishActive(f) ? 'active' : ''}`}
                              style={{ backgroundColor: f.color }}
                              onClick={() => handleChangeItemFinish(f)}
                              title={f.name.split('(')[0].trim()}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {woodFinishes.length > 0 && (
                      <div className="finishes-subgroup" style={{ marginTop: fabricFinishes.length > 0 ? '12px' : 0 }}>
                        <div className="finishes-header-row">
                          <span className="finishes-label">خشب وقاعدة القطعة:</span>
                        </div>
                        <div className="inspector-swatches-row">
                          {woodFinishes.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              className={`inspector-swatch-circle ${isFinishActive(f) ? 'active' : ''}`}
                              style={{ backgroundColor: f.color }}
                              onClick={() => handleChangeItemFinish(f)}
                              title={f.name.split('(')[0].trim()}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {fabricFinishes.length === 0 && woodFinishes.length === 0 && (
                      <div>
                        <div className="finishes-header-row">
                          <span className="finishes-label">الألوان المتاحة:</span>
                        </div>
                        <div className="inspector-swatches-row">
                          {selectedItem.finishes.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              className={`inspector-swatch-circle ${isFinishActive(f) ? 'active' : ''}`}
                              style={{ backgroundColor: f.color }}
                              onClick={() => handleChangeItemFinish(f)}
                              title={f.name.split('(')[0].trim()}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Sliders for Direct Precision Positioning (Strictly Constrained to Room Boundaries) */}
              <div className="inspector-position-sliders">
                <div className="pos-slider-field">
                  <div className="pos-label-row">
                    <span>الموقع بالعرض (X):</span>
                    <strong>{selectedItem.x}م</strong>
                  </div>
                  <input
                    type="range"
                    min={itemBounds.minX}
                    max={itemBounds.maxX}
                    step="0.05"
                    value={Math.max(itemBounds.minX, Math.min(itemBounds.maxX, selectedItem.x))}
                    onChange={(e) => handleDirectPositionUpdate(selectedItem.instanceId, Number(e.target.value), selectedItem.z)}
                  />
                </div>
                <div className="pos-slider-field">
                  <div className="pos-label-row">
                    <span>الموقع بالعمق (Z):</span>
                    <strong>{selectedItem.z}م</strong>
                  </div>
                  <input
                    type="range"
                    min={itemBounds.minZ}
                    max={itemBounds.maxZ}
                    step="0.05"
                    value={Math.max(itemBounds.minZ, Math.min(itemBounds.maxZ, selectedItem.z))}
                    onChange={(e) => handleDirectPositionUpdate(selectedItem.instanceId, selectedItem.x, Number(e.target.value))}
                  />
                </div>
                <div className="pos-slider-field">
                  <div className="pos-label-row">
                    <span>زاوية الدوران:</span>
                    <strong>{selectedItem.rotation}°</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={selectedItem.rotation}
                    onChange={(e) => {
                      const rot = Number(e.target.value);
                      setPlacedItems((prev) =>
                        prev.map((it) => {
                          if (it.instanceId === selectedItem.instanceId) {
                            const rotatedTemp = { ...it, rotation: rot };
                            const bounds = getItemBounds(rotatedTemp, roomWidth, roomDepth);
                            const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, it.x));
                            const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, it.z));
                            return { ...it, rotation: rot, x: Number(clampedX.toFixed(2)), z: Number(clampedZ.toFixed(2)) };
                          }
                          return it;
                        })
                      );
                    }}
                  />
                </div>
              </div>

              {/* Movement & Rotation Controls */}
              <div className="inspector-controls-grid">
                <div className="rotate-quick-bar">
                  <span className="d-pad-title">تدوير سريع:</span>
                  <div className="rotate-btns-row">
                    <button
                      type="button"
                      className="rotate-step-btn"
                      onClick={() => handleRotateItem(45)}
                    >
                      +45°
                    </button>
                    <button
                      type="button"
                      className="rotate-step-btn"
                      onClick={() => handleRotateItem(90)}
                    >
                      +90°
                    </button>
                    <button
                      type="button"
                      className="rotate-step-btn"
                      onClick={() => handleRotateItem(180)}
                    >
                      180°
                    </button>
                  </div>
                </div>

                <div className="d-pad-wrapper">
                  <span className="d-pad-title">أزرار تحريك بالخطوة:</span>
                  <div className="d-pad">
                    <button
                      type="button"
                      className="d-pad-btn up"
                      onClick={() => handleMoveItemByStep(0, -0.3)}
                      title="للأمام"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <div className="d-pad-row">
                      <button
                        type="button"
                        className="d-pad-btn left"
                        onClick={() => handleMoveItemByStep(0.3, 0)}
                        title="لليمين"
                      >
                        <ArrowRight size={16} />
                      </button>
                      <button
                        type="button"
                        className="d-pad-btn center"
                        onClick={() => handleRotateItem(45)}
                        title="تدوير 45 درجة"
                      >
                        <RotateCw size={15} />
                      </button>
                      <button
                        type="button"
                        className="d-pad-btn right"
                        onClick={() => handleMoveItemByStep(-0.3, 0)}
                        title="لليسار"
                      >
                        <ArrowLeft size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="d-pad-btn down"
                      onClick={() => handleMoveItemByStep(0, 0.3)}
                      title="للخلف"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Furniture Catalog Drawer (Right Side) */}
        <aside className={`planner-catalog-drawer ${isCatalogOpen ? 'open' : 'closed'}`}>
          <div className="catalog-drawer-header">
            <div className="catalog-header-title">
              <Layers size={18} color="#8C7A5B" />
              <h2>كتالوج الأثاث</h2>
            </div>
            <button
              type="button"
              className="catalog-toggle-btn"
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              title={isCatalogOpen ? 'طي القائمة' : 'فتح القائمة'}
            >
              {isCatalogOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="catalog-categories-tabs">
            {['الكل', 'الكنب', 'كراسي', 'طاولات'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`catalog-tab-btn ${catalogFilter === cat ? 'active' : ''}`}
                onClick={() => setCatalogFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products List Cards */}
          <div className="catalog-items-scroll">
            {filteredCatalog.map((product) => {
              const cleanName = product.name.split('(')[0].trim();

              return (
                <div key={product.id} className="catalog-product-card">
                  <div className="catalog-card-image-box">
                    <img src={product.thumbnail} alt={cleanName} className="catalog-card-img" />
                  </div>
                  <div className="catalog-card-details">
                    <span className="catalog-card-category">{product.category}</span>
                    <h4 className="catalog-card-title">{cleanName}</h4>
                    <span className="catalog-card-price">SAR {product.price.toLocaleString('en-US')}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-add-to-room"
                    onClick={() => handleAddItemToRoom(product)}
                    title="إضافة هذه القطعة إلى الغرفة"
                  >
                    <Plus size={16} />
                    <span>إضافة</span>
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Bottom Sticky Action Bar: Summary of Room Items & Complete Purchase */}
      <footer className="planner-bottom-purchase-bar">
        <div className="container planner-purchase-container">
          {/* Room Items Strip */}
          <div className="planner-summary-info">
            <div className="planner-count-badge">
              <span>{placedItems.length} قطع في الغرفة</span>
            </div>
            <div className="planner-placed-thumbnails">
              {placedItems.map((item) => (
                <button
                  key={item.instanceId}
                  type="button"
                  className={`mini-room-thumb ${selectedItemId === item.instanceId ? 'active' : ''}`}
                  onClick={() => setSelectedItemId(item.instanceId)}
                  title={item.name.split('(')[0].trim()}
                >
                  <img src={item.thumbnail} alt={item.name} />
                </button>
              ))}
            </div>
          </div>

          {/* Price & Checkout CTA */}
          <div className="planner-cta-group">
            <div className="planner-total-box">
              <span className="planner-total-label">تكلفة الغرفة بالكامل:</span>
              <span className="planner-total-price">SAR {totalRoomPrice.toLocaleString('en-US')}</span>
            </div>

            <button
              type="button"
              className="btn-planner-buy-all"
              onClick={handleBuyEntireRoom}
              disabled={placedItems.length === 0}
            >
              <ShoppingBag size={18} />
              <span>شراء طقم الغرفة بالكامل</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
