import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = 'http://localhost:9999';

const FavoriteContext = createContext();

export const useFavorite = () => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorite must be used within a FavoriteProvider');
    }
    return context;
};

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${BACKEND_URL}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.data || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
            return;
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/favorites/toggle`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                if (response.data.data.isFavorite) {
                    toast.success('Đã thêm vào danh sách yêu thích');
                } else {
                    toast.success('Đã xóa khỏi danh sách yêu thích');
                }
                await fetchFavorites();
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Có lỗi xảy ra khi thực hiện thao tác');
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(fav => fav.productId._id === productId);
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <FavoriteContext.Provider value={{
            favorites,
            loading,
            toggleFavorite,
            isFavorite,
            fetchFavorites
        }}>
            {children}
        </FavoriteContext.Provider>
    );
}; 