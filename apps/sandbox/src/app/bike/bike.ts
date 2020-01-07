export type BikeType = 'mtb' | 'city' | 'bmx' | 'kids' | 'electric';

export interface Bike {
  id: string;
  name: string;
  color: string;
  pictureUrl: string;
  price: number;
  type: BikeType;
}
