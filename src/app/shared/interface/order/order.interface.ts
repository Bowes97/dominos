import { IProductResponse } from "../product/product.interface";

export interface IOrderRequest{
    basket: Array<IProductResponse>;
    price: number;
    name: string;
    phoneNumber: string;
    address: string;
    status: string;
    payment: string;
    email: string;
    comment: string;
}

export interface IOrderResponse{
    basket: Array<IProductResponse>;
    price: number;
    name: string;
    phoneNumber: string;
    address: string;
    status: string;
    payment: string;
    id: number;
    email: string;
    comment: string;

}