export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 'baby' | 'toddler' | 'boys' | 'girls' | 'new' | 'sale';
  ageGroup: string;
  sizes: string[];
  colors: string[];
  images: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Rainbow Unicorn Dress',
    price: 29.99,
    originalPrice: 39.99,
    description: 'Magical unicorn dress with rainbow tulle skirt and sparkly details. Perfect for special occasions or everyday magic!',
    category: 'girls',
    ageGroup: '4-8 years',
    sizes: ['4T', '5T', '6', '7', '8'],
    colors: ['Pink', 'Purple'],
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ['dress', 'unicorn', 'party', 'girls']
  },
  {
    id: '2',
    name: 'Dinosaur Adventure T-Shirt',
    price: 18.99,
    description: 'Roar into adventure with this cool dinosaur t-shirt featuring glow-in-the-dark details!',
    category: 'boys',
    ageGroup: '3-10 years',
    sizes: ['3T', '4T', '5T', '6', '7', '8', '10'],
    colors: ['Green', 'Blue', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 89,
    tags: ['t-shirt', 'dinosaur', 'boys', 'glow']
  },
  {
    id: '3',
    name: 'Organic Cotton Onesie Set',
    price: 24.99,
    description: 'Super soft organic cotton onesies in adorable animal prints. Pack of 3 for your little one.',
    category: 'baby',
    ageGroup: '0-2 years',
    sizes: ['Newborn', '3M', '6M', '9M', '12M', '18M', '24M'],
    colors: ['White', 'Cream', 'Mint'],
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 203,
    tags: ['onesie', 'organic', 'baby', 'cotton']
  },
  {
    id: '4',
    name: 'Space Explorer Pajama Set',
    price: 32.99,
    description: 'Blast off to dreamland in these cozy space-themed pajamas with rocket ship and planet prints.',
    category: 'boys',
    ageGroup: '2-8 years',
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8'],
    colors: ['Navy', 'Dark Blue'],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviewCount: 67,
    tags: ['pajamas', 'space', 'boys', 'sleepwear']
  },
  {
    id: '5',
    name: 'Butterfly Garden Tunic',
    price: 26.99,
    originalPrice: 34.99,
    description: 'Flowing tunic with beautiful butterfly embroidery and comfortable leggings included.',
    category: 'girls',
    ageGroup: '3-9 years',
    sizes: ['3T', '4T', '5T', '6', '7', '8', '9'],
    colors: ['Lavender', 'Coral', 'White'],
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: false,
    rating: 4.5,
    reviewCount: 45,
    tags: ['tunic', 'butterfly', 'girls', 'embroidery']
  },
  {
    id: '6',
    name: 'Little Explorer Romper',
    price: 22.99,
    description: 'Perfect for little adventurers! Soft, stretchy romper with snap buttons for easy changes.',
    category: 'toddler',
    ageGroup: '12M-3T',
    sizes: ['12M', '18M', '24M', '2T', '3T'],
    colors: ['Sage Green', 'Terracotta', 'Cream'],
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 112,
    tags: ['romper', 'toddler', 'comfortable', 'easy']
  },
  {
    id: '7',
    name: 'Superhero Cape & Mask Set',
    price: 19.99,
    originalPrice: 29.99,
    description: 'Transform into a superhero with this awesome cape and mask set. Machine washable!',
    category: 'sale',
    ageGroup: '3-10 years',
    sizes: ['One Size'],
    colors: ['Red', 'Blue', 'Purple'],
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: false,
    rating: 4.4,
    reviewCount: 78,
    tags: ['superhero', 'cape', 'costume', 'play']
  },
  {
    id: '8',
    name: 'Cozy Bear Hoodie',
    price: 35.99,
    description: 'Adorable bear-themed hoodie with ears on the hood and a kangaroo pocket. So cozy!',
    category: 'new',
    ageGroup: '2-8 years',
    sizes: ['2T', '3T', '4T', '5T', '6', '7', '8'],
    colors: ['Brown', 'Cream', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop'
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    tags: ['hoodie', 'bear', 'cozy', 'new']
  }
];

export const categories = [
  { id: 'baby', name: 'Baby (0-2)', description: 'Soft and safe clothing for babies' },
  { id: 'toddler', name: 'Toddler (2-4)', description: 'Comfortable clothes for active toddlers' },
  { id: 'boys', name: 'Boys (4-12)', description: 'Fun and durable clothing for boys' },
  { id: 'girls', name: 'Girls (4-12)', description: 'Beautiful and playful clothes for girls' },
  { id: 'new', name: 'New Arrivals', description: 'Latest additions to our collection' },
  { id: 'sale', name: 'Sale', description: 'Great deals on kids clothing' }
];