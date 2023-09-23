export type Product = {
    id: string;
    name: string;
    description: string;
    business_name: string;
    phone_number: string;
    updated_on: Date;
    images: string[] | FileList | null;
    price: number;
}
export type CreateProduct = {
    name: string;
    description: string;
    business_id: string;
    price: number;
    images: FileList | null;
}
export type UpdateProduct = {
    id: string;
    name: string;
    description: string;
    business_id: string;
    price: number;
    images: FileList | null;
}
