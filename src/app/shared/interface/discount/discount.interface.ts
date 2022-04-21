export interface IDiscountRequest {
    description: string;
    imagePath: string;
    time: number;
    title: string;
    path: string;
}

export interface IDiscountResponse {
    id: number | string;
    description: string;
    imagePath: string;
    time: string | number;
    title: string;
    path: string;
}
