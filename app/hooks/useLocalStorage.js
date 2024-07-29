import { useState, useEffect } from "react";
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState();

    useEffect(() => {
        const value = window.localStorage.getItem(key);

        if (value) {
            try {
                const parsed = JSON.parse(value);
                setStoredValue(parsed);
            } catch (error) {
                console.log(error);
                setStoredValue(initialValue);
            }
        } else {
            setStoredValue(initialValue);
        }
    }, []);

    const setValue = (value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (storedValue) setValue(storedValue);
    }, [storedValue]);

    return [storedValue, setStoredValue];
};

export default useLocalStorage;
