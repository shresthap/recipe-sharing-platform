export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: string;
  author: string;
  imageUrl: string | null;
}

export const categories = [
  "All",
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Breakfast",
  "Soups",
] as const;

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Margherita Pizza",
    description: "Fresh basil, mozzarella, and tomato sauce on a crisp thin crust.",
    category: "Main Courses",
    prepTime: "45 min",
    author: "Maria L.",
    imageUrl: null,
  },
  {
    id: "2",
    title: "Creamy Tomato Soup",
    description: "A comforting bowl with roasted tomatoes and a touch of cream.",
    category: "Soups",
    prepTime: "30 min",
    author: "James K.",
    imageUrl: null,
  },
  {
    id: "3",
    title: "Avocado Toast with Poached Egg",
    description: "Sourdough topped with smashed avocado, chili flakes, and a runny egg.",
    category: "Breakfast",
    prepTime: "15 min",
    author: "Priya S.",
    imageUrl: null,
  },
  {
    id: "4",
    title: "Chocolate Lava Cake",
    description: "Rich molten chocolate center with a light dusting of powdered sugar.",
    category: "Desserts",
    prepTime: "25 min",
    author: "David R.",
    imageUrl: null,
  },
  {
    id: "5",
    title: "Caprese Skewers",
    description: "Cherry tomatoes, fresh mozzarella, and basil drizzled with balsamic.",
    category: "Appetizers",
    prepTime: "10 min",
    author: "Elena M.",
    imageUrl: null,
  },
  {
    id: "6",
    title: "Herb-Crusted Salmon",
    description: "Oven-baked salmon with lemon, dill, and a golden herb crust.",
    category: "Main Courses",
    prepTime: "35 min",
    author: "Alex T.",
    imageUrl: null,
  },
];
