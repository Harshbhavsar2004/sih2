import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                console.log(token);
                if (token) {
                    const response = await fetch('http://192.168.43.199:3000/api/get-user-data', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setUser(data);
                        navigation.navigate('(tabs)');
                    } else {
                        navigation.navigate('index');
                    }
                } else {
                    navigation.navigate('index');
                }
            } catch (error) {
                console.error('Error checking token:', error);
                navigation.navigate('index');
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };