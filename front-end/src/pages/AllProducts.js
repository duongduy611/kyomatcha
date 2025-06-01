import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import bannerImage from '../assets/images/banner_product.jpg';
import GlobalStyle from '../components/GlobalStyle';
import { toast } from 'react-toastify';
const BACKEND_URL = 'http://localhost:9999';

const KingofTea = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
`;

const Banner = styled.div`
    width: 100%;
    height: 400px;
    background-image: url(${bannerImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    margin-top: 80px;
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
    background: white;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    a {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
`;

const ProductImage = styled.div`
    position: relative;
    padding-top: 100%;
    background-color: #f8f8f8;
    overflow: hidden;

    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
`;

const FavoriteButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    svg {
        width: 18px;
        height: 18px;
        color: #666;
    }

    &.active {
        background-color: #ff4d4f;
        svg {
            color: white;
        }
    }

    &:hover {
        transform: scale(1.1);
        background: ${props => props.className === 'active' ? '#ff4d4f' : '#fff'};
    }
`;

const ProductInfo = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const ProductName = styled.h3`
    font-size: 16px;
    font-weight: 500;
        color: #333;
    margin: 0 0 8px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
`;

const ProductPrice = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #2ecc40;
    margin-top: auto;
`;

const ShippingInfo = styled.span`
    font-size: 14px;
    color: #666;
    font-weight: normal;
    margin-left: 4px;
`;

const ButtonGroup = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px;
    padding: 16px;
    padding-top: 0;
`;

const Button = styled.button`
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
        font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    &.buy-now {
        background-color: #2ecc40;
        color: white;
        &:hover {
            background-color: #27ae60;
        }
    }

    &.add-to-cart {
        background-color: white;
        border-color: #2ecc40;
            color: #2ecc40;
        &:hover {
            background-color: #f0fff4;
        }
    }
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
    const { selectedCategory, setSelectedCategory, categoryMapping, toggleFavorite, isProductFavorited } = useAppContext();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${BACKEND_URL}/api/cart/add`, 
                {
                    productId,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Đã thêm vào giỏ hàng!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response?.status === 401) {
                toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                navigate('/login');
            } else {
                toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
            }
        }
    };

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
            <GlobalStyle />
            <KingofTea>

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
                                <ProductCard key={product._id}>
                                    <Link to={`/products/${product.slug}`}>
                                        <ProductImage>
                                            <img
                                                src={product.images && product.images.length > 0
                                                    ? `${BACKEND_URL}${product.images[0]}`
                                                    : "/placeholder.jpg"
                                                }
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/placeholder.jpg";
                                                }}
                                            />
                                        </ProductImage>
                                        <ProductInfo>
                                            <ProductName>{product.name}</ProductName>
                                            <ProductPrice>
                                                {product.price.toLocaleString('vi-VN')}₫
                                                <ShippingInfo>+ Miễn phí vận chuyển</ShippingInfo>
                                            </ProductPrice>
                                        </ProductInfo>
                                    </Link>
                                    <ButtonGroup>
                                        <Button 
                                            className="buy-now"
                                            onClick={() => navigate(`/products/${product.slug}`)}
                                        >
                                            Mua ngay
                                        </Button>
                                        <Button 
                                            className="add-to-cart"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(product._id);
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                                            </svg>
                                        </Button>
                                    </ButtonGroup>
                                    <FavoriteButton 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleFavorite(product._id);
                                        }}
                                        className={isProductFavorited(product._id) ? 'active' : ''}
                                    >
                                        <svg viewBox="0 0 24 24" fill={isProductFavorited(product._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </FavoriteButton>
                                </ProductCard>
                            ))}
                        </ProductGrid>
                    )}
                </Container>
            </KingofTea>
        </>
    );
};

export default AllProducts;