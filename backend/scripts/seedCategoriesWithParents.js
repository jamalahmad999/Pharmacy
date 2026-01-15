const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categoriesData = {
  // Main categories with their subcategories
  "Beauty Care": {
    icon: '💄',
    description: 'Beauty treatments and skin care solutions',
    order: 1,
    subcategories: [
      { name: 'Treatments', slug: 'treatments', icon: '💊', description: 'Acne care, feminine care, skin repair and scar treatments', order: 1 },
      { name: 'Dark Circles', slug: 'dark-circles', icon: '👁️', description: 'Eye care and dark circle treatments', order: 2 },
      { name: 'Fine Lines', slug: 'fine-lines', icon: '✨', description: 'Anti-aging and fine line treatments', order: 3 },
      { name: 'Hyperpigmentation', slug: 'hyperpigmentation', icon: '🌟', description: 'Skin brightening and pigmentation treatments', order: 4 },
      { name: 'Skin Repair and Scar', slug: 'skin-repair-scar', icon: '🏥', description: 'Scar treatment and skin repair products', order: 5 },
      { name: 'Dry Skin', slug: 'dry-skin', icon: '💧', description: 'Intensive moisturizers for dry skin', order: 6 },
      { name: 'Oily Skin', slug: 'oily-skin', icon: '☀️', description: 'Oil control and cleansers for oily skin', order: 7 },
      { name: 'Eczema Treatment', slug: 'eczema-treatment', icon: '🩹', description: 'Eczema and sensitive skin treatments', order: 8 },
      { name: 'Psoriasis', slug: 'psoriasis', icon: '🧴', description: 'Psoriasis treatment products', order: 9 },
    ]
  },
  "Dermocosmetics": {
    icon: '✨',
    description: 'Dermatological cosmetics and skincare',
    order: 2,
    subcategories: [
      { name: 'Skin Whitening', slug: 'skin-whitening', icon: '✨', description: 'Brightening and whitening skincare', order: 1 },
      { name: 'Facial Wash/Cleansers', slug: 'facial-cleansers', icon: '🧼', description: 'Face cleansers and washing products', order: 2 },
      { name: 'Eye Cream', slug: 'eye-cream', icon: '👁️', description: 'Eye contour and eye care creams', order: 3 },
      { name: 'Make Up Removal', slug: 'makeup-removal', icon: '🧴', description: 'Makeup removers and micellar waters', order: 4 },
      { name: 'Face Toner', slug: 'face-toner', icon: '💦', description: 'Facial toners and balancing products', order: 5 },
      { name: 'Facial Serum', slug: 'facial-serum', icon: '💧', description: 'Concentrated facial serums', order: 6 },
      { name: 'Day & Night Cream', slug: 'day-night-cream', icon: '🌙', description: 'Daily and nightly face creams', order: 7 },
      { name: 'Facial Moisturizer', slug: 'facial-moisturizer', icon: '💧', description: 'Face moisturizing creams and lotions', order: 8 },
      { name: 'Exfoliators and Scrubs', slug: 'exfoliators-scrubs', icon: '🌸', description: 'Facial scrubs and exfoliating products', order: 9 },
      { name: 'Facial Mask', slug: 'facial-mask', icon: '🎭', description: 'Face masks and treatments', order: 10 },
      { name: 'Nose Strip', slug: 'nose-strip', icon: '👃', description: 'Blackhead and pore strips', order: 11 },
      { name: 'Lip Care', slug: 'lip-care', icon: '💋', description: 'Lip balms and treatments', order: 12 },
    ]
  },
  "Hair Care": {
    icon: '💇',
    description: 'Complete hair care and styling solutions',
    order: 3,
    subcategories: [
      { name: 'Shampoo', slug: 'shampoo', icon: '🧴', description: 'Hair shampoos and cleansers', order: 1 },
      { name: 'Hair Conditioner', slug: 'hair-conditioner', icon: '💆', description: 'Hair conditioning treatments', order: 2 },
      { name: 'Hair Colouring', slug: 'hair-colouring', icon: '🎨', description: 'Hair color and dye products', order: 3 },
      { name: 'Hair Mask', slug: 'hair-mask', icon: '💆‍♀️', description: 'Deep conditioning hair masks', order: 4 },
      { name: 'Hair Styling', slug: 'hair-styling', icon: '💇', description: 'Hair styling products and tools', order: 5 },
      { name: 'Hair Oils and Spray', slug: 'hair-oils-spray', icon: '✨', description: 'Hair oils and treatment sprays', order: 6 },
      { name: 'Hair Loss and Thinning', slug: 'hair-loss-thinning', icon: '🌿', description: 'Hair growth and anti-loss products', order: 7 },
      { name: 'Anti Lice', slug: 'anti-lice', icon: '🦠', description: 'Lice treatment and prevention', order: 8 },
    ]
  },
  "Sun Care": {
    icon: '☀️',
    description: 'Sun protection and after sun care',
    order: 4,
    subcategories: [
      { name: 'Face Sunscreen', slug: 'face-sunscreen', icon: '☀️', description: 'Facial sun protection products', order: 1 },
      { name: 'Body Sunscreen', slug: 'body-sunscreen', icon: '🏖️', description: 'Body sun protection lotions', order: 2 },
      { name: 'Children Sunscreen', slug: 'children-sunscreen', icon: '👶', description: 'Sun protection for kids', order: 3 },
      { name: 'After Sun', slug: 'after-sun', icon: '🌅', description: 'After sun care and soothing products', order: 4 },
      { name: 'Tanning', slug: 'tanning', icon: '🌞', description: 'Tanning oils and products', order: 5 },
    ]
  },
  "Beauty Supplements": {
    icon: '💊',
    description: 'Nutritional supplements for beauty and wellness',
    order: 5,
    subcategories: [
      { name: 'Biotin', slug: 'biotin', icon: '💊', description: 'Biotin supplements for hair and skin', order: 1 },
      { name: 'Hair Loss Supplements', slug: 'hair-loss-supplements', icon: '💊', description: 'Nutritional supplements for hair growth', order: 2 },
      { name: 'Hair, Skin & Nail Formulas', slug: 'hair-skin-nail-formulas', icon: '💅', description: 'Beauty supplements and vitamins', order: 3 },
      { name: 'Vitamin E Supplements', slug: 'vitamin-e-supplements', icon: '💊', description: 'Vitamin E for skin health', order: 4 },
      { name: 'Glutathione Supplements', slug: 'glutathione-supplements', icon: '💊', description: 'Skin brightening supplements', order: 5 },
      { name: 'CoQ-10', slug: 'coq10', icon: '💊', description: 'Coenzyme Q10 supplements', order: 6 },
    ]
  },
  "Natural & Organic": {
    icon: '🌿',
    description: 'Natural and organic beauty products',
    order: 6,
    subcategories: [
      { name: 'Aloe Vera Gels', slug: 'aloe-vera-gels', icon: '🌿', description: 'Natural aloe vera products', order: 1 },
      { name: 'Rosemary', slug: 'rosemary', icon: '🌿', description: 'Rosemary hair and skin care', order: 2 },
      { name: 'Argan Oil Products', slug: 'argan-oil-products', icon: '🌰', description: 'Moroccan argan oil treatments', order: 3 },
      { name: 'Tea Tree', slug: 'tea-tree', icon: '🌿', description: 'Tea tree oil products', order: 4 },
      { name: 'Vitamin E', slug: 'vitamin-e', icon: '✨', description: 'Vitamin E skincare products', order: 5 },
    ]
  },
  "Makeup": {
    icon: '💄',
    description: 'Cosmetics and makeup products',
    order: 7,
    subcategories: [
      { name: 'Face Makeup', slug: 'face-makeup', icon: '💄', description: 'Foundation, concealer, and face makeup', order: 1 },
      { name: 'Lips Makeup', slug: 'lips-makeup', icon: '💋', description: 'Lipstick and lip products', order: 2 },
      { name: 'Eyes Makeup', slug: 'eyes-makeup', icon: '👁️', description: 'Mascara, eyeshadow, and eye products', order: 3 },
      { name: 'Nails', slug: 'nails', icon: '💅', description: 'Nail polish and nail care', order: 4 },
    ]
  },
  "Other Categories": {
    icon: '📦',
    description: 'Additional product categories',
    order: 8,
    subcategories: []
  }
};

async function seedCategoriesWithParents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifepharmacy');
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    let totalCategories = 0;
    let totalSubcategories = 0;

    // Create main categories and their subcategories
    for (const [mainCatName, mainCatData] of Object.entries(categoriesData)) {
      // Create main category
      const mainCategory = await Category.create({
        name: mainCatName,
        slug: mainCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: mainCatData.icon,
        description: mainCatData.description,
        order: mainCatData.order,
        parentCategory: null,
        isActive: true
      });
      
      totalCategories++;
      console.log(`✅ Created main category: ${mainCatName}`);

      // Create subcategories
      if (mainCatData.subcategories && mainCatData.subcategories.length > 0) {
        for (const subcat of mainCatData.subcategories) {
          await Category.create({
            name: subcat.name,
            slug: subcat.slug,
            icon: subcat.icon,
            description: subcat.description,
            order: subcat.order,
            parentCategory: mainCategory._id,
            isActive: true
          });
          totalSubcategories++;
        }
        console.log(`   ↳ Added ${mainCatData.subcategories.length} subcategories`);
      }
    }

    console.log('\n✨ Category seeding completed!');
    console.log(`📊 Total: ${totalCategories} main categories, ${totalSubcategories} subcategories`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategoriesWithParents();
