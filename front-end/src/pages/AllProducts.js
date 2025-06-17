import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import bannerImage from "../assets/images/banner_product.jpg";
import GlobalStyle from "../components/GlobalStyle";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const KingofTea = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f6f6ee;
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
    content: "";
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
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  background-color: rgb(255, 255, 255);

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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #f6f6ee;

  /* === CHANGED === */
  /* Sử dụng width cố định và flex-shrink: 0 để thẻ không bị co lại trong flex container */
  width: 250px;
  flex-shrink: 0;

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
  height: 320px;
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

const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f6f6ee;
  font-family: monsterrat;
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const ProductShortDescription = styled.h3`
  font-size: 0.6rem;
  width: 155%;
  color: #333;
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ProductPrice = styled.div`
  font-size: 0.9rem;
  color: #527328;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #537328;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  width: 60px;
  height: 60px;
  border: 1px solid rgb(82, 115, 40);
  margin-right: -10px;
  &:hover {
    background: white;
    color: rgb(82, 115, 40);
    border: 1px solid rgb(82, 115, 40);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: stretch;
  margin-right: -100px;
  background: #f9f6ef; /* Nền trắng ngà */
  border-radius: 24px;
  padding: 32px 0 32px 0;
  min-height: 420px;
  margin-bottom: 2rem; /* Thêm khoảng cách giữa các category */
`;

const CategoryInfo = styled.div`
  width: 26%;
  padding: 0 30px 0 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CategoryTitle = styled.h2`
  font-size: 40px;
  font-weight: 550;
  color: #404040;
  margin: 200px 0 0 -180px;
  font-family: MJ Royale Couture Serif;
`;

const SliderWrapper = styled.div`
  width: 74%;
  display: flex;
  align-items: center;
  position: relative;

  /* === CHANGED === */
  /* overflow: hidden là bắt buộc để ẩn các card nằm ngoài khung nhìn */
  overflow: hidden;

  &:hover .slider-arrow {
    opacity: 1;
    visibility: visible;
  }
`;

const ProductSlider = styled.div`
  display: flex;
  gap: 32px;
  /* Hiệu ứng chuyển động mượt mà khi transform thay đổi */
  transition: transform 0.5s ease-in-out;
`;

const SliderArrow = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #537328;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;

  &:hover:not(:disabled) {
    background: #537328;
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #f5f5f5;
    color: #999;
  }

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }

  /* === NEW === */
  /* Chỉnh lại vị trí cho nút trái/phải */
  &.left {
    left: 10px;
  }
  &.right {
    right: 10px;
  }
`;

const AllProducts = () => {
  const { category } = useParams();
  const { selectedCategory, setSelectedCategory, categoryMapping } =
    useAppContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryIndices, setCategoryIndices] = useState({});
  const navigate = useNavigate();

  // Số lượng card hiển thị cùng lúc
  const CARDS_PER_VIEW = 3;

  const handleAddToCart = async (productId, color = "", size = "") => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
        return;
      }

      const payload = {
        userId: userId,
        productId: productId,
        quantity: 1,
        color: color,
        size: size,
      };

      const response = await axios.post(`${BACKEND_URL}/cart/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data && response.data._id) {
        toast.success("Đã thêm vào giỏ hàng!");
      } else {
        toast.error("Thêm vào giỏ hàng không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
  };

  // Logic next/prev 1 sản phẩm đã đúng
  const handlePrev = (category) => {
    setCategoryIndices((prev) => ({
      ...prev,
      [category]: Math.max((prev[category] || 0) - 1, 0),
    }));
  };

  const handleNext = (category, productsInCategory) => {
    const currentIdx = categoryIndices[category] || 0;
    const maxIdx = productsInCategory.length - CARDS_PER_VIEW;

    setCategoryIndices((prev) => ({
      ...prev,
      [category]: Math.min(currentIdx + 1, maxIdx),
    }));
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortOption) params.append("sort", sortOption);
      if (searchTerm) params.append("search", searchTerm);

      const response = await axios.get(`${BACKEND_URL}/api/products?${params}`);
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
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
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
    if (category) {
      setSelectedCategory(categoryMapping[category] || "");
    }
  }, [category, categoryMapping, setSelectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const groupedProducts = categories.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat);
    return acc;
  }, {});

  return (
    <>
      <GlobalStyle />
      <KingofTea>
        <Banner>
          <BannerText>sản phẩm của chúng tôi</BannerText>
        </Banner>
        <Container>
          <Header>
            <FilterSection>
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
            categories.map((cat) => {
              const prods = groupedProducts[cat] || [];
              if (prods.length <= 0) return null;

              const start = categoryIndices[cat] || 0;

              // === CHANGED ===
              // Tính toán giá trị transform dựa trên width và gap cố định (bằng pixel)
              // để đảm bảo slider dịch chuyển chính xác.
              const cardWidth = 250; // width của ProductCard
              const gap = 32; // gap của ProductSlider
              const transformValue = -start * (cardWidth + gap);

              return (
                <CategoryRow key={cat}>
                  <CategoryInfo>
                    <div>
                      <CategoryTitle>
                        {cat === "barista_tools"
                          ? "Dụng cụ pha chế"
                          : cat === "tea_tools"
                          ? "Dụng cụ trà đạo"
                          : categoryMapping[cat] || cat}
                      </CategoryTitle>
                    </div>
                  </CategoryInfo>
                  <SliderWrapper>
                    {/* Áp dụng transform đã tính toán */}
                    <ProductSlider
                      style={{ transform: `translateX(${transformValue}px)` }}
                    >
                      {prods.map((product) => (
                        <ProductCard key={product.slug}>
                          <Link to={`/products/${product.slug}`}>
                            <ProductImage>
                              <img
                                src={
                                  product.images && product.images.length > 0
                                    ? product.images[0].startsWith("http")
                                      ? product.images[0]
                                      : `${BACKEND_URL}${product.images[0]}`
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
                              <ProductBottom>
                                <div style={{ width: "50%" }}>
                                  <ProductName>{product.name}</ProductName>
                                  <ProductShortDescription>{product.shortDescription}</ProductShortDescription>
                                  <ProductPrice>
                                    {product.price.toLocaleString("vi-VN")} đ
                                  </ProductPrice>
                                </div>
                                <Button
                                  className="add-to-cart"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product._id);
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                                  </svg>
                                </Button>
                              </ProductBottom>
                            </ProductInfo>
                          </Link>
                        </ProductCard>
                      ))}
                    </ProductSlider>

                    {/* === UPDATED: Sử dụng conditional rendering để ẩn/hiện nút === */}
                    {prods.length > CARDS_PER_VIEW && (
                      <>
                        {/* Nút TRÁI: Chỉ hiển thị khi 'start' lớn hơn 0 */}
                        {start > 0 && (
                          <SliderArrow
                            className="slider-arrow left"
                            onClick={() => handlePrev(cat)}
                          >
                            <FaChevronLeft />
                          </SliderArrow>
                        )}

                        {/* Nút PHẢI: Chỉ hiển thị khi chưa trượt đến cuối danh sách */}
                        {start < prods.length - CARDS_PER_VIEW && (
                          <SliderArrow
                            className="slider-arrow right"
                            onClick={() => handleNext(cat, prods)}
                          >
                            <FaChevronRight />
                          </SliderArrow>
                        )}
                      </>
                    )}
                  </SliderWrapper>
                </CategoryRow>
              );
            })
          )}
        </Container>
      </KingofTea>
    </>
  );
};

export default AllProducts;
