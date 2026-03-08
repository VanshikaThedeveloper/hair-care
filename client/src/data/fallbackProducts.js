import shampooImg from "../images/shampoo.jpeg";
import conditionerImg from "../images/conditioner.jpeg";
import maskImg from "../images/mask.jpeg";
import serumImg from "../images/serum.jpeg";
import oilImg from "../images/oil.jpeg";

export const fallbackProducts = {
    shampoo: [
        {
            _id: "shampoo1",
            name: "Vertex Herbal Shampoo",
            category: "shampoo",
            price: 299,
            weight: "250ml",
            stock: 10,
            ratings: 4.5,
            numReviews: 12,
            shortDescription: "Nourishing herbal shampoo for all hair types.",
            description: "Vertex Herbal Shampoo gently cleanses your scalp while restoring natural shine and strength with botanical extracts.",
            benefits: ["Reduces Hair Fall", "Adds Shine", "Sulfate Free"],
            ingredients: ["Aloe Vera", "Neem", "Tea Tree"],
            images: [
                {
                    url: conditionerImg, // Swapped as per requirement (representing 'other' image)
                    alt: "Vertex Herbal Shampoo",
                },
            ],
        }
    ],
    conditioner: [
        {
            _id: "conditioner1",
            name: "Vertex Silk Conditioner",
            category: "conditioner",
            price: 349,
            weight: "200ml",
            stock: 15,
            ratings: 4.3,
            numReviews: 8,
            shortDescription: "Deeply nourishing conditioner for silky hair.",
            description: "Vertex Silk Conditioner provides intense hydration and detangles hair for a smooth, frizz-free finish.",
            benefits: ["Frizz Control", "Deep Hydration", "Detangles"],
            ingredients: ["Silk Proteins", "Argan Oil", "Shea Butter"],
            images: [
                {
                    url: shampooImg, // Swapped as per requirement
                    alt: "Vertex Silk Conditioner",
                },
            ],
        }
    ],
    mask: [
        {
            _id: "mask1",
            name: "Vertex Repair Hair Mask",
            category: "hair-mask",
            price: 499,
            weight: "200ml",
            stock: 8,
            ratings: 4.8,
            numReviews: 20,
            shortDescription: "Intensive repair treatment for damaged hair.",
            description: "A concentrated formula that penetrates deep into the hair shaft to repair structural damage and restore elasticity.",
            benefits: ["Deep Repair", "Strengthens Hair", "Heat Protection"],
            ingredients: ["Keratin", "Biotin", "Macadamia Oil"],
            images: [
                {
                    url: shampooImg, // Swapped as per requirement
                    alt: "Vertex Repair Hair Mask",
                },
            ],
        }
    ],
    serum: [
        {
            _id: "serum1",
            name: "Vertex Glossy Serum",
            category: "serum",
            price: 399,
            weight: "50ml",
            stock: 25,
            ratings: 4.6,
            numReviews: 46,
            shortDescription: "Weightless serum for instant shine and frizz control.",
            description: "Tame flyaways and add a brilliant shine to your hair with our non-greasy, lightweight serum formula.",
            benefits: ["Instant Shine", "Frizz Control", "UV Protection"],
            ingredients: ["Vitamin E", "Argan Oil", "Silicone"],
            images: [
                {
                    url: shampooImg, // Swapped as per requirement
                    alt: "Vertex Glossy Serum",
                },
            ],
        }
    ],
    oil: [
        {
            _id: "oil1",
            name: "Vertex Pure Hair Oil",
            category: "hair-oil",
            price: 350,
            weight: "100ml",
            stock: 30,
            ratings: 4.7,
            numReviews: 15,
            shortDescription: "Intense nourishment for strong and shiny hair.",
            description: "Vertex Pure Hair Oil is a blend of natural oils that deeply nourish the hair from root to tip.",
            benefits: ["Strong Roots", "Natural Shine", "Reduces Breakage"],
            ingredients: ["Coconut Oil", "Amla", "Brahmi"],
            images: [
                {
                    url: oilImg,
                    alt: "Vertex Pure Hair Oil",
                },
            ],
        }
    ]
};
