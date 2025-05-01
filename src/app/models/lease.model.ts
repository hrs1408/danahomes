export interface LeaseProperty {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    isHot?: boolean;
    type: 'Cho thuê';
}
