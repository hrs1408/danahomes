export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  imageUrl: string;
  isHot?: boolean;
  type: 'rent' | 'sale'; // Cho thuê hoặc bán
}
