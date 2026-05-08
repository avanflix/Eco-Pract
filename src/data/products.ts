
export interface ProductVariant {
    id: string;
    price: number;
    originalPrice: number;
    inStock: boolean;
    attributes: {
        quality?: "Standard" | "Premium";
        size?: string; // e.g., "14 inch", "10 inch"
        weight?: string; // e.g., "80gsm", "100gsm", "120gsm"
        pack?: string;
        type?: string;
    };
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: "plates" | "bowls" | "cutlery" | "trays" | "combo-packs";
    badge?: string;
    ecoFriendly: boolean;
    images: string[];
    features: string[];
    specifications: Record<string, string>;
    ecoBenefits: string[];
    variants: ProductVariant[];
    rating: number;
    reviews: number;
}

export const products: Product[] = [
    // 1. Tiffin Plates
    {
        id: "tiffin-plates",
        name: "Tiffin Plates",
        description: "Eco-friendly tiffin plates available in multiple sizes. Perfect for breakfast and light meals.",
        category: "plates",
        ecoFriendly: true,
        rating: 4.8,
        reviews: 124,
        images: [
            "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=600&fit=crop&crop=center",
        ],
        features: [
            "Biodegradable",
            "Microwave safe",
            "Sturdy"
        ],
        specifications: {
            "Material": "Palash and Sal leaves",
            "Shape": "Round",
            "Origin": "India"
        },
        ecoBenefits: [
            "Compostable",
            "Chemical free"
        ],
        variants: [
            {
                id: "tiffin-8-pack-20",
                price: 100, // 5 * 20
                originalPrice: 120,
                inStock: true,
                attributes: { size: "8 inch", pack: "Pack of 20" }
            },
            {
                id: "tiffin-9-pack-20",
                price: 120, // 6 * 20
                originalPrice: 140,
                inStock: true,
                attributes: { size: "9 inch", pack: "Pack of 20" }
            },
            {
                id: "tiffin-10-pack-20",
                price: 140, // 7 * 20
                originalPrice: 160,
                inStock: true,
                attributes: { size: "10 inch", pack: "Pack of 20" }
            }
        ]
    },

    // 2. Buffet Plates
    {
        id: "buffet-plates",
        name: "Buffet Plates",
        description: "Large, durable buffet plates suitable for heavy meals and events.",
        category: "plates",
        badge: "Best Seller",
        ecoFriendly: true,
        rating: 4.9,
        reviews: 210,
        images: [
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&crop=center",
        ],
        features: [
            "Heavy duty",
            "Leak proof",
            "Premium finish"
        ],
        specifications: {
            "Material": "Palash and Sal leaves",
            "Shape": "Round",
            "Origin": "India"
        },
        ecoBenefits: [
            "Zero waste",
            "Natural material"
        ],
        variants: [
            {
                id: "buffet-10-pack-20",
                price: 180, // 9 * 20
                originalPrice: 200,
                inStock: true,
                attributes: { size: "10 inch", pack: "Pack of 20" }
            },
            {
                id: "buffet-11-pack-20",
                price: 200, // 10 * 20
                originalPrice: 220,
                inStock: true,
                attributes: { size: "11 inch", pack: "Pack of 20" }
            },
            {
                id: "buffet-12-pack-20",
                price: 240, // 12 * 20
                originalPrice: 260,
                inStock: true,
                attributes: { size: "12 inch", pack: "Pack of 20" }
            }
        ]
    },

    // 3. Bowls
    {
        id: "areca-bowls",
        name: "Bowls",
        description: "Versatile bowls for soups, desserts, and side dishes.",
        category: "bowls",
        ecoFriendly: true,
        rating: 4.7,
        reviews: 95,
        images: [
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&crop=center",
        ],
        features: [
            "Liquid resistant",
            "Hot & cold safe"
        ],
        specifications: {
            "Material": "Palash and Sal leaves",
            "Shape": "Round",
            "Origin": "India"
        },
        ecoBenefits: [
            "Plastic alternative",
            "Sustainable"
        ],
        variants: [
            {
                id: "bowl-4.5-pack-50",
                price: 100, // 2 * 50
                originalPrice: 110,
                inStock: true,
                attributes: { size: "4.5 inch", pack: "Pack of 50" }
            },
            {
                id: "bowl-4.5-pack-100",
                price: 200, // 2 * 100
                originalPrice: 220,
                inStock: true,
                attributes: { size: "4.5 inch", pack: "Pack of 100" }
            },
            {
                id: "bowl-6-pack-50",
                price: 175, // 3.5 * 50
                originalPrice: 190,
                inStock: true,
                attributes: { size: "6 inch", pack: "Pack of 50" }
            },
            {
                id: "bowl-6-pack-100",
                price: 350, // 3.5 * 100
                originalPrice: 380,
                inStock: true,
                attributes: { size: "6 inch", pack: "Pack of 100" }
            }
        ]
    },

    // 4. Wooden Spoons
    {
        id: "wooden-spoons",
        name: "Wooden Spoons",
        description: "Smooth, splinter-free wooden spoons.",
        category: "cutlery",
        ecoFriendly: true,
        rating: 4.6,
        reviews: 150,
        images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center",
        ],
        features: [
            "Smooth finish",
            "Biodegradable"
        ],
        specifications: {
            "Material": "Birch Wood",
            "Origin": "India"
        },
        ecoBenefits: [
            "Compostable"
        ],
        variants: [
            {
                id: "spoon-pack-20",
                price: 40, // 2 * 20
                originalPrice: 50,
                inStock: true,
                attributes: { type: "Spoon", pack: "Pack of 20" }
            }
        ]
    },

    // 5. Wooden Forks
    {
        id: "forks",
        name: "Forks",
        description: "Sturdy wooden forks for all types of food.",
        category: "cutlery",
        ecoFriendly: true,
        rating: 4.6,
        reviews: 140,
        images: [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center",
        ],
        features: [
            "Sturdy tines",
            "Biodegradable"
        ],
        specifications: {
            "Material": "Birch Wood",
            "Origin": "India"
        },
        ecoBenefits: [
            "Compostable"
        ],
        variants: [
            {
                id: "fork-pack-20",
                price: 60, // 3 * 20
                originalPrice: 70,
                inStock: true,
                attributes: { type: "Fork", pack: "Pack of 20" }
            }
        ]
    },

    // 6. Stitched Leaf Vistaraku
    {
        id: "vistaraku",
        name: "Stitched Leaf Vistaraku",
        description: "Traditional stitched leaf plates.",
        category: "plates",
        badge: "Traditional",
        ecoFriendly: true,
        rating: 4.8,
        reviews: 80,
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center", // Placeholder
        ],
        features: [
            "Traditional",
            "Natural"
        ],
        specifications: {
            "Material": "Leaf",
            "Origin": "India"
        },
        ecoBenefits: [
            "Biodegradable"
        ],
        variants: [
            {
                id: "vistaraku-pack-20",
                price: 200, // 10 * 20
                originalPrice: 220,
                inStock: true,
                attributes: { pack: "Pack of 20" }
            }
        ]
    },

    // 7. Idly Cooking Tray
    {
        id: "idly-tray",
        name: "Idly Cooking Tray",
        description: "Natural steaming tray for Idlys.",
        category: "plates", // User requested to put in plates
        ecoFriendly: true,
        rating: 4.5,
        reviews: 40,
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center", // Placeholder
        ],
        features: [
            "Steam safe",
            "Healthy cooking"
        ],
        specifications: {
            "Material": "Palash and Sal leaves",
            "Usage": "Steaming",
            "Origin": "India"
        },
        ecoBenefits: [
            "No leaching"
        ],
        variants: [
            {
                id: "idly-tray-pack-100",
                price: 100, // 1 * 100
                originalPrice: 120,
                inStock: true,
                attributes: { pack: "Pack of 100" }
            }
        ]
    }
];
