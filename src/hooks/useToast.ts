import { htmlIdGenerator } from "@elastic/eui";
import { useState } from "react";

export type toast = {
    title: string;
    text?: JSX.Element;
    color?: "danger" | "primary" | "success" | "warning";
    iconType?: string;
    toastLifeTimeMs?: number;
    id: string;
};

export default function useToast() {
    const [toasts, setToasts] = useState<toast[]>([]);

    const getAllToasts = () => {
        return toasts;
    };

    const addToast = (newToast: Omit<toast, "id">) => {
        const toastWithId = { ...newToast, id: htmlIdGenerator()() };
        setToasts([...toasts, toastWithId]);
    };

    const removeToast = (removedToast: string) => {
        setToasts(toasts.filter((t) => t.id !== removedToast));
    };

    return {
        addToast,
        getAllToasts,
        removeToast,
    };
}