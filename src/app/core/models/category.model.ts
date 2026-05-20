export enum CategorySortField {
  ID = 'id',
  NAME = 'name'
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

export interface CategoryRequest {
  name: string;
  description: string;
}

// Record como única fuente de verdad para labels
export const CATEGORY_FIELD_LABELS: Record<keyof Category, string> = {
  id: 'ID',
  name: 'Nombre',
  description: 'Descripción',
  productCount: 'Productos'
};
