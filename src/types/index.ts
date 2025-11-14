import { Buyer } from '../components/Models/Buyer';
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TPayment = 'card' | 'cash'; 

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}



export interface IProduct {
  id: string;      
  title: string;   
  description: string; 
  image: string;    
  category: string; 
  price: number | null; 
}

export interface IBuyer {
  payment: TPayment; 
  email: string;     
  phone: string;     
  address: string;   
}

export interface IOrder {
  items: string[]; 
  payment: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
  total: number;
}

export interface CardSelectPayload {
  id: string;
}

export interface CartRemovePayload {
  index: number;
}

export interface CartRemoveByIdPayload {
  id: string;
}

export interface OrderNextPayload {
  payment: Buyer['payment'];
  address: string;
}

export interface OrderConfirmPayload {
  email: string;
  phone: string;
}