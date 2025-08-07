const mongoose = require('mongoose')
require('dotenv').config()

// Import models
const Product = require('./models/Product')
const User = require('./models/User')

const sampleProducts = [
  {
    name: "MaRk7Raw Classic Black Tee",
    description: "Premium cotton blend t-shirt with signature MaRk7Raw design. Perfect for everyday wear, this classic black tee features a comfortable fit and durable construction that will last through countless washes.",
    category: "Classic",
    price: 299,
    originalPrice: 399,
    stock: 50,
    sold: 124,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Grey"],
    tags: ["classic", "essential", "cotton", "comfortable"],
    rating: 4.8,
    featured: true,
    isNew: true,
    isBestSeller: true,
    isStorefront: true,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"
    ],
    seo: {
      title: "MaRk7Raw Classic Black T-Shirt | Premium Cotton",
      description: "Shop the MaRk7Raw Classic Black Tee - premium cotton, perfect fit, iconic design. Free shipping on orders over R500.",
      keywords: ["black t-shirt", "cotton tee", "mark7raw", "streetwear", "south africa"]
    }
  },
  {
    name: "MaRk7Raw Signature Logo Tee",
    description: "Bold logo design representing the MaRk7Raw lifestyle. This signature piece features our iconic logo in a striking design that makes a statement wherever you go.",
    category: "Signature",
    price: 349,
    originalPrice: 449,
    stock: 35,
    sold: 89,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    tags: ["signature", "logo", "brand", "statement"],
    rating: 4.9,
    featured: true,
    isNew: false,
    isBestSeller: true,
    isStorefront: true,
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"
    ],
    seo: {
      title: "MaRk7Raw Signature Logo T-Shirt | Iconic Design",
      description: "Express your style with the MaRk7Raw Signature Logo Tee. Bold design, premium quality, authentic streetwear.",
      keywords: ["logo tee", "signature shirt", "mark7raw logo", "streetwear", "brand"]
    }
  },
  {
    name: "MaRk7Raw Limited Edition Gold",
    description: "Exclusive limited edition design with gold accents - only 100 pieces made. This collector's item features premium materials and unique design elements that won't be repeated.",
    category: "Limited",
    price: 499,
    originalPrice: 599,
    stock: 15,
    sold: 67,
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Gold Accent"],
    tags: ["limited", "exclusive", "collector", "premium", "gold"],
    rating: 5.0,
    featured: true,
    isNew: true,
    isBestSeller: false,
    isStorefront: true,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f37f8302?w=400",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400"
    ],
    seo: {
      title: "MaRk7Raw Limited Edition Gold T-Shirt | Exclusive",
      description: "Limited edition MaRk7Raw tee with gold accents. Only 100 pieces available. Premium collector's item.",
      keywords: ["limited edition", "gold shirt", "exclusive", "collector", "premium"]
    }
  },
  {
    name: "MaRk7Raw Classic White Essentials",
    description: "Clean, minimalist white tee that's perfect for any occasion. Made from our premium cotton blend for ultimate comfort and style.",
    category: "Classic",
    price: 279,
    originalPrice: 349,
    stock: 45,
    sold: 156,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Off-White", "Cream"],
    tags: ["white", "essential", "minimalist", "clean", "versatile"],
    rating: 4.7,
    featured: false,
    isNew: false,
    isBestSeller: true,
    isStorefront: true,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"
    ],
    seo: {
      title: "MaRk7Raw White Essential T-Shirt | Clean Design",
      description: "Classic white tee from MaRk7Raw. Essential wardrobe piece, premium cotton, perfect fit.",
      keywords: ["white t-shirt", "essential", "classic", "cotton", "wardrobe staple"]
    }
  },
  {
    name: "MaRk7Raw Vintage Logo Hoodie",
    description: "Vintage-inspired hoodie with retro MaRk7Raw logo. Perfect for cooler days, featuring a comfortable hood and kangaroo pocket.",
    category: "Signature",
    price: 599,
    originalPrice: 749,
    stock: 25,
    sold: 43,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Grey", "Navy"],
    tags: ["hoodie", "vintage", "retro", "warm", "comfortable"],
    rating: 4.6,
    featured: false,
    isNew: true,
    isBestSeller: false,
    isStorefront: true,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    seo: {
      title: "MaRk7Raw Vintage Logo Hoodie | Retro Streetwear",
      description: "Vintage-inspired MaRk7Raw hoodie with retro logo. Comfortable, stylish, perfect for casual wear.",
      keywords: ["hoodie", "vintage", "retro", "streetwear", "comfortable"]
    }
  },
  {
    name: "MaRk7Raw Baseball Cap",
    description: "Classic baseball cap with embroidered MaRk7Raw logo. Adjustable strap for perfect fit, made from durable cotton twill.",
    category: "Accessories",
    price: 199,
    originalPrice: 249,
    stock: 60,
    sold: 78,
    sizes: ["One Size"],
    colors: ["Black", "Navy", "White"],
    tags: ["cap", "hat", "accessory", "logo", "adjustable"],
    rating: 4.5,
    featured: false,
    isNew: false,
    isBestSeller: false,
    isStorefront: true,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400"
    ],
    seo: {
      title: "MaRk7Raw Baseball Cap | Embroidered Logo",
      description: "Classic MaRk7Raw baseball cap with embroidered logo. Adjustable fit, durable cotton construction.",
      keywords: ["baseball cap", "hat", "accessory", "logo", "cotton"]
    }
  }
]

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Find owner user (you should have one from your previous setup)
    const owner = await User.findOne({ role: 'owner' })
    
    if (!owner) {
      console.error('No owner user found. Please create an owner user first.')
      process.exit(1)
    }

    console.log('Found owner:', owner.username)

    // Clear existing products
    await Product.deleteMany({ isStorefront: true })
    console.log('Cleared existing storefront products')

    // Add owner ID to all products
    const productsWithOwner = sampleProducts.map(product => ({
      ...product,
      owner: owner._id
    }))

    // Insert sample products
    const insertedProducts = await Product.insertMany(productsWithOwner)
    console.log(`Inserted ${insertedProducts.length} products`)

    console.log('Sample products created successfully!')
    
    // Display summary
    for (const product of insertedProducts) {
      console.log(`- ${product.name} (${product.category}) - R${product.price}`)
    }

    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

// Run the seeder
seedProducts()
