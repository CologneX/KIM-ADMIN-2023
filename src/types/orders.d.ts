export type Orders = {


    id: string
    product_id: string
    product_name: string
    quantity: number
    commission: number
    profit: number
    updated_on: string

}

export type CreateOrder = {
    product_id: string | null
    quantity: number | null
    commission: number | null
}

export type UpdateOrder = {
    id: string | null
    product_id: string | null
    quantity: number | null
    commission: number | null
}