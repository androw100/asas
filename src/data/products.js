import { assetUrl } from '../utils/assetUrl';

export const categories = [
  'جميع المنتجات',
  'الكنب',
  'كراسي',
  'طاولات',
  'عناصر معمارية'
];

export const architecturalFinishes = {
  door: [
    { id: 'door-oak', name: 'خشب أوك طبيعي فاخر (Natural Oak)', color: '#9E6D3B', frameColor: '#6E4924', roughness: 0.38, metalness: 0.02 },
    { id: 'door-walnut', name: 'خشب جوز ملكي داكن (Royal Walnut)', color: '#3A2419', frameColor: '#25160E', roughness: 0.35, metalness: 0.02 },
    { id: 'door-white', name: 'أبيض عاجي كلاسيك (Ivory White)', color: '#F4F1EA', frameColor: '#DFD8CC', roughness: 0.30, metalness: 0.01 },
    { id: 'door-charcoal', name: 'رمادي أنثراسيت مودرن (Modern Charcoal)', color: '#303338', frameColor: '#222427', roughness: 0.32, metalness: 0.05 },
    { id: 'door-black', name: 'أسود مطفي بريميوم (Matte Black)', color: '#1B1C1E', frameColor: '#101112', roughness: 0.28, metalness: 0.08 },
    { id: 'door-greige', name: 'غريج دافئ معاصر (Warm Greige)', color: '#9E9486', frameColor: '#7C7366', roughness: 0.35, metalness: 0.02 }
  ],
  window: [
    { id: 'win-oak', name: 'خشب أوك طبيعي دافئ (Warm Oak)', color: '#9E6D3B', sillColor: '#7A5229', roughness: 0.42, metalness: 0.02 },
    { id: 'win-walnut', name: 'خشب جوز ملكي داكن (Royal Walnut)', color: '#3A2419', sillColor: '#25160E', roughness: 0.38, metalness: 0.02 },
    { id: 'win-teak', name: 'خشب تيك عسلي فاخر (Golden Teak)', color: '#B37D47', sillColor: '#8C5E32', roughness: 0.40, metalness: 0.02 },
    { id: 'win-white-wood', name: 'خشب أبيض مدهون ريفي (White Wood)', color: '#F4F0E8', sillColor: '#DFD8CC', roughness: 0.35, metalness: 0.01 },
    { id: 'win-black-wood', name: 'خشب أسود إيبوني مودرن (Ebony Wood)', color: '#22201E', sillColor: '#161514', roughness: 0.34, metalness: 0.03 }
  ],
  column: [
    { id: 'col-marble', name: 'رخام كلكتا فاخر (Calacatta Marble)', color: '#F6F6F8', trimColor: '#E2E2E6', roughness: 0.18, metalness: 0.05 },
    { id: 'col-travertine', name: 'حجر ترافنتينو دافئ (Warm Travertine)', color: '#DDD0BF', trimColor: '#C4B7A6', roughness: 0.62, metalness: 0.02 },
    { id: 'col-plaster', name: 'بياض جصي مطابق للجدران (Wall Plaster)', color: '#EBE5DC', trimColor: '#D8D0C5', roughness: 0.72, metalness: 0.01 },
    { id: 'col-fluted-wood', name: 'خشب أوك مضلع (Fluted Wood)', color: '#966E46', trimColor: '#734E2B', roughness: 0.45, metalness: 0.02 },
    { id: 'col-dark-stone', name: 'جرانيت رمادي فحم (Dark Stone)', color: '#36383B', trimColor: '#252628', roughness: 0.40, metalness: 0.10 }
  ]
};

const doorThumbnail = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="16" fill="%23F5F0EB"/><rect x="25" y="15" width="50" height="72" rx="4" fill="%234A3E38" stroke="%233A2E26" stroke-width="3"/><rect x="30" y="20" width="40" height="64" rx="2" fill="%238B5A2B"/><rect x="34" y="24" width="32" height="26" rx="2" fill="%237A4E24"/><rect x="34" y="54" width="32" height="26" rx="2" fill="%237A4E24"/><circle cx="37" cy="52" r="3" fill="%23D4AF37"/><rect x="37" y="51" width="8" height="2" rx="1" fill="%23D4AF37"/></svg>';

const windowThumbnail = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="16" fill="%23F5F0EB"/><rect x="18" y="20" width="64" height="56" rx="4" fill="%23222428" stroke="%231E2024" stroke-width="3"/><rect x="24" y="26" width="52" height="44" rx="2" fill="%23D8EEF8" opacity="0.85"/><line x1="50" y1="26" x2="50" y2="70" stroke="%23222428" stroke-width="3"/><line x1="24" y1="44" x2="76" y2="44" stroke="%23222428" stroke-width="2.5"/><rect x="14" y="74" width="72" height="6" rx="2" fill="%23EDEAE5" stroke="%23D4CEBE" stroke-width="1.5"/></svg>';

const squareColumnThumbnail = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="16" fill="%23F5F0EB"/><rect x="36" y="22" width="28" height="56" fill="%23F0ECE6" stroke="%23DDD6CD" stroke-width="1.5"/><rect x="32" y="14" width="36" height="8" rx="2" fill="%23E2DDD4"/><rect x="30" y="78" width="40" height="9" rx="2" fill="%23E2DDD4"/><line x1="45" y1="24" x2="45" y2="76" stroke="%23DDD6CD" stroke-width="1.5"/><line x1="55" y1="24" x2="55" y2="76" stroke="%23DDD6CD" stroke-width="1.5"/></svg>';

const roundColumnThumbnail = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="16" fill="%23F5F0EB"/><path d="M36 22 h28 v56 h-28 Z" fill="%23F0ECE6"/><ellipse cx="50" cy="22" rx="16" ry="4" fill="%23E2DDD4"/><ellipse cx="50" cy="78" rx="18" ry="5" fill="%23E2DDD4"/><rect x="30" y="80" width="40" height="7" rx="2" fill="%23D4CEBE"/><line x1="43" y1="24" x2="43" y2="76" stroke="%23DDD6CD" stroke-width="1.5"/><line x1="50" y1="24" x2="50" y2="76" stroke="%23DDD6CD" stroke-width="1.5"/><line x1="57" y1="24" x2="57" y2="76" stroke="%23DDD6CD" stroke-width="1.5"/></svg>';

export const tableFinishes = [
  // ألوان وخامات القماش والسطح (Fabric / Top Variants - الماتيريال الأولى)
  {
    id: 'white-fabric',
    name: 'قماش عاجي ناعم (Ivory White)',
    color: '#EDE8DF',
    variantName: 'white Fabric',
    materialIndex: 0,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'hessian',
    name: 'قماش خيش بيج (Natural Hessian)',
    color: '#D4C4B1',
    variantName: 'Hessain',
    materialIndex: 2,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'blue-fabric',
    name: 'قماش كحلي أنيق (Navy Blue)',
    color: '#3F4A70',
    variantName: 'Blue Fabric',
    materialIndex: 1,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'pink-fabric',
    name: 'قماش وردي هادئ (Muted Blush)',
    color: '#8A5B60',
    variantName: 'Pink Fabric',
    materialIndex: 3,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'olive-fabric',
    name: 'قماش أخضر زيتوني (Earthy Olive)',
    color: '#535033',
    variantName: 'Olive Green Fabric',
    materialIndex: 4,
    target: 'fabric',
    group: 'fabric'
  },

  // ألوان وخامات الأرجل والقاعدة الخشبية (Wood Base Variants - الماتيريال الثانية)
  {
    id: 'oak-wood',
    name: 'خشب أوك طبيعي (Natural Oak)',
    color: '#A88056',
    variantName: 'Oak Wood2',
    materialIndex: 6,
    target: 'wood',
    group: 'wood'
  },
  {
    id: 'dark-wood',
    name: 'خشب أثاث داكن (Dark Walnut)',
    color: '#2B221B',
    variantName: 'Furniture wood.002',
    materialIndex: 5,
    target: 'wood',
    group: 'wood'
  }
];

export const cabinFinishes = [
  {
    id: 'cabin-wood-oak',
    name: 'خشب أوك طبيعي (Natural Oak)',
    color: '#A88056',
    variantName: 'Oak Wood2',
    materialIndex: 0,
    target: 'wood',
    group: 'wood'
  },
  {
    id: 'cabin-wood-dark',
    name: 'خشب أثاث داكن (Dark Wood)',
    color: '#2B221B',
    variantName: 'Furniture wood.002',
    materialIndex: 1,
    target: 'wood',
    group: 'wood'
  }
];

export const tableMaterialMapping = {
  fabric: ['fabric', 'cloth', 'hessain', 'cushion', 'seat', 'upholstery', 'white fabric'],
  wood: ['wood', 'oak', 'leg', 'base', 'frame', 'furniture wood']
};

const catalog = [
  // ==========================================
  // 1. الكنب (Sofas)
  // ==========================================
  {
    id: 'sofa-1',
    name: 'أريكة لونا الفاخرة (Luna Curved Sofa)',
    category: 'الكنب',
    tagline: 'منحنيات انسيابية دافئة وتصميم يحتضن الراحة والأناقة.',
    description: 'أريكة لونا الأيقونية بتصميم مقوس عصري يمنح غرفة المعيشة هدوءاً ودفئاً استثنائياً. تتميز بتنجيد كتاني فاخر مقاوم للاستخدام اليومي وقاعدة خشبية صلبة منحوتة بعناية متناهية.',
    price: 4250,
    rating: 4.9,
    reviewsCount: 124,
    sizes: ['240 سم (3 مقاعد)', '280 سم (4 مقاعد)', '320 سم (كبير)'],
    dimensions: 'العرض 240 سم × العمق 98 سم × الارتفاع 78 سم (ارتفاع المقعد 44 سم)',
    materialsDescription: 'هيكل من خشب الزان المعالج حرارياً، قماش بوليستر قطني ناعم الملمس، حشوة فوم عالية الكثافة مع نوابض جيبية مرنة.',
    modelUrl: '/furniture/sofa1.glb',
    thumbnail: '/images/products/sofa-1.webp',
    featured: true,
    cameraDefaults: {
      position: [6.8, 4.8, 7.8],
      target: [0, 1.35, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },
  {
    id: 'sofa-2',
    name: 'أريكة سينا المريحة (Siena Loveseat)',
    category: 'الكنب',
    tagline: 'أناقة مدمجة مثالية للمساحات العصرية الدافئة.',
    description: 'كنبة ثنائية مدمجة تجمع بين الخطوط المعمارية النظيفة والتنجيد الوثير. صُممت خصيصاً لتناسب الصالونات الأنيقة والشقق العصرية ومساحات القراءة الهادئة.',
    price: 3950,
    rating: 4.9,
    reviewsCount: 67,
    sizes: ['175 سم (مقعدين)', '200 سم (مقعدين رحب)'],
    dimensions: 'العرض 175 سم × العمق 92 سم × الارتفاع 78 سم',
    materialsDescription: 'خشب بلوط طبيعي مصمت، تنجيد قماش عالي المتانة قابل للتنفس، وسائد مقعد مدعمة بحشوة ريشية صناعية.',
    modelUrl: '/furniture/sofa2.glb',
    thumbnail: '/images/products/sofa-2.webp',
    featured: true,
    cameraDefaults: {
      position: [4.8, 3.6, 5.6],
      target: [0, 1.32, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },
  {
    id: 'sofa-3',
    name: 'كنبة كلاود الركنية (Cloud Corner Sectional)',
    category: 'الكنب',
    tagline: 'تجربة جلوس سحابية رحبة تملأ أركان منزلك بالدفء.',
    description: 'كنبة ركنية رحبة بحرف L مزودة بشيزلونج ممتد للاسترخاء التام. مصممة لتكون القلب النابض لغرفة المعيشة العائلية، وتمنحك أقصى درجات المرونة والراحة.',
    price: 5450,
    rating: 4.8,
    reviewsCount: 88,
    sizes: ['285 سم × 180 سم (شيزلونج يمين)', '285 سم × 180 سم (شيزلونج يسار)'],
    dimensions: 'الطول 285 سم × عمق الركن 180 سم × الارتفاع 80 سم',
    materialsDescription: 'قاعدة خشبية ثقيلة معالجة ضد الرطوبة، أقمشة منسوجة مقاومة للبقع، حشوات فائقة النعومة مع نوابض ارتدادية.',
    modelUrl: '/furniture/sofa3.glb',
    thumbnail: '/images/products/sofa-3.webp',
    featured: true,
    cameraDefaults: {
      position: [7.5, 5.2, 8.5],
      target: [0, 1.34, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },
  {
    id: 'sofa-4',
    name: 'طقم كنب صالون ملكي (Modular Grand Suite)',
    category: 'الكنب',
    tagline: 'فخامة فندقية استثنائية لمساحات الاستقبال والقصور.',
    description: 'طقم كنب موديل صالون بمقاييس رحبة وتوزيع مقاعد مرن. يجمع بين الفخامة المعمارية والحرفية الدقيقة ليعكس ذوقك الرفيع في مجالس الضيافة الكبرى.',
    price: 6800,
    rating: 5.0,
    reviewsCount: 42,
    sizes: ['350 سم × 240 سم (شامل كل القطع)'],
    dimensions: 'الطول 350 سم × العمق 240 سم × الارتفاع 78 سم',
    materialsDescription: 'هيكل من الخشب الزان الروماني، أقمشة تركية فاخرة، وسائد إضافية متعددة الأحجام بأقمشة متناسقة.',
    modelUrl: '/furniture/sofa4.glb',
    thumbnail: '/images/products/sofa-4.webp',
    featured: false,
    cameraDefaults: {
      position: [11.5, 7.5, 12.8],
      target: [0, 1.31, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },

  // ==========================================
  // 2. كراسي (Chairs)
  // ==========================================
  {
    id: 'chair-1',
    name: 'كرسي فينوس المريح (Venus Armchair)',
    category: 'كراسي',
    tagline: 'تناغم راقٍ بين انحناءات الخشب الصلب والتنجيد الفاخر.',
    description: 'كرسي بذراعين بتصميم عصري يمزج بين راحة الاسترخاء وهيبة الحضور البصري. مقعده المبطن بعناية ومساند يديه المنحوتة تمنحك جلسة مريحة لساعات القراءة والحديث.',
    price: 1250,
    rating: 4.9,
    reviewsCount: 98,
    sizes: ['قياسي 65 سم'],
    dimensions: 'العرض 65 سم × العمق 62 سم × الارتفاع 78 سم (ارتفاع المقعد 45 سم)',
    materialsDescription: 'هيكل من خشب البلوط المعالج، تنجيد قماش مقاوم للاهتراء، مفاصل متينة مصقولة يدوياً.',
    modelUrl: '/furniture/chair1.glb',
    thumbnail: '/images/products/chair-1.webp',
    featured: true,
    cameraDefaults: {
      position: [3.0, 2.5, 3.5],
      target: [0, 1.35, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },
  {
    id: 'chair-2',
    name: 'كرسي طعام أوريون (Orion Dining Chair)',
    category: 'كراسي',
    tagline: 'انسيابية هندسية مع مسند ظهر منحوت بدقة متناهية.',
    description: 'كرسي طعام فاخر يوازن بين خفة الوزن والصلابة الفائقة. يضفي لمسة من الأناقة الراقية حول طاولات الطعام العصرية، مع دعم ممتاز للظهر أثناء الجلوس.',
    price: 890,
    rating: 4.8,
    reviewsCount: 76,
    sizes: ['قياسي 58 سم'],
    dimensions: 'العرض 58 سم × العمق 60 سم × الارتفاع 80 سم (ارتفاع المقعد 46 سم)',
    materialsDescription: 'خشب زان طبيعي صلب، تنجيد قماش عالي الكثافة، طلاء ورنيش شمعي واقٍ غير لامع.',
    modelUrl: '/furniture/chair2.glb',
    thumbnail: '/images/products/chair-2.webp',
    featured: true,
    cameraDefaults: {
      position: [3.3, 2.6, 3.8],
      target: [0, 1.35, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },
  {
    id: 'chair-3',
    name: 'كرسي نورديك الاسكندنافي (Nordic Lounge Chair)',
    category: 'كراسي',
    tagline: 'بساطة الشمال الأوروبي مع دفء الملمس الطبيعي.',
    description: 'تصميم اسكندنافي هادئ يعتمد على نقاء الخطوط وبساطة المواد الطبيعية. مسند الظهر العريض والمقعد المنحدر يوفران تجربة جلوس مريحة واستثنائية.',
    price: 1100,
    rating: 4.7,
    reviewsCount: 53,
    sizes: ['قياسي 62 سم'],
    dimensions: 'العرض 62 سم × العمق 58 سم × الارتفاع 76 سم',
    materialsDescription: 'خشب أوك مصمت، ألياف كتانية طبيعية عالية الجودة، أقدام مدعمة بحلقات حماية للأرضيات.',
    modelUrl: '/furniture/chair3.glb',
    thumbnail: '/images/products/chair-3.webp',
    featured: false,
    cameraDefaults: {
      position: [3.2, 2.5, 3.6],
      target: [0, 1.28, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },
  {
    id: 'chair-4',
    name: 'كرسي كلوب المبطن (Club Occasional Chair)',
    category: 'كراسي',
    tagline: 'راحة مطلقة تدوم طويلاً بمساند مريحة وملمس غني.',
    description: 'كرسي مريح بذراعين مصمم خصيصاً لجلسات العمل والمطالعة الطويلة. الهيكل الخشبي يحتضن مقعداً مبطناً بعناية فائقة لضمان التوازن المثالي بين الصلابة والراحة.',
    price: 1350,
    rating: 4.9,
    reviewsCount: 39,
    sizes: ['قياسي 64 سم'],
    dimensions: 'العرض 64 سم × العمق 64 سم × الارتفاع 82 سم',
    materialsDescription: 'خشب بلوط أسود أو طبيعي، أقمشة تنجيد منتقاة بعناية، حواف دائرية آمنة.',
    modelUrl: '/furniture/chair4.glb',
    thumbnail: '/images/products/chair-4.webp',
    featured: false,
    cameraDefaults: {
      position: [3.0, 2.5, 3.5],
      target: [0, 1.40, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },

  // ==========================================
  // 3. طاولات (Tables)
  // ==========================================
  {
    id: 'dining-table-1',
    name: 'طاولة طعام دايون مع كراسي (Dion Dining Set)',
    category: 'طاولات',
    tagline: 'مائدة طعام معمارية متكاملة بستة كراسي منحوتة.',
    description: 'طقم مائدة طعام متكامل يجمع بين طاولة خشبية مستطيلة فسيحة وستة كراسي أنيقة مبطنة. يمثل التصميم تحفة في التوازن البصري والمتانة ليصبح النقطة المحورية لغرفة الطعام العائلية.',
    price: 4950,
    rating: 4.9,
    reviewsCount: 110,
    sizes: ['240 سم × 110 سم (6 كراسي)', '280 سم × 120 سم (8 كراسي)'],
    dimensions: 'الطول 240 سم × العرض 110 سم × الارتفاع 76 سم',
    materialsDescription: 'سطح من خشب البلوط الطبيعي الصلب، أرجل خشبية هندسية، كراسي مبطنة بقماش فاخر.',
    modelUrl: '/furniture/dining_tabel.glb',
    thumbnail: '/images/products/dining-table-1.webp',
    featured: true,
    cameraDefaults: {
      position: [11.0, 7.2, 12.2],
      target: [0, 1.48, 0],
      fov: 38
    },
    finishes: tableFinishes,
    materialMapping: tableMaterialMapping
  },

  // ==========================================
  // 4. العناصر المعمارية (Architectural Structural Elements)
  // ==========================================
  {
    id: 'arch-door-1',
    name: 'باب داخلي مودرن (Interior Door)',
    category: 'عناصر معمارية',
    structuralType: 'door',
    tagline: 'باب داخلي بتصميم انسيابي فاخر مع إطار خشب ومقبض معدني ذهبي.',
    description: 'باب معماري داخلي بمقاييس دقيقة وإطار متناسق مع مقبض نحاسي أنيق، يضفي لمسة واقعية مذهلة على تخطيط الغرفة.',
    price: 1850,
    rating: 5.0,
    reviewsCount: 34,
    sizes: ['عرض 95 سم × ارتفاع 215 سم'],
    dimensions: 'العرض 95 سم × العمق 15 سم × الارتفاع 215 سم',
    footprint: { width: 0.95, depth: 0.20, height: 2.15 },
    plannerScale: [1, 1, 1],
    modelUrl: '',
    thumbnail: doorThumbnail,
    featured: false,
    finishes: architecturalFinishes.door
  },
  {
    id: 'arch-window-1',
    name: 'نافذة خشبية معمارية (Architectural Wood Window)',
    category: 'عناصر معمارية',
    structuralType: 'window',
    tagline: 'نافذة خشبية فاخرة بقطعة واحدة مع زجاج بانورامي نقي وجلسة خشبية دافئة.',
    description: 'نافذة خشبية معمارية بتصميم موحد بدون قواطع، مصنوعة من إطار خشب طبيعي فاخر مع جلسة خشبية بارزة وزجاج نقي يحاكي الإضاءة النهارية الطبيعية.',
    price: 2400,
    rating: 4.9,
    reviewsCount: 29,
    sizes: ['عرض 135 سم × ارتفاع 140 سم'],
    dimensions: 'العرض 135 سم × العمق 12 سم × الارتفاع 140 سم',
    footprint: { width: 1.35, depth: 0.15, height: 1.40 },
    plannerScale: [1, 1, 1],
    modelUrl: '',
    thumbnail: windowThumbnail,
    featured: false,
    finishes: architecturalFinishes.window
  },
  {
    id: 'arch-column-square',
    name: 'عامود ديكوري مربع (Square Pillar)',
    category: 'عناصر معمارية',
    structuralType: 'column',
    tagline: 'عامود معماري ديكوري يمتد من الأرضية للسقف مع تيجان وقواعد.',
    description: 'عامود ديكوري مربع يمتد لكامل ارتفاع السقف (2.8 متر) مع قاعدة وتيجان زخرفية كلاسيكية معاصرة لمحاكاة الأعمدة الهيكلية للصالات والغرف.',
    price: 1200,
    rating: 4.8,
    reviewsCount: 19,
    sizes: ['45 سم × 45 سم × ارتفاع 280 سم'],
    dimensions: 'العرض 45 سم × العمق 45 سم × الارتفاع 280 سم',
    footprint: { width: 0.45, depth: 0.45, height: 2.80 },
    plannerScale: [1, 1, 1],
    modelUrl: '',
    thumbnail: squareColumnThumbnail,
    featured: false,
    finishes: architecturalFinishes.column
  },
  {
    id: 'arch-column-round',
    name: 'عامود ديكوري أسطواني (Round Pillar)',
    category: 'عناصر معمارية',
    structuralType: 'column-round',
    tagline: 'عامود أسطواني ناعم بارتفاع الغرفة مع قاعدة دائرية رشيقة.',
    description: 'عامود أسطواني روماني بتصميم معاصر يمتد من الأرضية للسقف مع تيجان وقواعد متدرجة لإبراز فخامة المساحات المفتوحة.',
    price: 1350,
    rating: 4.9,
    reviewsCount: 22,
    sizes: ['قطر 45 سم × ارتفاع 280 سم'],
    dimensions: 'القطر 45 سم × الارتفاع 280 سم',
    footprint: { width: 0.45, depth: 0.45, height: 2.80 },
    plannerScale: [1, 1, 1],
    modelUrl: '',
    thumbnail: roundColumnThumbnail,
    featured: false,
    finishes: architecturalFinishes.column
  }
];

// Calibrated scale factors and footprints in real-world meters (1 unit = 1 meter)
const modelPlannerMetadata = {
  'sofa-1': { plannerScale: [0.35, 0.35, 0.35], footprint: { width: 2.40, depth: 1.15, height: 0.94 } },
  'sofa-2': { plannerScale: [0.38, 0.38, 0.38], footprint: { width: 1.75, depth: 1.00, height: 1.00 } },
  'sofa-3': { plannerScale: [0.37, 0.37, 0.37], footprint: { width: 2.85, depth: 1.20, height: 0.99 } },
  'sofa-4': { plannerScale: [0.30, 0.30, 0.30], footprint: { width: 3.50, depth: 2.25, height: 0.79 } },
  'chair-1': { plannerScale: [0.30, 0.30, 0.30], footprint: { width: 0.68, depth: 0.65, height: 0.81 } },
  'chair-2': { plannerScale: [0.22, 0.22, 0.22], footprint: { width: 0.62, depth: 0.67, height: 0.60 } },
  'chair-3': { plannerScale: [0.22, 0.22, 0.22], footprint: { width: 0.65, depth: 0.57, height: 0.56 } },
  'chair-4': { plannerScale: [0.31, 0.31, 0.31], footprint: { width: 0.64, depth: 0.64, height: 0.87 } },
  'dining-table-1': { plannerScale: [0.225, 0.225, 0.225], footprint: { width: 2.43, depth: 1.28, height: 0.67 } },
  'arch-door-1': { plannerScale: [1, 1, 1], footprint: { width: 0.95, depth: 0.20, height: 2.15 } },
  'arch-window-1': { plannerScale: [1, 1, 1], footprint: { width: 1.40, depth: 0.20, height: 1.30 } },
  'arch-column-square': { plannerScale: [1, 1, 1], footprint: { width: 0.45, depth: 0.45, height: 2.80 } },
  'arch-column-round': { plannerScale: [1, 1, 1], footprint: { width: 0.45, depth: 0.45, height: 2.80 } }
};

export const products = catalog.map((product) => {
  const meta = modelPlannerMetadata[product.id] || {
    plannerScale: [0.3, 0.3, 0.3],
    footprint: { width: 1.0, depth: 1.0, height: 0.8 }
  };
  return {
    ...product,
    plannerScale: meta.plannerScale,
    footprint: meta.footprint,
    modelUrl: product.modelUrl ? assetUrl(product.modelUrl) : '',
    finishes: product.finishes || tableFinishes,
    materialMapping: product.materialMapping || tableMaterialMapping,
    cameraDefaults: product.cameraDefaults || {
      position: [8.5, 5.5, 10.5],
      target: [0, 1.48, 0],
      fov: 38
    },
    thumbnail: product.thumbnail && product.thumbnail.startsWith('data:') ? product.thumbnail : assetUrl(product.thumbnail)
  };
});

export const faqs = [
  {
    question: 'هل يمكنني مشاهدة وتخصيص المنتج بتقنية 3D؟',
    answer: 'نعم! يمكنك تجربة دوران 360 درجة، واختيار الأقمشة وتغيير خامات الخشب في الوقت الفعلي ومشاهدة كل التفاصيل مباشرة في المتصفح قبل اتخاذ قرار الشراء.'
  },
  {
    question: 'هل الألوان والخامات المعروضة مطابقة للمنتج الواقعي؟',
    answer: 'بالتأكيد. جميع الخامات مأخوذة من عينات الإنتاج الفعلية وأقمشة التوريد المعتمدة لدينا بدون أي معالجة لونية إضافية لضمان مطابقتها التامة للواقع.'
  },
  {
    question: 'كيف يتم الشحن والتوصيل والتركيب؟',
    answer: 'نوفر خدمة شحن وتوصيل احترافية مع فريق تركيب متخصص لكافة مناطق المملكة والخليج، مع خدمة الشحن المجاني للطلبات المؤهلة.'
  },
  {
    question: 'ما هي مدة الضمان وسياسة الاستبدال؟',
    answer: 'نقدم ضماناً ممتداً يصل حتى 5 سنوات على الهياكل الخشبية والمفاصل، بالإضافة لسياسة إرجاع واستبدال مرنة وسهلة خلال 30 يوماً.'
  }
];
