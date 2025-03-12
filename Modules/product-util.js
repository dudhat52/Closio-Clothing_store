const products = [
    {
        title: "Sexy Palazzo Jeans",
        description: "Stylish palazzo jeans with a flared fit",
        category: "Jeans",
        price: 109.00,
        salePrice: 54.50,
        shippingWeight: 0.8,
        shippingWidth: 40,
        shippingLength: 90,
        shippingHeight: 5,
        imageUrl: "assets/Images/Palazzo.avif",
        featured: true
    },
    {
        title: "Puffer Coat",
        description: "Warm and stylish puffer coat for winter",
        category: "Outerwear",
        price: 258.00,
        salePrice: 180.60,
        shippingWeight: 1.5,
        shippingWidth: 50,
        shippingLength: 70,
        shippingHeight: 10,
        imageUrl: "assets/Images/puffer.avif",
        featured: true
    },
    {
        title: "Sweater Top",
        description: "Comfortable and cozy sweater top",
        category: "Tops",
        price: 15.00,
        salePrice: 10.60,
        shippingWeight: 0.5,
        shippingWidth: 30,
        shippingLength: 40,
        shippingHeight: 3,
        imageUrl: "assets/Images/back-1.avif",
        featured: true
    },
    {
        title: "Stain Pants",
        description: "Trendy stain-resistant pants",
        category: "Bottoms",
        price: 152.00,
        salePrice: 106.60,
        shippingWeight: 0.7,
        shippingWidth: 35,
        shippingLength: 95,
        shippingHeight: 4,
        imageUrl: "assets/Images/stain-1.avif",
        featured: true
    },
    {
        title: "Skirt",
        description: "Elegant and versatile skirt",
        category: "Bottoms",
        price: 26.00,
        salePrice: 18.60,
        shippingWeight: 0.6,
        shippingWidth: 38,
        shippingLength: 60,
        shippingHeight: 3,
        imageUrl: "assets/Images/skirt.avif",
        featured: true
    },
    {
        title: "Metallic Shoulder Bag",
        description: "Chic metallic shoulder bag",
        category: "Accessories",
        price: 110.00,
        salePrice: null,
        shippingWeight: 0.9,
        shippingWidth: 25,
        shippingLength: 30,
        shippingHeight: 15,
        imageUrl: "assets/Images/purse-e.avif",
        featured: true
    },
    {
        title: "Mini Top Handle Bag",
        description: "Compact and stylish mini bag",
        category: "Accessories",
        price: 215.00,
        salePrice: 150.60,
        shippingWeight: 0.7,
        shippingWidth: 20,
        shippingLength: 25,
        shippingHeight: 12,
        imageUrl: "assets/Images/purse-2.avif",
        featured: true
    },
    {
        title: "Glitter Top Handle Bag",
        description: "Sparkling glitter top handle bag",
        category: "Accessories",
        price: 186.00,
        salePrice: 130.60,
        shippingWeight: 0.8,
        shippingWidth: 22,
        shippingLength: 28,
        shippingHeight: 14,
        imageUrl: "assets/Images/purse-3.avif",
        featured: true
    },
    {
        title: "Top Zip Shoulder Bag",
        description: "Practical and stylish top zip bag",
        category: "Accessories",
        price: 179.00,
        salePrice: 125.60,
        shippingWeight: 0.85,
        shippingWidth: 24,
        shippingLength: 29,
        shippingHeight: 13,
        imageUrl: "assets/Images/purse-4.avif",
        featured: true
    },
    {
        title: "Zalina Small Hobo",
        description: "Elegant small hobo bag",
        category: "Accessories",
        price: 215.00,
        salePrice: 150.60,
        shippingWeight: 0.9,
        shippingWidth: 26,
        shippingLength: 31,
        shippingHeight: 16,
        imageUrl: "assets/Images/purse-5.avif",
        featured: true
    }
];

// Function to get all products
function getAllProducts() {
    return products;
}

// Function to get only featured products
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Function to get products categorized
function getProductsByCategory() {
    const categories = {};
    products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = [];
        }
        categories[product.category].push(product);
    });
    return Object.keys(categories).map(category => ({
        category,
        products: categories[category]
    }));
}

module.exports = {
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory
};