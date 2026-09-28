export interface MenuItemIngredient {
  ingredientId: number;
  quantity: number;
  unitId: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  menuCategoryId: number;
  itemType: string;
  price: number;
  cost: number;
  image: string;
  status: boolean;
  ingredients: MenuItemIngredient[];
}

export interface MenuItemCategory{
    id: number;
    name: string;
    description: string;
    status: boolean;
}