export type Proposal = {
    id: string,
    user_id: string,
    username: string,
    amount: number,
    interest_rate: number,
    tenor: number,
    age: number,
    gender: string,
    income: number,
    last_education: string,
    marital_status: string,
    number_of_children: number,
    has_house: string,
    kk_url: string,
    ktp_url: string,
    status: string
}

export type CreditScore = {
    predictions: string,
}