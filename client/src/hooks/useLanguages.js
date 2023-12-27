import { useState, useEffect } from 'react';
import api from "./api";

const useLanguages = () => {
    // State to hold the list of languages
    const [languages, setLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch languages
        const fetchLanguages = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/locales/languages');
                setLanguages(response.data); // Set the languages in state
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchLanguages();
    }, []); // Re-run the effect if apiUrl changes

    return { languages, isLoading, error };
};

export default useLanguages;
