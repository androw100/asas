/**
 * ASAS — أساس للأثاث والديكور
 * كتالوج المنتجات الرسمي مع دعم الموديلات ثلاثية الأبعاد الحقيقية
 */

export const categories = [
  "جميع المنتجات",
  "كراسي ومقاعد",
  "طاولات"
];

export const products = [
  // ==========================================
  // كراسي ومقاعد
  // ==========================================
  {
    id: "atelier-chair",
    name: "كرسي آتلييه الفاخر",
    englishName: "The Atelier Accent Chair",
    category: "كراسي ومقاعد",
    tagline: "تناغم راقٍ بين بساطة الخطوط الهندسية والراحة اليومية.",
    description: "صُمم كرسي آتلييه ليمنح ركنك المفضل لمسة من الراحة والشخصية. يجمع بين الخشب الطبيعي المتين والتنجيد المدروس ليوازن بين الأناقة والاستخدام العملي في مساحات المعيشة وتناول الطعام.",
    dimensions: "العرض 62 سم × العمق 60 سم × الارتفاع 78 سم (ارتفاع المقعد 45 سم)",
    materialsDescription: "هيكل من الخشب الصلب المعالج، مفاصل متينة، وتشطيب طبيعي يدوي.",
    modelUrl: "/models/chair.glb",
    thumbnail: "/images/chair.webp",
    featured: true,
    cameraDefaults: {
      position: [2.0, 1.5, 2.5],
      target: [0, 0.4, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "wood" },
      { id: "natural-oak", name: "خشب أوك طبيعي", color: "#C6A477", target: "wood" },
      { id: "walnut", name: "خشب جوز داكن", color: "#603A25", target: "wood" },
      { id: "charcoal-ebony", name: "خشب أسود كربوني", color: "#222120", target: "wood" }
    ],
    materialMapping: {
      wood: ["material_0", "object_0", "mesh", "wood", "material"]
    }
  },
  {
    id: "cane-dining-chair",
    name: "كرسي القصب والخشب الأسود",
    englishName: "Black Wood Cane Dining Chair",
    category: "كراسي ومقاعد",
    tagline: "قصب طبيعي منسوج يلتقي مع انحناءات خشبية نحتية.",
    description: "تصميم يحتفي بالحرفية اليدوية وتداخل الخامات الطبيعية. يمنح نسيج القصب مرونة وتهوية مريحة، بينما يمنح الهيكل الخشبي الداكن حضوراً بصرياً دافئاً حول مائدة الطعام.",
    dimensions: "العرض 54 سم × العمق 56 سم × الارتفاع 79 سم (ارتفاع المقعد 45 سم)",
    materialsDescription: "خشب دردار مجفف في الفرن، قصب طبيعي منسوج يدوياً، طلاء شمعي ناعم.",
    modelUrl: "/models/black-wood-cane-dining-chair.glb",
    thumbnail: "/images/cane-chair.webp",
    featured: true,
    cameraDefaults: {
      position: [1.8, 1.4, 2.2],
      target: [0, 0.38, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "wood" },
      { id: "aged-walnut", name: "جوز معتق", color: "#7A4D35", target: "wood" },
      { id: "nordic-oak", name: "أوك عنبري", color: "#C8A67B", target: "wood" },
      { id: "deep-charcoal", name: "أسود فحمي مطفأ", color: "#1F1E1C", target: "wood" }
    ],
    materialMapping: {
      wood: ["material", "mesh", "wood", "frame"]
    }
  },
  {
    id: "highback-windsor-chair",
    name: "كرسي ويندسور النحتي بظهر مرتفع",
    englishName: "Highback Windsor Sculptural Chair",
    category: "كراسي ومقاعد",
    tagline: "أعمدة خشبية رأسية تصنع حضوراً معمارياً استثنائياً.",
    description: "إعادة ابتكار عصرية لكرسي ويندسور الكلاسيكي. يتميز بظهره المرتفع وانحناءاته الانسيابية التي تلفت الأنظار وتمنح زوايا المنزل هيبة وفخامة هادئة.",
    dimensions: "العرض 65 سم × العمق 62 سم × الارتفاع 118 سم",
    materialsDescription: "خشب بلوط صلب مشكّل بالبخار، أعمدة منحوتة ومصقولة يدوياً.",
    modelUrl: "/models/highback-windsor-chair.glb",
    thumbnail: "/images/windsor.webp",
    featured: true,
    cameraDefaults: {
      position: [2.5, 1.8, 2.9],
      target: [0, 0.55, 0],
      fov: 42
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "wood" },
      { id: "raw-oak", name: "تشطيب البلوط الخام", color: "#CCA779", target: "wood" },
      { id: "charcoal-pitch", name: "أسود نفاث", color: "#222120", target: "wood" },
      { id: "bronze-wash", name: "لمسة برونزية دافئة", color: "#8E7A5A", target: "wood" }
    ],
    materialMapping: {
      wood: ["material", "mesh", "spindles", "wood"]
    }
  },
  {
    id: "wooden-wishbone-chair",
    name: "كرسي ويشبون الخشبي الاسكندنافي",
    englishName: "Scandinavian Wishbone Timber Chair",
    category: "كراسي ومقاعد",
    tagline: "تصميم أيقوني يجمع بين مسند الذراع المنحني والمقعد المنسوج.",
    description: "قطعة تجمع بين خفة الوزن والمتانة العالية. مسند الظهر المصمم على شكل حرف Y يوفر دعماً مريحاً للظهر أثناء الجلوس، بينما يضفي المقعد المنسوج دفئاً طبيعياً.",
    dimensions: "العرض 55 سم × العمق 51 سم × الارتفاع 76 سم",
    materialsDescription: "خشب زان طبيعي صلب، حبال ورقية مضفورة ومقاومة للاستخدام اليومي.",
    modelUrl: "/models/wooden-wishbone-chair.glb",
    thumbnail: "/images/wishbone.webp",
    featured: true,
    cameraDefaults: {
      position: [1.8, 1.3, 2.2],
      target: [0, 0.38, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "wood" },
      { id: "warm-oak", name: "أوك ذهبي", color: "#D4B083", target: "wood" },
      { id: "dark-walnut", name: "جوز داكن", color: "#563625", target: "wood" },
      { id: "ebonized", name: "رمادي معتم", color: "#242322", target: "wood" }
    ],
    materialMapping: {
      wood: ["material", "mesh", "wood"]
    }
  },
  {
    id: "scandinavian-oak-chair",
    name: "كرسي أوك الاسكندنافي بوسادة بيج",
    englishName: "Scandinavian Oak & Cushion Chair",
    category: "كراسي ومقاعد",
    tagline: "خطوط خشبية مستديرة مع وسادة مريحة بتدرجات محايدة.",
    description: "تناسب هذه القطعة غرف الطعام العصرية والمساحات المفتوحة. توفر الوسادة المدمجة راحة إضافية تدوم طوال فترة الجلوس، مع الحفاظ على صفاء التصميم العام.",
    dimensions: "العرض 54 سم × العمق 55 سم × الارتفاع 85 سم",
    materialsDescription: "خشب بلوط مستدام، إسفنج عالي المرونة، قماش كتان بيج منسوج.",
    modelUrl: "/models/scandinavian-oak-chair-with-beige-cushion.glb",
    thumbnail: "/images/scandi-oak.webp",
    featured: false,
    cameraDefaults: {
      position: [1.8, 1.4, 2.2],
      target: [0, 0.42, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "wood" },
      { id: "honey-oak", name: "عسلي دافئ", color: "#DAB685", target: "wood" },
      { id: "smoked-walnut", name: "جوز مدخن", color: "#5F3E2B", target: "wood" },
      { id: "black-timber", name: "خشب أسود", color: "#252422", target: "wood" }
    ],
    materialMapping: {
      wood: ["material.001", "mesh", "wood"]
    }
  },
  {
    id: "scandinavian-wood-linen-chair",
    name: "كرسي خشب وكتان اسكندنافي",
    englishName: "Scandinavian Wood & Linen Dining Chair",
    category: "كراسي ومقاعد",
    tagline: "تصميم بسيط يحتفي بالألياف الطبيعية والاتصال الهادئ.",
    description: "كرسي يركز على راحة الجسم والتناغم البصري مع طاولات الطعام المختلفة. يمنح مساحتك طابعاً مريحاً ومرحباً.",
    dimensions: "العرض 50 سم × العمق 54 سم × الارتفاع 85 سم",
    materialsDescription: "هيكل خشب رماد صلب، ظهر ومقعد من الكتان الطبيعي النقي.",
    modelUrl: "/models/scandinavian-wood-and-linen-chair.glb",
    thumbnail: "/images/scandi-linen.webp",
    featured: false,
    cameraDefaults: {
      position: [1.7, 1.4, 2.1],
      target: [0, 0.42, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "wood" },
      { id: "golden-oak", name: "بلوط ناصع", color: "#CFA978", target: "wood" },
      { id: "espresso", name: "إسبريسو غني", color: "#3B2A20", target: "wood" }
    ],
    materialMapping: {
      wood: ["material", "mesh", "wood"]
    }
  },
  {
    id: "upholstered-dining-chair",
    name: "كرسي طعام منجد بتصميم متقن",
    englishName: "Tailored Upholstered Dining Chair",
    category: "كراسي ومقاعد",
    tagline: "انحناءات مريحة وتنجيد يمنح تجربة جلوس وثيرة.",
    description: "خيار مثالي لغرف الطعام الفاخرة، حيث يحتضن الجالس بقماش فاخر وأرجل متناسقة تضيف لمسة فندقية راقية لبيتك.",
    dimensions: "العرض 52 سم × العمق 58 سم × الارتفاع 86 سم",
    materialsDescription: "هيكل داخلي متين، حشوات إسفنجية كثيفة، قماش ناعم الملمس وسهل العناية.",
    modelUrl: "/models/upholstered-dining-chair.glb",
    thumbnail: "/images/upholstered-chair.webp",
    featured: false,
    cameraDefaults: {
      position: [1.8, 1.4, 2.2],
      target: [0, 0.42, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "upholstery" },
      { id: "sand-linen", name: "رملي دافئ", color: "#E0D7C8", target: "upholstery" },
      { id: "terracotta", name: "تيراكوتا ترابي", color: "#A76049", target: "upholstery" },
      { id: "slate-grey", name: "رمادي صخري", color: "#454443", target: "upholstery" }
    ],
    materialMapping: {
      upholstery: ["material", "mesh", "fabric", "seat"]
    }
  },
  {
    id: "leather-office-chair",
    name: "كرسي مكتب من الجلد الفاخر",
    englishName: "Executive Leather Desk Chair",
    category: "كراسي ومقاعد",
    tagline: "حضور قيادي راقٍ مع خياطة جلدية متقنة وقاعدة انسيابية.",
    description: "صُمم للمكاتب المنزلية وغرف القراءة الخاصة. جلد ناعم ومريح مع قاعدة فولاذية وعجلات ناعمة تجعل يوم عملك مريحاً وأنيقاً.",
    dimensions: "العرض 68 سم × العمق 66 سم × الارتفاع 95 سم",
    materialsDescription: "جلد عالي الجودة بملمس طبيعي، قاعدة معدنية مصقولة، آلية تحكم بالارتفاع.",
    modelUrl: "/models/leather-office-chair.glb",
    thumbnail: "/images/leather-chair.webp",
    featured: false,
    cameraDefaults: {
      position: [2.0, 1.5, 2.4],
      target: [0, 0.45, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "upholstery" },
      { id: "caramel", name: "كراميل كلاسيكي", color: "#B87545", target: "upholstery" },
      { id: "oxblood", name: "عنابي ملكي", color: "#6A2F2B", target: "upholstery" },
      { id: "obsidian", name: "أسود أوبسيديان", color: "#202020", target: "upholstery" }
    ],
    materialMapping: {
      upholstery: ["material", "mesh", "leather"]
    }
  },
  {
    id: "ergonomic-chair",
    name: "كرسي مريح عصري بتقنية الشبك",
    englishName: "Contemporary Ergonomic Task Chair",
    category: "كراسي ومقاعد",
    tagline: "شبك تقني يسمح بالتهوية ودعم ديناميكي للفقرات.",
    description: "خيارك الأمثل لساعات العمل والتركيز الطويلة. دعم مستمر لأسفل الظهر ومساند قابلة للضبط تضمن سلامة وضعية الجلوس.",
    dimensions: "العرض 65 سم × العمق 65 سم × الارتفاع 115 سم",
    materialsDescription: "هيكل بوليمر معزز، نسيج شبكي متين وقابل للتنفس، قاعدة خماسية متوازنة.",
    modelUrl: "/models/ergonomic-chair.glb",
    thumbnail: "/images/ergonomic-chair.webp",
    featured: false,
    cameraDefaults: {
      position: [2.2, 1.6, 2.6],
      target: [0, 0.55, 0],
      fov: 40
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "mesh" },
      { id: "graphite", name: "رمادي جرافيت", color: "#777777", target: "mesh" },
      { id: "bronze-accent", name: "برونزي معاصر", color: "#9E825C", target: "mesh" }
    ],
    materialMapping: {
      mesh: ["material.001", "mesh.001", "mesh"]
    }
  },

  // ==========================================
  // طاولات
  // ==========================================
  {
    id: "oak-concrete-dining-table",
    name: "طاولة طعام مونوليث الضخمة من الأوك والكونكريت",
    englishName: "Monolith Oak & Concrete Grand Dining Table",
    category: "طاولات",
    tagline: "طاولة طعام معمارية تتسع لـ 10 إلى 12 شخصاً بتصميم مهيب.",
    description: "قطعة مركزية مبهرة بطول 3 أمتار تجمع بين ألواح البلوط السميكة وقواعد الكونكريت المعماري الصلبة. صُممت للمساحات الكبيرة والولائم العائلية الممتدة.",
    dimensions: "الطول 300 سم × العرض 152 سم × الارتفاع 90 سم",
    materialsDescription: "سطح من خشب البلوط الصلب، قواعد صب كونكريت معمارية معززة.",
    modelUrl: "/models/10-12-seat-extra-large-rectangular-oak-and-concrete-dining-table.glb",
    thumbnail: "/images/oak-concrete-table.webp",
    featured: true,
    cameraDefaults: {
      position: [4.4, 2.7, 4.4],
      target: [0, 0.45, 0],
      fov: 42
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "table" },
      { id: "smoked-oak", name: "أوك مدخن", color: "#544336", target: "table" },
      { id: "raw-concrete", name: "رمادي أسمنتي فاتح", color: "#D2CBC2", target: "table" },
      { id: "dark-slate", name: "حجري داكن", color: "#2E2D2B", target: "table" }
    ],
    materialMapping: {
      table: ["Material_0.003", "Mesh_0.001", "material", "mesh"]
    }
  },
  {
    id: "black-marble-gold-table",
    name: "طاولة رخام أسود مستطيلة بأرجل ذهبية",
    englishName: "Rectangular Black Marble & Gold Dining Table",
    category: "طاولات",
    tagline: "تتسع لـ 4 إلى 6 مقاعد بأناقة هندسية وتشطيب ذهبي ناعم.",
    description: "عروق بيضاء دقيقة تنساب على سطح الرخام الأسود المصقول، ترتكز على أرجل فولاذية مطلية بلمسة ذهبية غير لامعة، لتمنح مساحتك لمسة عصرية وفخمة.",
    dimensions: "الطول 160 سم × العرض 95 سم × الارتفاع 68 سم",
    materialsDescription: "سطح رخام مركب عالي المقاومة، هيكل فولاذي مطلي بالذهب المطفأ.",
    modelUrl: "/models/4-6-seat-rectangular-black-faux-marble-dining-table-with-gold-legs.glb",
    thumbnail: "/images/black-marble-table.webp",
    featured: true,
    cameraDefaults: {
      position: [2.8, 1.8, 2.8],
      target: [0, 0.35, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "table" },
      { id: "warm-bronze", name: "عنبري دافئ", color: "#A88E67", target: "table" },
      { id: "dark-obsidian", name: "أسود أوبسيديان حالك", color: "#222222", target: "table" }
    ],
    materialMapping: {
      table: ["Material_0", "Mesh_0", "material", "mesh"]
    }
  },
  {
    id: "white-marble-gold-table",
    name: "طاولة رخام أبيض دائرية بقاعدة ذهبية",
    englishName: "Round White Marble & Gold Dining Table",
    category: "طاولات",
    tagline: "طاولة دائرية لـ 4 مقاعد بقاعدة بوقية نحتية تمنح حميمية دافئة.",
    description: "يشجع الشكل الدائري على التواصل والقرب في جلسات الطعام العائلية. قاعدة البوق النحتية توفر راحة تامة لحركة الأقدام وتمنح الطاولة مظهراً يطفو برقة في الغرفة.",
    dimensions: "القطر 115 سم × الارتفاع 71 سم",
    materialsDescription: "سطح رخام كارارا مركب ومصقول، قاعدة بوقية فولاذية متزنة مطلية ببرونز ذهبي.",
    modelUrl: "/models/4-seat-round-white-faux-marble-dining-table-with-gold-base.glb",
    thumbnail: "/images/white-marble-table.webp",
    featured: true,
    cameraDefaults: {
      position: [2.4, 1.6, 2.4],
      target: [0, 0.35, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "table" },
      { id: "rose-alabaster", name: "ألاباستر عاجي دافئ", color: "#E0D7CB", target: "table" },
      { id: "bronze-patina", name: "برونز أنتيك", color: "#8E7756", target: "table" }
    ],
    materialMapping: {
      table: ["Material_0", "Mesh_0", "material", "mesh"]
    }
  },
  {
    id: "tempered-glass-dining-table",
    name: "طاولة زجاج مقسى دائرية بقاعدة هندسية",
    englishName: "Round Tempered Glass Dining Table with Geometric Base",
    category: "طاولات",
    tagline: "سطح زجاجي شفاف يعكس الضوء ويكشف عن قاعدة خشبية متقاطعة.",
    description: "يمنح الزجاج الشفاف شعوراً باتساع المساحة وانسيابية الضوء، بينما تضفي القاعدة الخشبية الهندسية المتداخلة دفئاً معمارياً يثري المكان.",
    dimensions: "القطر 114 سم × الارتفاع 75 سم",
    materialsDescription: "زجاج سيكوريت مقسى بسماكة 12 مم بحواف مشطوفة، قاعدة هندسية من خشب الدردار.",
    modelUrl: "/models/4-seat-round-tempered-glass-dining-table-with-geometric-base.glb",
    thumbnail: "/images/glass-table.webp",
    featured: false,
    cameraDefaults: {
      position: [2.4, 1.6, 2.4],
      target: [0, 0.38, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "table" },
      { id: "smoked-tint", name: "زجاج مدخن خفيف", color: "#666460", target: "table" },
      { id: "bronze-tint", name: "زجاج برونزي دافئ", color: "#9E825C", target: "table" }
    ],
    materialMapping: {
      table: ["Material_0", "Mesh_0", "material", "mesh"]
    }
  },
  {
    id: "farmhouse-pedestal-table",
    name: "طاولة فارمهاوس الدائرية المدمجة",
    englishName: "Compact Round Farmhouse Pedestal Table",
    category: "طاولات",
    tagline: "طاولة دائرية لـ 2 إلى 4 مقاعد بلمسة ريفية دافئة وزوايا ناعمة.",
    description: "تصميم مدمج يناسب شقق المدن، وزوايا الإفطار المشرقة، ومساحات تناول الشاي. قاعدة خشبية منحوتة تعكس دفء الضيافة الحقيقية.",
    dimensions: "القطر 80 سم × الارتفاع 75 سم",
    materialsDescription: "خشب طبيعي مصمت، عمود مركزي مخروط بعناية، حماية شمعية ضد السوائل.",
    modelUrl: "/models/2-4-seat-compact-round-farmhouse-pedestal-dining-table.glb",
    thumbnail: "/images/farmhouse-table.webp",
    featured: false,
    cameraDefaults: {
      position: [1.9, 1.4, 2.0],
      target: [0, 0.38, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "table" },
      { id: "honey-pine", name: "خشب صنوبر عسلي", color: "#D2AB74", target: "table" },
      { id: "dark-roast", name: "بني محمص داكن", color: "#4E3626", target: "table" },
      { id: "white-wash", name: "أبيض طباشيري اسكندنافي", color: "#DDD8D0", target: "table" }
    ],
    materialMapping: {
      table: ["Material_0.003", "Mesh_0.001", "material", "mesh"]
    }
  },
  {
    id: "square-tulip-dining-table",
    name: "طاولة تيوليب المربعة المدمجة",
    englishName: "Compact Square Tulip Architectural Table",
    category: "طاولات",
    tagline: "طاولة 2 إلى 4 مقاعد بحواف منحنية وقاعدة تيوليب انسيابية.",
    description: "توازن مدروس بين الأشكال الهندسية. السطح المربع بحوافه المستديرة يمنح استغلالاً مثالياً للمساحة، مع قاعدة التيوليب الانسيابية الخالية من الأرجل المزدحمة.",
    dimensions: "العرض 80 سم × العمق 80 سم × الارتفاع 76 سم",
    materialsDescription: "سطح مركب غير لامع ناعم الملمس، قاعدة حديدية ثقيلة مطلية حرارياً.",
    modelUrl: "/models/2-4-seat-compact-square-tulip-dining-table.glb",
    thumbnail: "/images/square-tulip-table.webp",
    featured: false,
    cameraDefaults: {
      position: [1.9, 1.4, 2.0],
      target: [0, 0.38, 0],
      fov: 38
    },
    finishes: [
      { id: "original", name: "عرض القطعة بالشكل الأصلي", color: "#FFFFFF", target: "table" },
      { id: "warm-biscuit", name: "بيسكويت دافئ", color: "#D6C7B2", target: "table" },
      { id: "charcoal-matte", name: "فحمي مطفأ", color: "#30302E", target: "table" },
      { id: "bronze-luster", name: "برونزي حريري", color: "#8E7756", target: "table" }
    ],
    materialMapping: {
      table: ["Material_0.001", "Mesh_0", "material", "mesh"]
    }
  }
];

export const faqs = [
  {
    question: "هل يمكنني مشاهدة المنتج بتقنية 3D؟",
    answer: "نعم، المنتجات التي تتوفر لها ملفات ثلاثية الأبعاد مدعومة يمكنك استكشافها وتدويرها 360 درجة، وتقريب أدق التفاصيل من زوايا مختلفة داخل الموقع مباشرة."
  },
  {
    question: "هل يمكنني تغيير لون المنتج؟",
    answer: "يمكنك تجربة الألوان والتشطيبات المتاحة للمنتج، ومشاهدة التغييرات مباشرة على المجسم ثلاثي الأبعاد في الوقت الفعلي قبل اتخاذ قرارك."
  },
  {
    question: "هل الألوان والخامات المعروضة متاحة للشراء؟",
    answer: "تعتمد الخيارات على المواصفات الفعلية لكل منتج. يُرجى التواصل معنا عبر زر الاستفسار لتأكيد التوافر ومطابقة درجات الخامات قبل الطلب."
  },
  {
    question: "كيف يمكنني معرفة السعر؟",
    answer: "يمكنك مراجعة السعر التقديري المعروض، أو التواصل معنا مباشرة عبر زر 'استفسر عن السعر والتفاصيل' للحصول على تسعيرة رسمية دقيقة وفق خياراتك."
  },
  {
    question: "هل يمكنني معرفة أبعاد المنتج بدقة؟",
    answer: "تُعرض الأبعاد التفصيلية (العرض، العمق، الارتفاع) في صفحة كل منتج لتساعدك على تخطيط وتنسيق مساحتك بكل ثقة."
  },
  {
    question: "كيف يمكنني التواصل مع الشركة؟",
    answer: "يمكنك استخدام نموذج الاستفسار المباشر في صفحة التواصل وصفحة كل منتج، أو مراسلتنا على بريد الاستوديو الرسمي studio@asas-living.com."
  }
];
