export enum MovementType {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA'
}

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  [MovementType.ENTRADA]: 'Entrada',
  [MovementType.SALIDA]: 'Salida'
};

export interface StockMovement {
  id: number;
  type: MovementType;
  quantity: number;
  createdAt: string;
  notes: string;
  productId: number;
  productName: string;
}

export interface StockMovementRequest {
  type: MovementType;
  quantity: number;
  productId: number;
  notes: string;
}
