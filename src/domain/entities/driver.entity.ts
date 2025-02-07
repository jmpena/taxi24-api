export interface Driver {
  id: number;
  name: string;
  license: string;
  available: boolean;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}
