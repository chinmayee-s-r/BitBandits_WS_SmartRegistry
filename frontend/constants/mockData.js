export const CATEGORIES = [
  { id: '1', name: 'Bathroom', image: require('../assets/Images/Categories/Bathroom.png') },
  { id: '2', name: 'Bedroom', image: require('../assets/Images/Categories/Bedroom.png') },
  { id: '3', name: 'Crockery', image: require('../assets/Images/Categories/Crockery.png') },
  { id: '4', name: 'Decor', image: require('../assets/Images/Categories/Decor.png') },
  { id: '5', name: 'Electronics', image: require('../assets/Images/Categories/Electronics.png') },
  { id: '6', name: 'Furniture', image: require('../assets/Images/Categories/Furniture.png') },
  { id: '7', name: 'Kitchen', image: require('../assets/Images/Categories/Kitchen.png') },
  { id: '8', name: 'Lighting', image: require('../assets/Images/Categories/Lighting.png') },
];

export const EVENT_TYPES = [
  { label: 'Wedding', value: 'wedding' },
  { label: 'Baby Shower', value: 'baby_shower' },
  { label: 'Housewarming', value: 'housewarming' },
  { label: 'Birthday', value: 'birthday' },
  { label: 'Anniversary', value: 'anniversary' },
];

export const THEMES = [
  { id: 'v1', name: 'Aesthetic', image: require('../assets/Images/Themes/Aesthetic.png') },
  { id: 'v2', name: 'Budget', image: require('../assets/Images/Themes/Budget.png') },
  { id: 'v3', name: 'Classic', image: require('../assets/Images/Themes/Classic.png') },
  { id: 'v4', name: 'Cozy', image: require('../assets/Images/Themes/Cozy.png') },
  { id: 'v5', name: 'Luxury', image: require('../assets/Images/Themes/Luxury.png') },
  { id: 'v6', name: 'Minimalist', image: require('../assets/Images/Themes/Minimalist.png') },
  { id: 'v7', name: 'Modern', image: require('../assets/Images/Themes/Modern.png') },
  { id: 'v8', name: 'Premium', image: require('../assets/Images/Themes/Premium.png') },
];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Le Creuset Dutch Oven',
    price: 380,
    image: 'https://images.unsplash.com/photo-1584988448375-3e28aaac79b8?auto=format&fit=crop&w=600&q=80',
    section: 'Essentials',
    status: 'available',
    aiMessage: 'Perfect match for your chosen Rustic aesthetic. A timeless kitchen staple that will last decades.',
    aiTag: 'perfect_match',
    viewers: 0,
  },
  {
    id: 'p2',
    name: 'Artisan Ceramic Plates',
    price: 120,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    section: 'Nice to Have',
    status: 'viewing',
    aiMessage: 'Pairs beautifully with your dinner set. A lovely complement to your table setting.',
    aiTag: 'pairs_well',
    viewers: 2,
  },
  {
    id: 'p3',
    name: 'Vitamix Ascent Series',
    price: 550,
    image: 'https://images.unsplash.com/photo-1596485806495-201a357fbbad?auto=format&fit=crop&w=600&q=80',
    section: 'Premium Picks',
    status: 'purchased',
    aiMessage: 'Already gifted! Consider adding a blender cookbook as a complement.',
    aiTag: 'purchased',
    viewers: 0,
  },
  {
    id: 'p4',
    name: 'Linen Duvet Cover',
    price: 280,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    section: 'Essentials',
    status: 'available',
    aiMessage: 'Slightly off-theme but brings wonderful neutral tones to any bedroom.',
    aiTag: 'off_theme',
    viewers: 0,
  },
  {
    id: 'p5',
    name: 'Copper Cocktail Set',
    price: 195,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    section: 'Nice to Have',
    status: 'available',
    aiMessage: 'Perfect match for an entertaining-focused lifestyle. Elegant and functional.',
    aiTag: 'perfect_match',
    viewers: 0,
  },
  {
    id: 'p6',
    name: 'Marble Serving Board',
    price: 85,
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    section: 'Essentials',
    status: 'viewing',
    aiMessage: 'Pairs well with your ceramic collection. Great for charcuterie nights.',
    aiTag: 'pairs_well',
    viewers: 3,
  },
  {
    id: 'p7',
    name: 'Cashmere Throw',
    price: 420,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    section: 'Premium Picks',
    status: 'available',
    aiMessage: 'A luxury essential. This complements any neutral-toned living room perfectly.',
    aiTag: 'perfect_match',
    viewers: 0,
  },
  {
    id: 'p8',
    name: 'Scented Candle Trio',
    price: 65,
    image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?auto=format&fit=crop&w=600&q=80',
    section: 'Nice to Have',
    status: 'available',
    aiMessage: 'Lovely ambient addition. These scents pair well with your Rustic theme.',
    aiTag: 'pairs_well',
    viewers: 0,
  },
];

export const AI_TAGS = {
  perfect_match: {
    label: 'Perfect Match',
    color: '#34C759',
  },
  pairs_well: {
    label: 'Pairs Well With…',
    color: '#007AFF',
  },
  off_theme: {
    label: 'Slightly Off-Theme',
    color: '#FF9F0A',
  },
  purchased: {
    label: 'Already Gifted',
    color: '#FF3B30',
  },
};

export const LOADING_MESSAGES = [
  'Understanding your style',
  'Curating your registry',
  'Finding perfect matches',
];
