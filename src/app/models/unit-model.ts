export interface UnitCategory{
    id: number,
    name: string,
    description: string,
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  unitCategoryId: number;
  conversionRate: number;
  status: boolean;
}