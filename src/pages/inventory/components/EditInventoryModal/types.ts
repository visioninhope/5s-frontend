import { Coordinat } from '../../types';

export interface EditInventoryData {
  name?: string;
  low_stock_level?: number;
  camera?: string;
  id?: number;
  coords?: Coordinat[];
}
