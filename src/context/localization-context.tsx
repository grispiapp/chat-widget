import { createContext } from "preact";
import { type SetStateAction } from "preact/compat";
import { useState } from "preact/hooks";

interface LocalizationContextType {
    locale: string;
    setLocale: SetStateAction<string>;
}

const LocalizationContext = createContext<LocalizationContextType>({
    locale: null,
    setLocale: () => {},
});

export const LocalizationContextProvider = ({ children }) => {
    const [locale, setLocale] = useState(null);

    return (
        <LocalizationContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export default LocalizationContext;
