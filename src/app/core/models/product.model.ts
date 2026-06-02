export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string | null;
  price: number;
  stockQuantity: number;
  minStockAlert: number;
  lowStock: boolean;
  categoryId: number | null;
  categoryName: string;
  supplierId: number | null;
  supplierName: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  sku: string | null;
  price: number;
  stockQuantity: number;
  minStockAlert: number;
  categoryId: number | null;
  supplierId: number | null;
}

export const PRODUCT_FIELD_LABELS: Record<keyof Product, string> = {
  id: 'ID',
  name: 'Nombre',
  description: 'Descripción',
  sku: 'SKU',
  price: 'Precio',
  stockQuantity: 'Stock',
  minStockAlert: 'Stock mínimo',
  lowStock: 'Stock bajo',
  categoryId: 'ID Categoría',
  categoryName: 'Categoría',
  supplierId: 'ID Proveedor',
  supplierName: 'Proveedor'
};
