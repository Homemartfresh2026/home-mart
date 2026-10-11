// Starter categories and items the owner can load from the Admin panel.
// Prices are typical Indian MRPs and are meant to be checked and edited by the owner.

export const STARTER_CATEGORIES = [
  { id: 'fruits', name: 'Fruits & Veggies', emoji: '🍎' },
  { id: 'staples', name: 'Rice, Dal & Staples', emoji: '🌾' },
  { id: 'dairy', name: 'Dairy & Bakery', emoji: '🥛' },
  { id: 'snacks', name: 'Snacks & Namkeen', emoji: '🍿' },
  { id: 'chocolates', name: 'Chocolates & Sweets', emoji: '🍫' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤' },
  { id: 'stationery', name: 'Stationery', emoji: '✏️' },
  { id: 'household', name: 'Household & Cleaning', emoji: '🧽' },
  { id: 'baby', name: 'Baby Care', emoji: '👶' },
  { id: 'toiletries', name: 'Toiletries', emoji: '🧼' },
];

type Item = [name: string, unit: string, price: number, mrp: number, emoji: string, tag: string];

const ITEMS: Record<string, Item[]> = {
  dairy: [
    ['Amul Taaza Toned Milk', '500 ml', 27, 28, '🥛', 'Daily Fresh'],
    ['Amul Butter', '100 g', 58, 60, '🧈', 'Bestseller'],
    ['Amul Fresh Paneer', '200 g', 90, 95, '🧀', 'Soft & Fresh'],
    ['Mother Dairy Classic Curd', '400 g', 45, 50, '🥣', 'Thick & Creamy'],
    ['Amul Cheese Slices', '200 g (10 slices)', 140, 150, '🧀', 'Kids Favourite'],
    ['Farm Fresh Eggs', 'Pack of 6', 48, 54, '🥚', 'Protein Rich'],
    ['Britannia Brown Bread', '400 g', 50, 55, '🍞', 'Baked Today'],
    ['Harvest Gold White Bread', '400 g', 40, 45, '🍞', 'Soft Loaf'],
    ['Amul Pure Ghee', '500 ml', 315, 330, '🫙', 'Pure Desi'],
    ['Britannia Rusk', '300 g', 45, 50, '🥖', 'Tea Time'],
  ],
  snacks: [
    ["Lay's Classic Salted Chips", '52 g', 20, 20, '🥔', 'Crunchy'],
    ['Kurkure Masala Munch', '90 g', 20, 20, '🌶️', 'Spicy'],
    ["Haldiram's Aloo Bhujia", '200 g', 55, 60, '🥨', 'Classic Namkeen'],
    ["Haldiram's Moong Dal", '200 g', 55, 60, '🫘', 'Light Snack'],
    ['Bingo Mad Angles', '66 g', 20, 20, '🔺', 'Masti Masala'],
    ['Parle-G Biscuits', '250 g', 25, 25, '🍪', 'Evergreen'],
    ['Britannia Good Day Cashew', '200 g', 40, 45, '🍪', 'Rich Cashew'],
    ['Oreo Chocolate Cream Biscuits', '120 g', 35, 40, '🍪', 'Creamy'],
    ['Maggi 2-Minute Noodles', 'Pack of 4 (280 g)', 56, 60, '🍜', 'Quick Meal'],
    ['Act II Butter Popcorn', '70 g', 25, 30, '🍿', 'Movie Night'],
  ],
  chocolates: [
    ['Cadbury Dairy Milk', '50 g', 50, 50, '🍫', 'Bestseller'],
    ['Cadbury Dairy Milk Silk', '60 g', 80, 85, '🍫', 'Smooth & Rich'],
    ['Cadbury 5 Star', '40 g', 20, 20, '⭐', 'Chewy Caramel'],
    ['Nestlé KitKat', '38.5 g', 25, 25, '🍫', 'Have a Break'],
    ['Cadbury Perk', '27 g', 10, 10, '🍫', 'Light Wafer'],
    ['Cadbury Gems', '17.8 g', 10, 10, '🌈', 'Kids Favourite'],
    ['Ferrero Rocher', '4 pieces (50 g)', 190, 200, '🌰', 'Gift Pack'],
    ['Amul Dark Chocolate', '150 g', 115, 125, '🍫', '55% Cocoa'],
    ['Haldiram\'s Soan Papdi', '250 g', 70, 80, '🍬', 'Festive Sweet'],
    ['Cadbury Celebrations Gift Pack', '118 g', 140, 150, '🎁', 'Gifting'],
  ],
  beverages: [
    ['Coca-Cola Soft Drink', '750 ml', 40, 40, '🥤', 'Chilled'],
    ['Thums Up Soft Drink', '750 ml', 40, 40, '🥤', 'Strong Fizz'],
    ['Sprite Lemon-Lime', '750 ml', 40, 40, '🥤', 'Refreshing'],
    ['Frooti Mango Drink', '600 ml', 35, 38, '🥭', 'Mango Delight'],
    ['Real Mixed Fruit Juice', '1 L', 110, 125, '🧃', 'No Added Colour'],
    ['Tata Tea Premium', '500 g', 270, 290, '🍵', 'Strong Chai'],
    ['Red Label Tea', '250 g', 140, 150, '🍵', 'Natural Care'],
    ['Nescafé Classic Coffee', '50 g', 175, 185, '☕', 'Instant'],
    ['Bournvita Health Drink', '500 g', 240, 255, '🥛', 'Kids Nutrition'],
    ['Bisleri Mineral Water', '1 L', 20, 20, '💧', 'Pure & Safe'],
  ],
  stationery: [
    ['Classmate Single Line Notebook', '172 pages', 55, 60, '📓', 'School Essential'],
    ['Classmate Long Notebook', '240 pages', 75, 80, '📒', 'Long Book'],
    ['Reynolds 045 Ball Pen (Blue)', 'Pack of 5', 45, 50, '🖊️', 'Smooth Writing'],
    ['Cello Gripper Ball Pen', 'Pack of 5', 45, 50, '🖊️', 'Soft Grip'],
    ['Natraj HB Pencils', 'Pack of 10', 50, 55, '✏️', 'Bestseller'],
    ['Apsara Non-Dust Eraser', 'Pack of 5', 20, 25, '🧽', 'Clean Erase'],
    ['Natraj Sharpener', 'Pack of 5', 25, 30, '✂️', 'Sharp Blade'],
    ['Fevistick Glue Stick', '15 g', 40, 45, '🧴', 'Quick Stick'],
    ['Camlin Wax Crayons', '24 shades', 60, 65, '🖍️', 'Kids Art'],
    ['Faber-Castell Geometry Box', '1 set', 120, 130, '📐', 'Exam Ready'],
    ['A4 Copier Paper', '100 sheets', 90, 100, '📄', 'Print Ready'],
    ['Scotch Clear Tape', '1 roll', 30, 35, '🎞️', 'Strong Hold'],
  ],
  household: [
    ['Surf Excel Easy Wash Detergent', '1 kg', 135, 145, '🧺', 'Tough Stains'],
    ['Vim Dishwash Bar', '300 g (pack of 3)', 60, 65, '🍽️', 'Grease Cutter'],
    ['Vim Dishwash Liquid Gel', '500 ml', 110, 115, '🧴', 'Lemon Fresh'],
    ['Harpic Toilet Cleaner', '500 ml', 95, 100, '🚽', 'Kills 99.9% Germs'],
    ['Lizol Floor Cleaner', '500 ml', 110, 119, '🧹', 'Citrus'],
    ['Colin Glass Cleaner', '500 ml', 105, 110, '🪟', 'Streak Free'],
    ['Good Knight Gold Flash Refill', '45 ml', 85, 90, '🦟', 'Mosquito Guard'],
    ['Odonil Room Freshener', '50 g (pack of 3)', 140, 150, '🌸', 'Fresh Fragrance'],
    ['Scotch-Brite Scrub Pad', 'Pack of 3', 50, 55, '🧽', 'Long Lasting'],
    ['Garbage Bags (Medium)', '30 bags', 99, 120, '🗑️', 'Leak Proof'],
  ],
};

let nextId = 1001;
export const STARTER_PRODUCTS = Object.entries(ITEMS).flatMap(([cat, items]) =>
  items.map(([name, unit, price, strike, emoji, tag]) => ({
    id: nextId++,
    name,
    cat,
    unit,
    price,
    strike,
    emoji,
    tag,
    inStock: true,
  })),
);
