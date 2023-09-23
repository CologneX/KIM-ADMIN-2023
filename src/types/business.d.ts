export type CreateBusiness = {
    name: string;
    address: string;
    phone_number: string;
}

export type Business = {
    id: string;
    name: string;
    address: string;
    phone_number: string;
    updated_on: Date;
}

export type UpdateBusiness = {
    id: string;
    name: string;
    address: string;
    phone_number: string;
}