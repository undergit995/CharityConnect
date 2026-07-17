import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../Services/authServices';

const SettingsContext = createContext(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        brandName: 'CharityConnect',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const footerResponse = await api.get('/admin/info/footer');
                if (footerResponse.data.success) {
                    setSettings(prev => ({ ...prev, ...footerResponse.data.data }));
                }
            } catch (error) {
                //console.error("Failed to fetch app settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const value = { settings, loading };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};