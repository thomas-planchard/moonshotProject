import * as SecureStore from 'expo-secure-store';

//Secure Storage 
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, value);
    } catch (e) {
        console.log(e);
    }
};

export const fetchScurely = async (key) => {
    try {
        const value = await SecureStore.getItemAsync(key);
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        console.log(e);
    }
};

export const deleteSecurely = async (key) => {
    return await SecureStore.deleteItemAsync(key);
};