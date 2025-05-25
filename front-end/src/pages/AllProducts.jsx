import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { FaStar } from 'react-icons/fa';
import bannerImage from '../assets/images/banner_product.jpg';

const BACKEND_URL = 'http://localhost:9999'; // Add backend URL

const Banner = styled.div`
    width: 100%;
    height: 400px;
    background-image: url(${bannerImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    margin-top: 160px;
    display: flex;
    justify-content: center;
    align-items: center;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
    }
`;

const BannerText = styled.h1`
    color: white;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    position: relative;
    z-index: 1;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
`;

const Header = styled.div`
    margin-bottom: 4rem;
    padding: 2rem;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }
`;

const SearchBar = styled.div`
    flex: 1;
    max-width: 400px;
    position: relative;

    input {
        width: 100%;
        padding: 12px 20px;
        border: 1px solid #e0e0e0;
        border-radius: 30px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        background-color: #f8f8f8;
        
        &:focus {
            outline: none;
            border-color: #2ecc40;
            background-color: white;
            box-shadow: 0 2px 8px rgba(46, 204, 64, 0.1);
        }

        &::placeholder {
            color: #999;
        }
    }
`;

const FilterSection = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    select {
        padding: 10px 35px 10px 15px;
        border: 1px solid #e0e0e0;
        border-radius: 30px;
        font-size: 0.9rem;
        cursor: pointer;
        background-color: #f8f8f8;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 15px center;
        background-size: 15px;
        min-width: 180px;
        transition: all 0.3s ease;
        
        &:focus {
            outline: none;
            border-color: #2ecc40;
            background-color: white;
            box-shadow: 0 2px 8px rgba(46, 204, 64, 0.1);
        }

        &:hover {
            background-color: white;
            border-color: #2ecc40;
        }

        option {
            background-color: white;
            color: #333;
            padding: 10px;
        }
    }
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2.5rem;
`;

const ProductCard = styled.div`
    a {
        text-decoration: none;
        color: inherit;
        display: block;
    }
`;

const ProductImage = styled.div`
    position: relative;
    padding-top: 100%;
    overflow: hidden;
    margin-bottom: 1rem;
    background-color: #f8f8f8;
    border-radius: 4px;

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }
`;

const ProductInfo = styled.div`
    text-align: center;

    h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
        text-transform: uppercase;
    }

    p {
        color: #666;
        font-size: 0.9rem;
        &.price {
            color: #2ecc40;
            font-weight: 500;
            margin-top: 0.5rem;
        }
    }
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    margin: 0.5rem 0;
    color: #ffd700;
`;

const ReviewCount = styled.span`
    color: #666;
    font-size: 0.8rem;
    margin-left: 0.5rem;
`;

const Loading = styled.div`
    text-align: center;
    padding: 4rem;
    font-size: 1.2rem;
    color: #666;
`;

const ShopAllButton = styled(Link)`
    display: inline-block;
    padding: 1rem 2rem;
    background-color: #2ecc40;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 2rem;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #27ae60;
    }
`;

const categoryDisplayNames = {
    'Matcha': 'Matcha',
    'tea_tools': 'Dụng cụ trà đạo',
    'barista_tools': 'Dụng cụ pha chế'
};

const AllProducts = () => {
    const { category } = useParams();
    const { selectedCategory, setSelectedCategory, categoryMapping } = useAppContext();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (sortOption) params.append('sort', sortOption);
            if (searchTerm) params.append('search', searchTerm);

            const response = await axios.get(`${BACKEND_URL}/api/products?${params}`);
            setProducts(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setLoading(false);
        }
    }, [selectedCategory, sortOption, searchTerm]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/categories`);
                setCategories(response.data.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        fetchCategories();
        if (category) {
            setSelectedCategory(categoryMapping[category] || '');
        }
    }, [category, categoryMapping, setSelectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const getCategoryTitle = () => {
        if (category) {
            switch (category) {
                case 'matcha':
                    return 'Bột Trà Xanh Matcha';
                case 'tea-tools':
                    return 'Tea Tools';
                case 'barista-tools':
                    return 'Barista Tools';
                default:
                    return 'Tất Cả Sản Phẩm';
            }
        }
        return 'Tất Cả Sản Phẩm';
    };

    return (
        <>
            <Banner>
                <BannerText>sản phẩm của chúng tôi </BannerText>
            </Banner>
            <Container>
                <Header>
                    <FilterSection>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Tất Cả Danh Mục</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {categoryMapping[category] || category}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Sắp xếp theo</option>
                            <option value="name-asc">Tên, A-Z</option>
                            <option value="name-desc">Tên, Z-A</option>
                            <option value="price-asc">Giá, thấp đến cao</option>
                            <option value="price-desc">Giá, cao đến thấp</option>
                        </select>
                    </FilterSection>
                    <SearchBar>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </SearchBar>
                </Header>

                {loading ? (
                    <Loading>Đang tải sản phẩm...</Loading>
                ) : (
                    <ProductGrid>
                        {products.map((product) => (
                            <ProductCard key={product.slug}>
                                <Link to={`/products/${product.slug}`}>
                                    <ProductImage>
                                        <img 
                                            src={`${BACKEND_URL}${product.images[0]}`}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </ProductImage>
                                    <ProductInfo>
                                        <h3>{product.name}</h3>
                                        <p className="price">Chỉ từ {product.price.toLocaleString()}đ</p>
                                    </ProductInfo>
                                </Link>
                            </ProductCard>
                        ))}
                    </ProductGrid>
                )}
            </Container>
        </>
    );
};

export default AllProducts; 