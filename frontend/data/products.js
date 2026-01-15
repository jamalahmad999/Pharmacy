// Static product data for homepage sections
export const exclusiveDealsProducts = [
  { 
    id: 1, 
    name: "Vitamin C Serum 30ml", 
    price: 89.99, 
    originalPrice: 120.00, 
    discount: 25, 
    brand: "Nature's Bounty", 
    rating: 4.5, 
    reviews: 128,
    stock: 15, 
    images: ["/prod1.jpg"], 
    slug: "vitamin-c-serum",
    description: "Premium Vitamin C Serum formulated with pure L-Ascorbic Acid to brighten skin, reduce fine lines, and boost collagen production. This powerful antioxidant serum helps protect against environmental damage while improving skin texture and tone.",
    category: "Skincare",
    sku: "VCS-30ML-001"
  },
  { 
    id: 2, 
    name: "Omega-3 Fish Oil Capsules", 
    price: 65.00, 
    originalPrice: 85.00, 
    discount: 24, 
    brand: "Nordic Naturals", 
    rating: 4.8, 
    reviews: 256,
    stock: 8, 
    images: ["/prod2.jpg"], 
    slug: "omega-3-fish-oil",
    description: "High-quality Omega-3 fish oil capsules rich in EPA and DHA. Supports heart health, brain function, and reduces inflammation. Molecularly distilled for purity and freshness.",
    category: "Supplements",
    sku: "OMG-FO-002"
  },
  { 
    id: 3, 
    name: "Collagen Powder 300g", 
    price: 120.00, 
    originalPrice: 160.00, 
    discount: 25, 
    brand: "Vital Proteins", 
    rating: 4.7, 
    reviews: 189,
    stock: 12, 
    images: ["/prod3.jpg"], 
    slug: "collagen-powder",
    description: "Grass-fed bovine collagen powder that supports healthy skin, hair, nails, and joints. Easily dissolves in hot or cold liquids. 20g of collagen per serving.",
    category: "Supplements",
    sku: "COL-PWD-003"
  },
  { 
    id: 4, 
    name: "Multivitamin Tablets", 
    price: 45.50, 
    originalPrice: 65.00, 
    discount: 30, 
    brand: "Centrum", 
    rating: 4.6, 
    reviews: 412,
    stock: 20, 
    images: ["/prod3-1.jpg"], 
    slug: "multivitamin-tablets",
    description: "Complete daily multivitamin with essential vitamins and minerals to support overall health and wellness. Formulated with Iron, Vitamin D, and B-Complex vitamins.",
    category: "Vitamins",
    sku: "MLT-VIT-004"
  },
  { 
    id: 5, 
    name: "Probiotic Supplements", 
    price: 78.00, 
    originalPrice: 98.00, 
    discount: 20, 
    brand: "Garden of Life", 
    rating: 4.9, 
    reviews: 324,
    stock: 5, 
    images: ["/prod3-2.jpg"], 
    slug: "probiotic-supplements",
    description: "Advanced probiotic formula with 50 billion CFU and 16 probiotic strains. Supports digestive health, immune function, and gut flora balance.",
    category: "Supplements",
    sku: "PRB-SUP-005"
  },
  { 
    id: 6, 
    name: "Biotin Hair Vitamins", 
    price: 55.00, 
    originalPrice: 75.00, 
    discount: 27, 
    brand: "SugarBear", 
    rating: 4.4, 
    reviews: 198,
    stock: 18, 
    images: ["/prod3-3.jpg"], 
    slug: "biotin-hair-vitamins",
    description: "Delicious gummy vitamins packed with Biotin, Vitamin C, and other essential nutrients to promote healthy hair growth, stronger nails, and glowing skin.",
    category: "Beauty",
    sku: "BIO-HAIR-006"
  },
  { 
    id: 7, 
    name: "Glucosamine Joint Support", 
    price: 95.00, 
    originalPrice: 125.00, 
    discount: 24, 
    brand: "Osteo Bi-Flex", 
    rating: 4.5, 
    reviews: 156,
    stock: 10, 
    images: ["/prod3-4.jpg"], 
    slug: "glucosamine-joint-support",
    description: "Advanced joint support formula with Glucosamine, Chondroitin, and MSM. Helps maintain healthy joints, improve flexibility, and reduce discomfort.",
    category: "Supplements",
    sku: "GLU-JNT-007"
  },
  { 
    id: 8, 
    name: "Magnesium Supplement", 
    price: 42.00, 
    originalPrice: 58.00, 
    discount: 28, 
    brand: "NOW Foods", 
    rating: 4.7, 
    reviews: 287,
    stock: 25, 
    images: ["/prod3-5.jpg"], 
    slug: "magnesium-supplement",
    description: "High-absorption magnesium supplement that supports muscle and nerve function, energy production, and bone health. Easy-to-swallow capsules.",
    category: "Minerals",
    sku: "MAG-SUP-008"
  },
  { 
    id: 9, 
    name: "Vitamin D3 Drops", 
    price: 38.50, 
    originalPrice: 52.00, 
    discount: 26, 
    brand: "Thorne", 
    rating: 4.8, 
    reviews: 234,
    stock: 30, 
    images: ["/prod1.jpg"], 
    slug: "vitamin-d3-drops",
    description: "Liquid Vitamin D3 drops for optimal absorption. Supports immune function, bone health, and mood. Perfect for those who have difficulty swallowing pills.",
    category: "Vitamins",
    sku: "VIT-D3-009"
  },
  { 
    id: 10, 
    name: "Turmeric Curcumin", 
    price: 68.00, 
    originalPrice: 88.00, 
    discount: 23, 
    brand: "Gaia Herbs", 
    rating: 4.6, 
    reviews: 176,
    stock: 14, 
    images: ["/prod2.jpg"], 
    slug: "turmeric-curcumin",
    description: "Organic turmeric curcumin supplement with black pepper extract for enhanced absorption. Powerful anti-inflammatory and antioxidant properties.",
    category: "Herbal",
    sku: "TUR-CUR-010"
  },
];

export const premiumPicks = [
  { 
    id: 23, 
    name: "Premium Health Supplement", 
    price: 159.99, 
    brand: "Premium Brand", 
    rating: 4.9, 
    reviews: 89,
    stock: 10, 
    images: ["https://life-cdn.lifepharmacy.com/EcomApp/products/Ajas/137596-1.png"], 
    slug: "premium-health-supplement",
    description: "Our flagship premium health supplement combines the finest ingredients for comprehensive wellness support. Formulated with advanced bioavailability technology.",
    category: "Premium Supplements",
    sku: "PRM-HLT-023"
  },
  { 
    id: 24, 
    name: "Elite Wellness Formula", 
    price: 189.00, 
    brand: "Elite Health", 
    rating: 4.8, 
    reviews: 67,
    stock: 8, 
    images: ["https://life-cdn.lifepharmacy.com/EcomApp/products/Anwar/139050-1.png"], 
    slug: "elite-wellness-formula",
    description: "Elite wellness formula with clinically-tested ingredients. Supports energy, immunity, and overall vitality. Pharmaceutical-grade quality.",
    category: "Premium Supplements",
    sku: "ELT-WEL-024"
  },
  { 
    id: 25, 
    name: "Sunshine Hair Max", 
    price: 145.00, 
    brand: "Sunshine Nutrition", 
    rating: 4.7, 
    reviews: 123,
    stock: 12, 
    images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/Ajas/Sunshine-Hair-Max-700px.jpg"], 
    slug: "sunshine-hair-max",
    description: "Maximum strength hair growth formula with biotin, collagen, and essential vitamins. Promotes thicker, stronger, and healthier hair.",
    category: "Beauty",
    sku: "SUN-HAIR-025"
  },
];

export const latestArrivals = [
  { 
    id: 11, 
    name: "Hyaluronic Acid Serum", 
    price: 75.00, 
    brand: "The Ordinary", 
    rating: 4.7, 
    reviews: 312,
    stock: 22, 
    images: ["/articles (1).png"], 
    slug: "hyaluronic-acid-serum",
    description: "Pure hyaluronic acid serum that provides intense hydration and plumps skin. Multiple molecular weights penetrate different skin layers for maximum effectiveness.",
    category: "Skincare",
    sku: "HYA-SER-011"
  },
  { 
    id: 12, 
    name: "Retinol Night Cream", 
    price: 95.00, 
    brand: "CeraVe", 
    rating: 4.8, 
    reviews: 245,
    stock: 15, 
    images: ["/articles (2).png"], 
    slug: "retinol-night-cream",
    description: "Advanced retinol night cream that reduces fine lines, improves skin texture, and evens skin tone. Encapsulated retinol for gentle, effective results.",
    category: "Skincare",
    sku: "RET-CRM-012"
  },
  { 
    id: 13, 
    name: "Sunscreen SPF 50+", 
    price: 55.00, 
    brand: "La Roche-Posay", 
    rating: 4.9, 
    reviews: 428,
    stock: 28, 
    images: ["/articles (3).png"], 
    slug: "sunscreen-spf-50",
    description: "Broad-spectrum SPF 50+ sunscreen with UVA/UVB protection. Lightweight, non-greasy formula suitable for sensitive skin. Water-resistant for 80 minutes.",
    category: "Sun Care",
    sku: "SUN-SPF-013"
  },
  { 
    id: 14, 
    name: "Niacinamide Serum", 
    price: 68.00, 
    brand: "Paula's Choice", 
    rating: 4.6, 
    reviews: 189,
    stock: 19, 
    images: ["/articles (4).png"], 
    slug: "niacinamide-serum",
    description: "10% Niacinamide serum that minimizes pores, evens skin tone, and strengthens the skin barrier. Suitable for all skin types including sensitive skin.",
    category: "Skincare",
    sku: "NIA-SER-014"
  },
  { 
    id: 15, 
    name: "Eye Cream", 
    price: 82.00, 
    brand: "Kiehl's", 
    rating: 4.5, 
    reviews: 156,
    stock: 12, 
    images: ["/articles (5).png"], 
    slug: "eye-cream",
    description: "Revitalizing eye cream that reduces dark circles, puffiness, and fine lines. Caffeine and peptides work together for brighter, more youthful eyes.",
    category: "Skincare",
    sku: "EYE-CRM-015"
  },
  { 
    id: 16, 
    name: "Face Moisturizer", 
    price: 72.00, 
    brand: "Neutrogena", 
    rating: 4.7, 
    reviews: 298,
    stock: 24, 
    images: ["/articles (6).png"], 
    slug: "face-moisturizer",
    description: "Daily face moisturizer with SPF 15 and hyaluronic acid. Provides 24-hour hydration while protecting skin from sun damage. Oil-free formula.",
    category: "Skincare",
    sku: "FAC-MST-016"
  },
];

export const trendingProducts = [
  { 
    id: 17, 
    name: "Dymatize Iso 100 5 Lb Chocolate", 
    price: 185.00, 
    brand: "Dymatize", 
    rating: 4.8, 
    reviews: 567,
    stock: 8, 
    images: ["/Dymatize Iso 100 5 Lb Chocolate.jpg"], 
    slug: "dymatize-iso-100-chocolate",
    description: "100% whey protein isolate with 25g of protein per serving. Fast-absorbing, low in lactose, and gluten-free. Perfect for muscle building and recovery.",
    category: "Sports Nutrition",
    sku: "DYM-ISO-017"
  },
  { 
    id: 18, 
    name: "Ketoscience Ketogenic Meal Shake Natural Chocolate 14 Servings 539g", 
    price: 145.00, 
    brand: "KetoScience", 
    rating: 4.9, 
    reviews: 234,
    stock: 35, 
    images: ["/Ketoscience Ketogenic Meal Shake Natural Chocolate 14 Servings 539g (weight loss).jpg"], 
    slug: "ketoscience-meal-shake",
    description: "Complete ketogenic meal replacement shake with 70% fat, 20% protein, and 10% carbs. Supports ketosis and weight management goals.",
    category: "Weight Loss",
    sku: "KTO-SHK-018"
  },
  { 
    id: 19, 
    name: "Radiant Platinum B-Complex 100 90 Tabs", 
    price: 95.00, 
    brand: "Radiant", 
    rating: 4.7, 
    reviews: 178,
    stock: 18, 
    images: ["/Radiant Platinum B- Complex 100 90 Tabs (Nutrition & Supplement).jpg"], 
    slug: "radiant-b-complex",
    description: "High-potency B-Complex vitamins for energy metabolism, nervous system support, and stress management. Contains all 8 essential B vitamins.",
    category: "Vitamins",
    sku: "RAD-BCX-019"
  },
  { 
    id: 20, 
    name: "Braun Oral B Precision Flexisoft Replacement Brush Heads 2+1", 
    price: 125.00, 
    brand: "Braun", 
    rating: 4.6, 
    reviews: 445,
    stock: 50, 
    images: ["/Braun Oral B Precision Flexisoft Replacement Brush Heads 2+1.jpg"], 
    slug: "braun-oral-b-brush-heads",
    description: "Precision clean brush heads with flexible bristles that adapt to tooth contours. Clinically proven to remove up to 100% more plaque.",
    category: "Oral Care",
    sku: "BRN-BRH-020"
  },
  { 
    id: 21, 
    name: "Clear Cool Sport Menthol-Male 400 ml", 
    price: 78.00, 
    brand: "Clear", 
    rating: 4.5, 
    reviews: 289,
    stock: 22, 
    images: ["/Clear Cool Sport Menthol-Male 400 ml.jpg"], 
    slug: "clear-cool-sport-menthol",
    description: "Anti-dandruff shampoo with menthol for an invigorating cooling sensation. Removes dandruff, cleanses scalp, and leaves hair fresh and strong.",
    category: "Hair Care",
    sku: "CLR-SPT-021"
  },
  { 
    id: 22, 
    name: "Puressentiel Purifying Antibacterial Lotion Spray", 
    price: 135.00, 
    brand: "Puressentiel", 
    rating: 4.8, 
    reviews: 167,
    stock: 42, 
    images: ["/Puressentiel Purifying Antibacterial Lotion Spray Hands & Surfaces with 3 Essential Oils (ANTISEPTIC DISINFECTANT).jpg"], 
    slug: "puressentiel-antibacterial-spray",
    description: "Antibacterial spray with 3 essential oils. Eliminates 99.9% of bacteria and viruses. Safe for hands and surfaces. Natural and effective protection.",
    category: "Antiseptic",
    sku: "PUR-ABT-022"
  },
];

export const elderlyCareProducts = [
  { 
    id: 26, 
    name: "Trister Digital Wrist Blood Pressure Monitor", 
    price: 89.00, 
    brand: "Trister", 
    rating: 4.6, 
    reviews: 123,
    stock: 15, 
    images: ["https://life-cdn.lifepharmacy.com/archieved-images/media/catalog/product/t/r/trister-digital-wrist-blood-pressure-monitor.jpg"], 
    slug: "trister-blood-pressure-monitor",
    description: "Accurate digital wrist blood pressure monitor with large LCD display. Stores up to 60 readings with date and time. Irregular heartbeat detection included.",
    category: "Health Devices",
    sku: "TRI-BPM-026"
  },
  { 
    id: 27, 
    name: "Adult Care Essentials", 
    price: 125.00, 
    brand: "Health Care", 
    rating: 4.7, 
    reviews: 89,
    stock: 20, 
    images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/Ajas/108462-6.png"], 
    slug: "adult-care-essentials",
    description: "Complete adult care essentials kit with premium quality products for dignity and comfort. Includes protective underwear and skin care items.",
    category: "Elderly Care",
    sku: "ADT-CRE-027"
  },
  { 
    id: 28, 
    name: "Elderly Support Product", 
    price: 95.00, 
    brand: "Care Plus", 
    rating: 4.5, 
    reviews: 76,
    stock: 18, 
    images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/aNwar%201/126931--1.png"], 
    slug: "elderly-support-product",
    description: "Specialized support products designed for elderly care. Provides comfort, dignity, and ease of use for daily living activities.",
    category: "Elderly Care",
    sku: "ELD-SUP-028"
  },
  { 
    id: 29, 
    name: "BD Micro Fine Plus Pen Needles 4mm", 
    price: 45.00, 
    brand: "BD", 
    rating: 4.8, 
    reviews: 234,
    stock: 30, 
    images: ["https://life-cdn.lifepharmacy.com/archieved-images/media/catalog/product/1/0/108463-bd_micro_fine_plus_pen_needles_4mm_1.jpg"], 
    slug: "bd-pen-needles",
    description: "Ultra-thin 4mm pen needles for comfortable insulin injection. Advanced lubrication and pentapoint comfort technology minimize pain.",
    category: "Diabetes Care",
    sku: "BD-PEN-029"
  },
  { 
    id: 30, 
    name: "Health Monitoring Device", 
    price: 155.00, 
    brand: "MediCare", 
    rating: 4.6, 
    reviews: 98,
    stock: 12, 
    images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/129573-01.jpg"], 
    slug: "health-monitoring-device",
    description: "Advanced health monitoring device for tracking vital signs at home. Easy-to-read display with memory function and alert features.",
    category: "Health Devices",
    sku: "MED-MON-030"
  },
  { 
    id: 31, 
    name: "Senior Care Product", 
    price: 78.00, 
    brand: "Care Expert", 
    rating: 4.7, 
    reviews: 145,
    stock: 22, 
    images: ["https://lifeadmin-app.s3.me-south-1.amazonaws.com/EcomApp/products/aNwar%201/141321-01.png"], 
    slug: "senior-care-product",
    description: "Comprehensive senior care products designed for comfort and independence. High-quality materials ensure durability and reliability.",
    category: "Elderly Care",
    sku: "SEN-CRE-031"
  },
];

// Helper function to get all products
export const getAllStaticProducts = () => {
  return [
    ...exclusiveDealsProducts,
    ...premiumPicks,
    ...latestArrivals,
    ...trendingProducts,
    ...elderlyCareProducts,
  ];
};

// Helper function to find product by slug
export const findProductBySlug = (slug) => {
  const allProducts = getAllStaticProducts();
  return allProducts.find(product => product.slug === slug);
};

// Helper function to get related products (same category, excluding current product)
export const getRelatedProducts = (currentProduct, limit = 6) => {
  const allProducts = getAllStaticProducts();
  return allProducts
    .filter(product => 
      product.category === currentProduct.category && 
      product.id !== currentProduct.id
    )
    .slice(0, limit);
};
