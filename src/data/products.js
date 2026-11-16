import { assetUrl } from '../utils/assetUrl';

export const categories = [
  'جميع المنتجات',
  'كراسي ومقاعد',
  'كنب وأنتريهات',
  'طاولات وسفرة',
  'خزائن ودواليب'
];

export const tableFinishes = [
  // ألوان وخامات القماش والسطح (Fabric / Top Variants - الماتيريال الأولى)
  {
    id: 'white-fabric',
    name: 'قماش أبيض ناصع (White Fabric)',
    color: '#B9B9B9',
    variantName: 'white Fabric',
    materialIndex: 0,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'blue-fabric',
    name: 'قماش كحلي أنيق (Blue Fabric)',
    color: '#444F7C',
    variantName: 'Blue Fabric',
    materialIndex: 1,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'hessian',
    name: 'قماش خيش طبيعي (Hessian)',
    color: '#C6B6A3',
    variantName: 'Hessain',
    materialIndex: 2,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'pink-fabric',
    name: 'قماش وردي هادئ (Pink Fabric)',
    color: '#6E4243',
    variantName: 'Pink Fabric',
    materialIndex: 3,
    target: 'fabric',
    group: 'fabric'
  },
  {
    id: 'olive-fabric',
    name: 'قماش أخضر زيتوني (Olive Green)',
    color: '#4F4C2C',
    variantName: 'Olive Green Fabric',
    materialIndex: 4,
    target: 'fabric',
    group: 'fabric'
  },

  // ألوان وخامات الأرجل والقاعدة الخشبية (Wood Base Variants - الماتيريال الثانية)
  {
    id: 'dark-wood',
    name: 'خشب أثاث داكن (Dark Wood)',
    color: '#201A16',
    variantName: 'Furniture wood.002',
    materialIndex: 5,
    target: 'wood',
    group: 'wood'
  },
  {
    id: 'oak-wood',
    name: 'خشب أوك طبيعي (Oak Wood)',
    color: '#795434',
    variantName: 'Oak Wood2',
    materialIndex: 6,
    target: 'wood',
    group: 'wood'
  }
];

export const cabinFinishes = [
  {
    id: 'light-wood',
    name: 'خشب طبيعي فاتح (Light Wood)',
    color: '#C6A477',
    variantName: 'Furniture wood.004',
    materialIndex: 0,
    target: 'wood',
    group: 'wood'
  },
  {
    id: 'dark-wood-cabin',
    name: 'خشب داكن غني (Dark Wood)',
    color: '#201A16',
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
  // 1. كراسي ومقاعد (Chairs)
  // ==========================================
  {
    id: 'chair-1',
    name: 'كرسي استرخاء عصري (Modern Lounge Chair)',
    category: 'كراسي ومقاعد',
    tagline: 'تناغم راقٍ بين انحناءات الخشب الصلب والتنجيد الفاخر.',
    description: 'كرسي استرخاء مفرد يجمع بين الهيكل الخشبي المنحوت والقماش المبطن فائق النعومة. يوفر دعماً مريحاً لفقرات الظهر أثناء الجلوس والقراءة في غرف المعيشة وصالات الاستقبال.',
    dimensions: 'العرض 65 سم × العمق 62 سم × الارتفاع 78 سم (ارتفاع المقعد 45 سم)',
    materialsDescription: 'هيكل من خشب البلوط المعالج، تنجيد قماش مقاوم للبقع، مفاصل متينة مصقولة يدوياً.',
    modelUrl: '/furniture/chair1.glb',
    thumbnail: '/images/chair.webp',
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
    name: 'كرسي طعام فاخر (Luxury Dining Chair)',
    category: 'كراسي ومقاعد',
    tagline: 'انسيابية هندسية مع مسند ظهر منحوت بدقة متناهية.',
    description: 'كرسي طعام بتصميم هندسي استثنائي يجمع بين الهيكل الخشبي المتين والمقعد المبطن المريح. يضفي لمسة من الفخامة العصرية حول أي مائدة طعام راقية.',
    dimensions: 'العرض 58 سم × العمق 60 سم × الارتفاع 80 سم (ارتفاع المقعد 46 سم)',
    materialsDescription: 'خشب زان طبيعي صلب، تنجيد قماش عالي الكثافة، طلاء ورنيش شمعي واقٍ.',
    modelUrl: '/furniture/chair2.glb',
    thumbnail: '/images/cane-chair.webp',
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
    name: 'كرسي اسكندنافي أنيق (Scandi Comfort Chair)',
    category: 'كراسي ومقاعد',
    tagline: 'بساطة الشمال الأوروبي مع دفء الملمس الطبيعي.',
    description: 'تصميم اسكندنافي بسيط يعتمد على خطوط نقية وألوان طبيعية دافئة. يتميز بمسند ظهر محتضن يمنحك شعوراً فورياً بالراحة والهدوء في زوايا المنزل المختلفة.',
    dimensions: 'العرض 62 سم × العمق 58 سم × الارتفاع 76 سم',
    materialsDescription: 'خشب أوك مصمت، ألياف كتانية طبيعية، حشوات إسفنجية عالية المرونة.',
    modelUrl: '/furniture/chair3.glb',
    thumbnail: '/images/scandi-oak.webp',
    featured: true,
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
    name: 'كرسي بذراعين مبطن (Padded Armchair)',
    category: 'كراسي ومقاعد',
    tagline: 'راحة مطلقة تدوم طويلاً بمساند مريحة وملمس غني.',
    description: 'كرسي مريح بذراعين مصمم خصيصاً لجلسات العمل والاسترخاء الطويلة. الهيكل الخشبي المتين يحتضن مقعداً مبطناً بعناية لضمان التوازن المثالي بين الصلابة والراحة.',
    dimensions: 'العرض 64 سم × العمق 64 سم × الارتفاع 82 سم',
    materialsDescription: 'خشب بلوط أسود أو طبيعي، أقمشة تنجيد منتقاة بعناية، حواف دائرية آمنة.',
    modelUrl: '/furniture/chair4.glb',
    thumbnail: '/images/ergonomic-chair.webp',
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
  // 2. كنب وأنتريهات (Sofas)
  // ==========================================
  {
    id: 'sofa-1',
    name: 'كنبة ثلاثية مودرن (Randy 3-Seater Sofa)',
    category: 'كنب وأنتريهات',
    tagline: 'فخامة معاصرة بمقاعد فسيحة وعمق مدروس للراحة اليومية.',
    description: 'كنبة عائلية تتسع لثلاثة أشخاص بكل أريحية. تتميز بخطوطها المعمارية الواضحة وتنجيدها الفاخر مع قاعدة خشبية متينة ترفع التصميم وتمنحه خفة بصرية راقية في صالات المعيشة.',
    dimensions: 'الطول 240 سم × العمق 98 سم × الارتفاع 78 سم',
    materialsDescription: 'هيكل داخلي صلب من الخشب المعالج، نوابض جيبية مرنة، تنجيد قماش مقاوم للاهتراء.',
    modelUrl: '/furniture/sofa1.glb',
    thumbnail: '/images/scandi-linen.webp',
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
    name: 'كنبة ثنائية مريحة (Loveseat Cozy Sofa)',
    category: 'كنب وأنتريهات',
    tagline: 'أناقة مدمجة للمساحات الدافئة والاستقبال العصري.',
    description: 'كنبة ثنائية أنيقة تلائم المساحات المدمجة ومكاتب الاستقبال الفاخرة. تجمع بين العملية العالية والجمال الانسيابي لتوفر ركناً مثالياً للحديث والاسترخاء.',
    dimensions: 'الطول 175 سم × العمق 92 سم × الارتفاع 78 سم',
    materialsDescription: 'خشب طبيعي صلب، حشوات إسفنجية متعددة الكثافة، قماش فاخر قابل للتهوية.',
    modelUrl: '/furniture/sofa2.glb',
    thumbnail: '/images/hero-living.webp',
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
    name: 'كنبة ركنية حرف L عصرية (Corner L-Shape Sofa)',
    category: 'كنب وأنتريهات',
    tagline: 'تصميم ركني رحب يجمع العائلة في جلسات مليئة بالدفء.',
    description: 'كنبة ركنية رحبة مصممة لتحقيق أقصى درجات الاستفادة من زوايا الغرفة. توفر شيزلونج ممتد للاسترخاء التام ومشاهدة التلفاز مع وسائد ظهر محشوة بالريش الصناعي الفاخر.',
    dimensions: 'الطول 285 سم × عمق الركن 180 سم × الارتفاع 80 سم',
    materialsDescription: 'قاعدة خشبية ثقيلة معالجة، أقمشة محبوكة عالية المتانة، أقدام خشبية متينة.',
    modelUrl: '/furniture/sofa3.glb',
    thumbnail: '/images/upholstered-chair.webp',
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
    name: 'طقم كنب عائلي كبير (Modular Sectional Sofa)',
    category: 'كنب وأنتريهات',
    tagline: 'تجربة جلوس فندقية متكاملة تلبي أرقى معايير الضيافة.',
    description: 'طقم كنب عائلي متكامل بمقاسات رحبة جداً وتوزيع مقاعد مرن. مصمم لصالونات الاستقبال الفخمة والمساحات المفتوحة ليمنح منزلك فخامة فندقية لا تُضاهى.',
    dimensions: 'الطول 350 سم × العمق 240 سم × الارتفاع 78 سم',
    materialsDescription: 'هيكل من الخشب الزان، وسائد مقاعد قابلة للقلب، أقمشة منسوجة فاخرة مقاومة للسوائل.',
    modelUrl: '/furniture/sofa4.glb',
    thumbnail: '/images/hero-living.webp',
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
  // 3. طاولات وسفرة (Tables)
  // ==========================================
  {
    id: 'dining-table-1',
    name: 'طاولة طعام دايون مع كراسي (Dion Dining Table Set)',
    category: 'طاولات وسفرة',
    tagline: 'مائدة طعام معمارية متكاملة بستة كراسي منحوتة.',
    description: 'طقم مائدة طعام متكامل يجمع بين طاولة خشبية مستطيلة بستة كراسي أنيقة مبطنة. يمثل التصميم تحفة في التوازن البصري والمتانة ليصبح النقطة المحورية لغرفة الطعام العائلية.',
    dimensions: 'الطول 240 سم × العرض 110 سم × الارتفاع 76 سم',
    materialsDescription: 'سطح من خشب البلوط الطبيعي الصلب، أرجل خشبية هندسية، كراسي مبطنة بقماش فاخر.',
    modelUrl: '/furniture/dining_tabel.glb',
    thumbnail: '/images/oak-concrete-table.webp',
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
  // 4. خزائن ودواليب (Cabinets)
  // ==========================================
  {
    id: 'cabinet-1',
    name: 'خزانة خشبية متعددة الأرفف (Modern Wooden Cabinet)',
    category: 'خزائن ودواليب',
    tagline: 'تنظيم ذكي وفخامة خشبية هادئة تعزز جمال مساحتك.',
    description: 'خزانة متعددة الأغراض بتصميم عصري وأبواب ناعمة الإغلاق. توفر مساحة تخزين واسعة لحفظ الأواني والكتب والمقتنيات الثمينة مع الحفاظ على مظهر راقٍ وبسيط.',
    dimensions: 'العرض 180 سم × العمق 45 سم × الارتفاع 90 سم',
    materialsDescription: 'خشب طبيعي مصفح بقشرة البلوط الفاخرة، مفصلات ألمانية مخفية بنظام هيدروليك.',
    modelUrl: '/furniture/Cabin.glb',
    thumbnail: '/images/about-craft.webp',
    featured: true,
    cameraDefaults: {
      position: [7.2, 4.8, 8.0],
      target: [0, 1.49, 0],
      fov: 38
    },
    finishes: cabinFinishes,
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
    question: 'هل يمكنني مشاهدة المنتج بتقنية 3D؟',
    answer: 'نعم، جميع منتجات ASAS مدعومة بنماذج تفاعلية ثلاثية الأبعاد يمكنك استكشافها وتدويرها 360 درجة، وتقريب أدق تفاصيل الخامة مباشرة داخل الموقع.'
  },
  {
    question: 'هل يمكنني تغيير خامات وألوان المنتج؟',
    answer: 'بالتأكيد! يمكنك تجربة ألوان القماش وخامات الخشب المدمجة للمنتج، ومشاهدة التغييرات فوراً على المجسم ثلاثي الأبعاد بأعلى دقة.'
  },
  {
    question: 'هل الألوان والخامات المعروضة متاحة للتصنيع والشراء؟',
    answer: 'نعم، جميع الخيارات المعروضة مطابقة لمواصفات الإنتاج الفعلية. يُرجى التواصل معنا عبر زر الاستفسار لتأكيد موعد التسليم والتفاصيل.'
  },
  {
    question: 'كيف يمكنني معرفة السعر والحصول على عرض رسمي؟',
    answer: 'يمكنك التواصل معنا مباشرة عبر زر "استفسر عن السعر والتفاصيل" للحصول على تسعيرة رسمية دقيقة وفق التخصيص والخامات التي اخترتها.'
  },
  {
    question: 'هل يمكنني معرفة أبعاد المنتج بدقة؟',
    answer: 'تُعرض الأبعاد التفصيلية (العرض، العمق، الارتفاع) في صفحة كل منتج لتساعدك على تخطيط وتنسيق مساحتك بكل ثقة.'
  },
  {
    question: 'كيف يمكنني التواصل مع الشركة؟',
    answer: 'يمكنك استخدام نموذج الاستفسار المباشر في صفحة التواصل وصفحة كل منتج، أو مراسلتنا على بريد الاستوديو الرسمي studio@asas-living.com.'
  }
];
