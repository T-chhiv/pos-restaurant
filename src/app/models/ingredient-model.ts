export interface Ingredient {
    id: number,
    name: string,
    photo: string,
    description: string,
    status: boolean;
}

export interface Stock {
  id?: number;
  ingredientId: number;
  quantity: number;
  unitId: number;
  averageCostPerUnit: number;
  totalCost: number;
  minStockLevel: number;
  maxStockLevel: number;
  status: boolean;
  lastUpdated: string;
}

export interface StockTransactionModel {
  id?: number;
  ingredientId: number;
  type:
    | 'purchase'
    | 'sale'
    | 'adjustment'
    | 'waste'
    | 'cooked';
  direction: 'in' | 'out';
  quantity: number;
  unitId: number;
  costPerUnit: number;
  totalCost: number;
  reference?: string;
  note?: string;
  date: string;
}