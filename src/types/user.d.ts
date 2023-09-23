export type User = {
    username: string | null;
    is_admin: boolean | null;
}

export type Login = {
    username: string | number | readonly string[] | undefined;
    password: string | number | undefined;
}

export type Users = {
    id: string;
    username: string;
    is_admin: boolean;
    updated_on: Date;
}

export type CreateUser = {
    username: string;
    password: string;
    is_admin: boolean
}

export type UpdateUser = {
    username: string;
    password?: string;
    is_admin: boolean
}