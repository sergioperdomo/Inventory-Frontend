export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  productCount: number;
}

export interface SupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export const SUPPLIER_FIELD_LABELS: Record<keyof Supplier, string> = {
  id: 'ID',
  name: 'Empresa',
  contactName: 'Contacto',
  email: 'Email',
  phone: 'Teléfono',
  address: 'Dirección',
  productCount: 'Productos'
};
