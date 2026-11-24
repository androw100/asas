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
  RefreshCcw,
  Sliders
} from 'lucide-react';
import { products, tableFinishes } from '../data/products';
import RoomCanvas from '../components/RoomCanvas';
import LoadingState from '../components/LoadingState';

export default function RoomPlanner() {
  // Preset default layout: Modern Living Room with Sofa, Coffee Table, and Chair
  const defaultLayout = useMemo(() => {
    const sofa = products.find((p) => p.category === 'الكنب') || products[0];
    const table = products.find((p) => p.category === 'طاولات') || products[2];
    const chair = products.find((p) => p.category === 'كراسي') || products[1];

    return [
      {
        instanceId: 'item-sofa-1',
        ...sofa,
        x: 0,
        z: -1.4,
        rotation: 0,
        finish: sofa.finishes ? sofa.finishes[0] : null
      },
      {
        instanceId: 'item-table-1',
        ...table,
        x: 0,
        z: 0.3,
        rotation: 0,
        finish: table.finishes ? table.finishes[0] : null
      },
      {
        instanceId: 'item-chair-1',
        ...chair,
        x: -2.0,
        z: 0.1,
        rotation: 50,
        finish: chair.finishes ? chair.finishes[0] : null
      }
    ];
  }, []);

  const [placedItems, setPlacedItems] = useState(defaultLayout);
  const [selectedItemId, setSelectedItemId] = useState('item-sofa-1');
  const [cameraMode, setCameraMode] = useState('perspective'); // 'perspective' | 'top' | 'eye'
  const [floorType, setFloorType] = useState('parquet'); // 'parquet' | 'darkWood' | 'marble'
  const [wallColor, setWallColor] = useState('#F7F3EE');
  const [catalogFilter, setCatalogFilter] = useState('الكل');
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Active selected item in room
  const selectedItem = useMemo(() => {
    return placedItems.find((item) => item.instanceId === selectedItemId) || null;
  }, [placedItems, selectedItemId]);

  // Total price of all items in the room
  const totalRoomPrice = useMemo(() => {
    return placedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [placedItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Add item from catalog to room
  const handleAddItemToRoom = (product) => {
    const newInstanceId = `item-${product.id}-${Date.now()}`;
    // Position near center with slight offset
    const randomOffsetX = (Math.random() - 0.5) * 1.5;
    const randomOffsetZ = (Math.random() - 0.5) * 1.2;

    const newItem = {
      instanceId: newInstanceId,
      ...product,
      x: randomOffsetX,
      z: randomOffsetZ,
      rotation: 0,
      finish: product.finishes ? product.finishes[0] : null
    };

    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemId(newInstanceId);
    showToast(`تمت إضافة "${product.name.split('(')[0].trim()}" إلى الغرفة`);
  };

  // 2. Remove item from room
  const handleRemoveItem = (instanceId) => {
    setPlacedItems((prev) => prev.filter((item) => item.instanceId !== instanceId));
    if (selectedItemId === instanceId) {
      setSelectedItemId(null);
    }
    showToast('تمت إزالة القطعة من الغرفة');
  };

  // 3. Move item position
  const handleMoveItem = (dx, dz) => {
    if (!selectedItemId) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === selectedItemId) {
          const newX = Math.max(-3.5, Math.min(3.5, Number((item.x + dx).toFixed(2))));
          const newZ = Math.max(-3.2, Math.min(3.0, Number((item.z + dz).toFixed(2))));
          return { ...item, x: newX, z: newZ };
        }
        return item;
      })
    );
  };

  // 4. Rotate item
  const handleRotateItem = (deltaAngle) => {
    if (!selectedItemId) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === selectedItemId) {
          return { ...item, rotation: (item.rotation + deltaAngle) % 360 };
        }
        return item;
      })
    );
  };

  // 5. Duplicate item
  const handleDuplicateItem = () => {
    if (!selectedItem) return;
    const newInstanceId = `item-${selectedItem.id}-${Date.now()}`;
    const duplicate = {
      ...selectedItem,
      instanceId: newInstanceId,
      x: Math.min(3.0, selectedItem.x + 0.8),
      z: Math.min(2.8, selectedItem.z + 0.5)
    };
    setPlacedItems((prev) => [...prev, duplicate]);
    setSelectedItemId(newInstanceId);
    showToast(`تم تكرار "${selectedItem.name.split('(')[0].trim()}"`);
  };

  // 6. Change finish/color of selected item
  const handleChangeItemFinish = (finish) => {
    if (!selectedItemId) return;
    setPlacedItems((prev) =>
      prev.map((item) => {
        if (item.instanceId === selectedItemId) {
          return { ...item, finish };
        }
        return item;
      })
    );
  };

  // 7. Load layout presets
  const handleApplyPreset = (presetName) => {
    if (presetName === 'empty') {
      setPlacedItems([]);
      setSelectedItemId(null);
      showToast('تم تفريغ الغرفة - يمكنك البدء بتأثيثها من الكتالوج');
    } else if (presetName === 'modernLiving') {
      setPlacedItems(defaultLayout);
      setSelectedItemId(defaultLayout[0].instanceId);
      showToast('تم تطبيق نموذج "غرفة معيشة متكاملة"');
    } else if (presetName === 'lounge') {
      const sofa = products.find((p) => p.category === 'الكنب') || products[0];
      const chair1 = products.find((p) => p.id === 'chair-1') || products[1];
      const chair2 = products.find((p) => p.id === 'chair-2') || products[2];
      setPlacedItems([
        { instanceId: 'lounge-1', ...sofa, x: 0, z: -1.2, rotation: 0 },
        { instanceId: 'lounge-2', ...chair1, x: -1.8, z: 0.2, rotation: 45 },
        { instanceId: 'lounge-3', ...chair2, x: 1.8, z: 0.2, rotation: -45 }
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
              <span className="crumb-current">مصمم الغرف ثلاثي الأبعاد</span>
            </nav>
            <h1 className="planner-main-title">استوديو تأثيث الغرفة التفاعلي</h1>
          </div>

          {/* Quick Presets & Floor Toggles */}
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
                title="منظور عين الإنسان"
              >
                <Eye size={14} />
                <span>عين الإنسان</span>
              </button>
              <button
                type="button"
                className={`planner-pill-btn ${cameraMode === 'top' ? 'active' : ''}`}
                onClick={() => setCameraMode('top')}
                title="مخطط علوي 2D"
              >
                <span>مخطط علوي</span>
              </button>
            </div>

            {/* Room Style Switcher */}
            <div className="planner-pill-group" role="group" aria-label="خامة الأرضية">
              <button
                type="button"
                className={`planner-pill-btn ${floorType === 'parquet' ? 'active' : ''}`}
                onClick={() => setFloorType('parquet')}
              >
                <span>خشب أوك</span>
              </button>
              <button
                type="button"
                className={`planner-pill-btn ${floorType === 'darkWood' ? 'active' : ''}`}
                onClick={() => setFloorType('darkWood')}
              >
                <span>خشب جوز</span>
              </button>
              <button
                type="button"
                className={`planner-pill-btn ${floorType === 'marble' ? 'active' : ''}`}
                onClick={() => setFloorType('marble')}
              >
                <span>رخام عاجي</span>
              </button>
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

      {/* Main Studio Workspace: 3D Room Left/Center, Furniture Catalog Right */}
      <div className="planner-main-workspace">
        {/* 1. 3D Canvas Viewport */}
        <div className="planner-viewport-area">
          <Suspense fallback={<LoadingState message="جارٍ تجهيز استوديو الغرفة 3D..." />}>
            <RoomCanvas
              placedItems={placedItems}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onUpdatePosition={handleMoveItem}
              cameraMode={cameraMode}
              floorType={floorType}
              wallColor={wallColor}
            />
          </Suspense>

          {/* Floating Instructions / Hint */}
          <div className="planner-canvas-hint">
            <span>انقر على أي قطعة لتحديدها وتحريكها أو تغيير لونها</span>
          </div>

          {/* Floating Inspector Panel for Selected Item */}
          {selectedItem && (
            <div className="planner-selected-inspector" role="region" aria-label="أدوات تحريك القطعة">
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

              {/* Movement Arrows Pad */}
              <div className="inspector-controls-grid">
                <div className="d-pad-wrapper">
                  <span className="d-pad-title">تحريك في الغرفة:</span>
                  <div className="d-pad">
                    <button
                      type="button"
                      className="d-pad-btn up"
                      onClick={() => handleMoveItem(0, -0.3)}
                      title="للأمام"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <div className="d-pad-row">
                      <button
                        type="button"
                        className="d-pad-btn left"
                        onClick={() => handleMoveItem(0.3, 0)}
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
                        onClick={() => handleMoveItem(-0.3, 0)}
                        title="لليسار"
                      >
                        <ArrowLeft size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="d-pad-btn down"
                      onClick={() => handleMoveItem(0, 0.3)}
                      title="للخلف"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>

                {/* Color Swatch Picker for Selected Item */}
                {selectedItem.finishes && selectedItem.finishes.length > 0 && (
                  <div className="inspector-finishes-box">
                    <span className="finishes-label">تغيير لون وتنجيد القطعة:</span>
                    <div className="inspector-swatches-row">
                      {selectedItem.finishes.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`inspector-swatch-circle ${selectedItem.finish?.id === f.id ? 'active' : ''}`}
                          style={{ backgroundColor: f.color }}
                          onClick={() => handleChangeItemFinish(f)}
                          title={f.name.split('(')[0].trim()}
                        />
                      ))}
                    </div>
                  </div>
                )}
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
              const isAlreadyInRoom = placedItems.some((item) => item.id === product.id);

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
