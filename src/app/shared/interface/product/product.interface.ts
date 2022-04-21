import { ICategoryResponse } from "../category/category.interface";

export interface IProductRequest {
  category: ICategoryResponse;
  name: string;
  path: string;
  imagePath: string;
  description: string;
  weight: number;
  price: number;
  count: number;
  size?: number;
  bought?: number;
}

export interface IProductResponse {
  id: string;
  category: ICategoryResponse;
  name: string;
  path: string;
  imagePath: string;
  description: string;
  weight: number;
  price: number;
  count: number;
  size?: number;
  bought?: number;
}
