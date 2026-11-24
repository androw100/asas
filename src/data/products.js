import { assetUrl } from '../utils/assetUrl';

export const categories = [
  'جميع المنتجات',
  'الكنب',
  'كراسي',
  'طاولات'
];

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
  }
];

export const products = catalog.map((product) => ({
  ...product,
  modelUrl: assetUrl(product.modelUrl),
  finishes: product.finishes || tableFinishes,
  materialMapping: product.materialMapping || tableMaterialMapping,
  cameraDefaults: product.cameraDefaults || {
    position: [8.5, 5.5, 10.5],
    target: [0, 1.48, 0],
    fov: 38
  },
  thumbnail: assetUrl(product.thumbnail)
}));

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
