export type User = {
    username: string | null;
    is_admin: boolean | null;
    is_user: boolean | null;
}

export type Login = {
    username: string | number | readonly string[] | undefined;
    password: string | number | undefined;
}

export type Users = {
    id: string;
    username: string;
    is_admin: boolean;
    is_user: boolean;
    updated_on: Date;
}

export type CreateUser = {
    username: string;
    password: string;
    is_admin: boolean
    is_user: boolean
}

export type UpdateUser = {
    username: string;
    password?: string;
    is_admin: boolean
    is_user: boolean
}