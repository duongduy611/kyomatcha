import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = 'http://localhost:9999';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedBlogCategory, setSelectedBlogCategory] = useState('Tất cả');
	const [user, setUser] = useState(null);
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isLoadingUser, setIsLoadingUser] = useState(true);

	const categoryMapping = {
		matcha: 'Matcha',
		'tea-tools': 'Dụng cụ trà đạo',
		'barista-tools': 'Dụng cụ pha chế',
	};

	const reverseCategoryMapping = {
		Matcha: 'matcha',
		'Dụng cụ trà đạo': 'tea-tools',
		'Dụng cụ pha chế': 'barista-tools',
	};

	const blogCategoryMapping = {
		'discover-matcha': 'Khám phá về Matcha',
		beauty: 'Làm đẹp',
		recipe: 'Pha chế',
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			// Nếu có token, mới gọi fetchUserData
			fetchUserData(token);
		} else {
			// Nếu không có token, tức chưa login → set isLoadingUser = false
			setIsLoadingUser(false);
		}
	}, []);

	const fetchUserData = async (token) => {
		try {
			const response = await axios.get(`${BACKEND_URL}/api/user/profile`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			// Giả sử backend trả { data: { _id, name, email, role, ... } }
			setUser(response.data.data);
			// Sau khi fetch thành công user, có thể fetch Favorites
			fetchFavorites();
		} catch (error) {
			console.error('Error fetching user data:', error);
			if (error.response && error.response.status === 401) {
				// Token hết hạn hoặc không hợp lệ → xóa token
				console.warn('Token hết hạn hoặc không hợp lệ, xóa token.');
				localStorage.removeItem('token');
				setUser(null);
			} else {
				// Lỗi 404/500: chỉ log, không xóa token, user vẫn là null
				console.warn('Lỗi khi fetch user nhưng không phải 401, giữ token.');
			}
		} finally {
			// Dù thành công hay thất bại (trừ 401), vẫn coi là đã load xong user
			setIsLoadingUser(false);
		}
	};

	const fetchFavorites = async () => {
		const token = localStorage.getItem('token');
		if (!token) return;

		try {
			const response = await axios.get(`${BACKEND_URL}/api/favorites`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setFavorites(response.data.data || []);
		} catch (error) {
			console.error('Error fetching favorites:', error);
			// Nếu favorite endpoint chưa có (404/500), chỉ log, không làm gì thêm
		}
	};

	const toggleFavorite = async (productId) => {
		const token = localStorage.getItem('token');
		if (!token) {
			toast.info('Vui lòng đăng nhập để thêm sản phẩm vào yêu thích');
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post(
				`${BACKEND_URL}/api/favorites/toggle`,
				{ productId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				// Cập nhật danh sách yêu thích
				await fetchFavorites();
				toast.success(response.data.data.message);
			}
		} catch (error) {
			console.error('Error toggling favorite:', error);
			toast.error('Có lỗi xảy ra khi thêm/xóa yêu thích');
		} finally {
			setLoading(false);
		}
	};

	const isProductFavorited = (productId) => {
		return favorites.some((fav) => fav.productId._id === productId);
	};

	const login = async (token) => {
		localStorage.setItem('token', token);
		await fetchUserData(token);
		await fetchFavorites();
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
		setFavorites([]);
	};

	const updateCategory = (urlCategory) => {
		setSelectedCategory(urlCategory);
	};

	const updateBlogCategory = (category) => {
		setSelectedBlogCategory(category);
	};

	const getCategoryDisplay = (category) => {
		return categoryMapping[category] || category;
	};

	const value = {
		selectedCategory,
		setSelectedCategory,
		selectedBlogCategory,
		setSelectedBlogCategory,
		updateCategory,
		updateBlogCategory,
		categoryMapping,
		blogCategoryMapping,
		getCategoryDisplay,
		reverseCategoryMapping,
		user,
		setUser,
		login,
		logout,
		favorites,
		toggleFavorite,
		isProductFavorited,
		loading,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
