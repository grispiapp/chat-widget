import { type SetStateAction } from "preact/compat";
import { useState } from "preact/hooks";

type ErrorRecord<T> = {
    [K in keyof T]?: string;
};

type UseErrors<T> = {
    errors: ErrorRecord<T>;
    setErrors: SetStateAction<ErrorRecord<T>>;
    setError: (key: keyof T, value: string) => void;
    resetErrors: () => void;
};

export const useErrors = <T>(defaultErrors?: ErrorRecord<T>): UseErrors<T> => {
    const [errors, setErrors] = useState<ErrorRecord<T>>(defaultErrors);

    const setError = (key: keyof typeof defaultErrors, value: string) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [key]: value,
        }));
    };

    const resetErrors = () => {
        setErrors(defaultErrors);
    };

    return {
        errors,
        setErrors,
        setError,
        resetErrors,
    };
};
