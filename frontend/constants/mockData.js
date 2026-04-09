export const CATEGORIES = [
  { id: '1', name: 'Kitchen' },
  { id: '2', name: 'Dining' },
  { id: '3', name: 'Decor' },
  { id: '4', name: 'Bedding' },
  { id: '5', name: 'Bath' },
  { id: '6', name: 'Outdoor' },
];

export const THEMES = [
  { id: 'v1', name: 'Minimal', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80' },
  { id: 'v2', name: 'Rustic', image: 'https://images.unsplash.com/photo-1558211583-d26f610b1ebb?auto=format&fit=crop&w=400&q=80' },
  { id: 'v3', name: 'Luxury', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80' },
  { id: 'v4', name: 'Pastel', image: 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=400&q=80' },
];

export const PRODUCTS = [
  {
    id: 'p1',
    name: 'Le Creuset Dutch Oven',
    price: 380,
    image: 'https://images.unsplash.com/photo-1584988448375-3e28aaac79b8?auto=format&fit=crop&w=400&q=80',
    section: 'Essentials',
    status: 'available', // available, viewing, purchased
    aiMessage: 'Perfect match for your chosen Rustic aesthetic. A timeless kitchen staple.',
  },
  {
    id: 'p2',
    name: 'Artisan Ceramic Plates',
    price: 120,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80',
    section: 'Nice to Have',
    status: 'viewing',
    aiMessage: 'Pairs well with your dinner set. 2 guests are currently looking at this.',
  },
  {
    id: 'p3',
    name: 'Vitamix Ascent Series',
    price: 550,
    image: 'https://images.unsplash.com/photo-1596485806495-201a357fbbad?auto=format&fit=crop&w=400&q=80',
    section: 'Premium Picks',
    status: 'purchased',
    aiMessage: 'Already gifted! Consider adding a blender cookbook as a complement.',
  },
  {
    id: 'p4',
    name: 'Linen Duvet Cover',
    price: 280,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
    section: 'Essentials',
    status: 'available',
    aiMessage: 'This feels slightly off-theme, but it brings great neutral tones to any bedroom.',
  }
];
