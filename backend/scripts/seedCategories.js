const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  // Beauty Care
  { name: 'Treatments', slug: 'treatments', icon: '💊', description: 'Acne care, feminine care, skin repair and scar treatments', order: 1 },
  { name: 'Dark Circles', slug: 'dark-circles', icon: '👁️', description: 'Eye care and dark circle treatments', order: 2 },
  { name: 'Fine Lines', slug: 'fine-lines', icon: '✨', description: 'Anti-aging and fine line treatments', order: 3 },
  { name: 'Eczema Treatment', slug: 'eczema-treatment', icon: '🩹', description: 'Eczema and sensitive skin treatments', order: 4 },
  { name: 'Hyperpigmentation', slug: 'hyperpigmentation', icon: '🌟', description: 'Skin brightening and pigmentation treatments', order: 5 },
  { name: 'Skin Repair and Scar', slug: 'skin-repair-scar', icon: '🏥', description: 'Scar treatment and skin repair products', order: 6 },
  { name: 'Dry Skin', slug: 'dry-skin', icon: '💧', description: 'Intensive moisturizers for dry skin', order: 7 },
  { name: 'Psoriasis', slug: 'psoriasis', icon: '🧴', description: 'Psoriasis treatment products', order: 8 },
  { name: 'Oily Skin', slug: 'oily-skin', icon: '☀️', description: 'Oil control and cleansers for oily skin', order: 9 },
  
  // Dermocosmetics
  { name: 'Skin Whitening', slug: 'skin-whitening', icon: '✨', description: 'Brightening and whitening skincare', order: 10 },
  { name: 'Facial Wash/Cleansers', slug: 'facial-cleansers', icon: '🧼', description: 'Face cleansers and washing products', order: 11 },
  { name: 'Eye Cream', slug: 'eye-cream', icon: '👁️', description: 'Eye contour and eye care creams', order: 12 },
  { name: 'Make Up Removal', slug: 'makeup-removal', icon: '�', description: 'Makeup removers and micellar waters', order: 13 },
  { name: 'Facial Moisturizer', slug: 'facial-moisturizer', icon: '💧', description: 'Face moisturizing creams and lotions', order: 14 },
  { name: 'Exfoliators and Scrubs', slug: 'exfoliators-scrubs', icon: '🌸', description: 'Facial scrubs and exfoliating products', order: 15 },
  { name: 'Face Toner', slug: 'face-toner', icon: '💦', description: 'Facial toners and balancing products', order: 16 },
  { name: 'Facial Serum', slug: 'facial-serum', icon: '💧', description: 'Concentrated facial serums', order: 17 },
  { name: 'Day & Night Cream', slug: 'day-night-cream', icon: '🌙', description: 'Daily and nightly face creams', order: 18 },
  { name: 'Facial Mask', slug: 'facial-mask', icon: '🎭', description: 'Face masks and treatments', order: 19 },
  { name: 'Nose Strip', slug: 'nose-strip', icon: '👃', description: 'Blackhead and pore strips', order: 20 },
  { name: 'Lip Care', slug: 'lip-care', icon: '💋', description: 'Lip balms and treatments', order: 21 },
  
  // Hair Care
  { name: 'Shampoo', slug: 'shampoo', icon: '🧴', description: 'Hair shampoos and cleansers', order: 22 },
  { name: 'Hair Conditioner', slug: 'hair-conditioner', icon: '💆', description: 'Hair conditioning treatments', order: 23 },
  { name: 'Hair Colouring', slug: 'hair-colouring', icon: '🎨', description: 'Hair color and dye products', order: 24 },
  { name: 'Hair Mask', slug: 'hair-mask', icon: '💆‍♀️', description: 'Deep conditioning hair masks', order: 25 },
  { name: 'Hair Styling', slug: 'hair-styling', icon: '💇', description: 'Hair styling products and tools', order: 26 },
  { name: 'Hair Oils and Spray', slug: 'hair-oils-spray', icon: '✨', description: 'Hair oils and treatment sprays', order: 27 },
  { name: 'Hair Loss and Thinning', slug: 'hair-loss-thinning', icon: '�', description: 'Hair growth and anti-loss products', order: 28 },
  { name: 'Anti Lice', slug: 'anti-lice', icon: '🦠', description: 'Lice treatment and prevention', order: 29 },
  
  // Sun Care
  { name: 'Face Sunscreen', slug: 'face-sunscreen', icon: '☀️', description: 'Facial sun protection products', order: 30 },
  { name: 'Body Sunscreen', slug: 'body-sunscreen', icon: '🏖️', description: 'Body sun protection lotions', order: 31 },
  { name: 'Children Sunscreen', slug: 'children-sunscreen', icon: '👶', description: 'Sun protection for kids', order: 32 },
  { name: 'After Sun', slug: 'after-sun', icon: '🌅', description: 'After sun care and soothing products', order: 33 },
  { name: 'Tanning', slug: 'tanning', icon: '🌞', description: 'Tanning oils and products', order: 34 },
  
  // Beauty Supplements
  { name: 'Biotin', slug: 'biotin', icon: '💊', description: 'Biotin supplements for hair and skin', order: 35 },
  { name: 'Hair Loss Supplements', slug: 'hair-loss-supplements', icon: '💊', description: 'Nutritional supplements for hair growth', order: 36 },
  { name: 'Hair, Skin & Nail Formulas', slug: 'hair-skin-nail-formulas', icon: '💅', description: 'Beauty supplements and vitamins', order: 37 },
  { name: 'Vitamin E Supplements', slug: 'vitamin-e-supplements', icon: '💊', description: 'Vitamin E for skin health', order: 38 },
  { name: 'Glutathione Supplements', slug: 'glutathione-supplements', icon: '💊', description: 'Skin brightening supplements', order: 39 },
  { name: 'CoQ-10', slug: 'coq10', icon: '💊', description: 'Coenzyme Q10 supplements', order: 40 },
  
  // Natural & Organic
  { name: 'Aloe Vera Gels', slug: 'aloe-vera-gels', icon: '🌿', description: 'Natural aloe vera products', order: 41 },
  { name: 'Rosemary', slug: 'rosemary', icon: '🌿', description: 'Rosemary hair and skin care', order: 42 },
  { name: 'Argan Oil Products', slug: 'argan-oil-products', icon: '🌰', description: 'Moroccan argan oil treatments', order: 43 },
  { name: 'Tea Tree', slug: 'tea-tree', icon: '🌿', description: 'Tea tree oil products', order: 44 },
  { name: 'Vitamin E', slug: 'vitamin-e', icon: '✨', description: 'Vitamin E skincare products', order: 45 },
  
  // Makeup
  { name: 'Face Makeup', slug: 'face-makeup', icon: '💄', description: 'Foundation, concealer, and face makeup', order: 46 },
  { name: 'Lips Makeup', slug: 'lips-makeup', icon: '💋', description: 'Lipstick and lip products', order: 47 },
  { name: 'Eyes Makeup', slug: 'eyes-makeup', icon: '👁️', description: 'Mascara, eyeshadow, and eye products', order: 48 },
  { name: 'Nails', slug: 'nails', icon: '💅', description: 'Nail polish and nail care', order: 49 },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifepharmacy');
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    await Category.insertMany(categories);
    console.log(`✅ ${categories.length} categories seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
