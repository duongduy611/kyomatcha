import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import bannerImage from "../assets/images/banner_product.jpg";
import GlobalStyle from "../components/GlobalStyle";
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
  margin-bottom: 4rem;
  padding: 2rem;
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
    background: ${(props) =>
      props.className === "active" ? "#ff4d4f" : "#fff"};
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f6f6ee;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #527328;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #eddfcb;
  color: #231b10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  width: 40%;
  height: 120%;
  &:hover {
    background: #6a6649;
    color: #fff;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
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
  const navigate = useNavigate();

  const handleAddToCart = async (productId, color = "", size = "") => {
    try {
      // Lấy token và id người dùng từ localStorage
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");

      // Nếu chưa đăng nhập, điều hướng về trang login
      if (!token || !userId) {
        toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
        return;
      }

      // Chuẩn bị payload theo đúng spec của backend
      const payload = {
        userId: userId,
        productId: productId,
        quantity: 1, // ở đây mình để mặc định 1; bạn có thể truyền vào tham số nếu muốn
        color: color, // truyền vào từ component hoặc để mặc định
        size: size, // truyền vào từ component hoặc để mặc định
      };

      // Gọi API thêm vào giỏ
      const response = await axios.post(`${BACKEND_URL}/cart/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data && response.data._id) {
        // Backend trả về obj cart mới (có _id) → coi như thành công
        toast.success("Đã thêm vào giỏ hàng!");
      } else {
        console.log("Unexpected response from /cart/add:", response.data);
        toast.error("Thêm vào giỏ hàng không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
      } else if (error.response?.data?.message) {
        // Hiển thị message lỗi do backend trả về (nếu có)
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
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

  const getCategoryTitle = () => {
    if (category) {
      switch (category) {
        case "matcha":
          return "Bột Trà Xanh Matcha";
        case "tea-tools":
          return "Tea Tools";
        case "barista-tools":
          return "Barista Tools";
        default:
          return "Tất Cả Sản Phẩm";
      }
    }
    return "Tất Cả Sản Phẩm";
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
                        src={
                          product.images && product.images.length > 0
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
                      <ProductBottom>
                        <ProductPrice>{product.price.toLocaleString('vi-VN')}₫</ProductPrice>
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
                      </ProductBottom>
                    </ProductInfo>
                  </Link>
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
