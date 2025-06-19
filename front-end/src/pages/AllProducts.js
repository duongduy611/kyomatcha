import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  flex: 0 0 auto;
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
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
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
  background: #f9f6ef;
  border-radius: 24px;
  padding: 32px 0 32px 0;
  min-height: 420px;
  margin-bottom: 2rem;
  margin-right: -100px;
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
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  cursor: grab;

  &.dragging {
    cursor: grabbing;
  }

  /* Tùy chỉnh màu thanh cuộn mặc định cho WebKit (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    height: 8px; /* Chiều cao của thanh cuộn ngang */
  }

  &::-webkit-scrollbar-track {
    background: #e0e0e0; /* Màu nền của track */
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #537329; /* Màu xanh đậm cho thumb */
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #537329; /* Màu xanh đậm hơn khi hover */
  }

  /* Tùy chỉnh màu thanh cuộn mặc định cho Firefox */
  scrollbar-width: thin; /* "auto" hoặc "thin" */
  scrollbar-color: #537329 #e0e0e0; /* thumb color track color (màu xanh đậm, nền xám nhạt) */
`;

const SliderTrack = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
  padding-bottom: 0px;
`;

const ProductSlider = styled.div`
  display: flex;
  gap: 32px;
`;

const SliderContainer = styled.div`
  width: 74%;
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover .slider-arrow {
    opacity: 1;
    visibility: visible;
  }
`;

const SliderArrow = styled.button`
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #537328;
  border-radius: 3px;
  width: 66px;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: absolute;
  top: 40%;
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
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
  }

  &.left {
    left: 0;
  }
  &.right {
    right: 0;
  }
`;

function debounce(func, timeout = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const AllProducts = () => {
  const { category } = useParams();
  const {
    selectedCategory,
    setSelectedCategory,
    categoryMapping,
    getCategoryDisplay,
  } = useAppContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryIndices, setCategoryIndices] = useState({});

  const navigate = useNavigate();

  const sliderRefs = useRef({});

  const isDragging = useRef({});
  const startX = useRef({});
  const scrollLeft = useRef({});

  const CARDS_PER_VIEW = 3;
  const CARD_WIDTH = 250;
  const GAP = 32;
  const SCROLL_STEP = CARD_WIDTH + GAP;

  const handleAddToCart = async (productId, color = "", size = "") => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
<<<<<<< HEAD

      // Nếu chưa đăng nhập, điều hướng về trang login
=======
>>>>>>> d355a2d1c0388bb225784185cd16f40a8435eaf0
      if (!token || !userId) {
        toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
        return;
      }
      const payload = { userId, productId, quantity: 1, color, size };
      const response = await axios.post(`${BACKEND_URL}/cart/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data?._id) {
        toast.success("Đã thêm vào giỏ hàng!");
      } else {
        toast.error("Thêm vào giỏ hàng không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
        );
      }
    }
  };

  const handlePrev = (category) => {
    sliderRefs.current[category]?.scrollTo({
      left: sliderRefs.current[category].scrollLeft - SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const handleNext = (category) => {
    sliderRefs.current[category]?.scrollTo({
      left: sliderRefs.current[category].scrollLeft + SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const handleScroll = useCallback(
    (category) => {
      const slider = sliderRefs.current[category];
      if (slider) {
        const newIndex = Math.round(slider.scrollLeft / SCROLL_STEP);
        setCategoryIndices((prev) => ({ ...prev, [category]: newIndex }));
      }
    },
    [SCROLL_STEP]
  );

  const debouncedScrollHandlers = useMemo(() => {
    const handlers = {};
    categories.forEach((cat) => {
      handlers[cat] = debounce(() => handleScroll(cat), 100);
    });
    return handlers;
  }, [categories, handleScroll]);

  const handleMouseDown = useCallback((e, category) => {
    if (e.button !== 0) return;
    isDragging.current[category] = true;
    startX.current[category] =
      e.pageX - sliderRefs.current[category].offsetLeft;
    scrollLeft.current[category] = sliderRefs.current[category].scrollLeft;
    sliderRefs.current[category].classList.add("dragging");
  }, []);

  const handleMouseMove = useCallback((e, category) => {
    if (!isDragging.current[category]) return;
    e.preventDefault();
    const x = e.pageX - sliderRefs.current[category].offsetLeft;
    const walk = (x - startX.current[category]) * 2;
    sliderRefs.current[category].scrollLeft =
      scrollLeft.current[category] - walk;
  }, []);

  const handleMouseUp = useCallback((category) => {
    if (isDragging.current[category]) {
      isDragging.current[category] = false;
      sliderRefs.current[category]?.classList.remove("dragging");
    }
  }, []);

  useEffect(() => {
    console.log(categoryMapping);
    const handleGlobalMouseUp = (e) => {
      for (const category in isDragging.current) {
        if (isDragging.current[category]) {
          isDragging.current[category] = false;
          if (sliderRefs.current[category]) {
            sliderRefs.current[category].classList.remove("dragging");
          }
        }
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortOption) params.append("sort", sortOption);
      if (searchTerm) params.append("search", searchTerm);
      const response = await axios.get(`${BACKEND_URL}/api/products?${params}`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortOption, searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryOrder = ["Matcha", "tea_tools", "barista_tools"]; // Đúng thứ tự như trong ảnh và dữ liệu API

        const response = await axios.get(`${BACKEND_URL}/api/categories`);
        const rawCategories = response.data.data || [];

        // Lọc các danh mục có trong categoryOrder và giữ nguyên thứ tự
        const orderedCategories = categoryOrder.filter((c) =>
          rawCategories.includes(c)
        );

        // Lọc các danh mục còn lại không có trong categoryOrder
        const extras = rawCategories.filter((c) => !categoryOrder.includes(c));

        // Kết hợp lại: ưu tiên các danh mục trong orderedCategories, sau đó đến các danh mục còn lại
        const finalCategories = [...orderedCategories, ...extras];

        console.log(finalCategories);
        setCategories(finalCategories || []);
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

  const groupedProducts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat] = products.filter((p) => p.category === cat);
      return acc;
    }, {});
  }, [categories, products]);

  useEffect(() => {
    categories.forEach((cat) => {
      const prods = groupedProducts[cat] || [];
      if (prods.length > 0) {
        handleScroll(cat);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedProducts, categories]);

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

              const currentIndex = categoryIndices[cat] || 0;
              const isAtStart = currentIndex <= 0;
              const sliderElement = sliderRefs.current[cat];
              const isAtEnd =
                sliderElement &&
                Math.abs(
                  sliderElement.scrollWidth -
                    sliderElement.scrollLeft -
                    sliderElement.clientWidth
                ) < 1;

              const showScrollControls = prods.length > CARDS_PER_VIEW;

              return (
                <CategoryRow key={cat}>
                  <CategoryInfo>
                    <div>
                      <CategoryTitle>
                        {cat === "tea_tools"
                          ? "Dụng cụ trà đạo"
                          : cat === "barista_tools"
                          ? "Dụng cụ pha chế"
                          : cat}
                      </CategoryTitle>
                    </div>
                  </CategoryInfo>

                  <SliderContainer>
                    <SliderWrapper
                      ref={(el) => (sliderRefs.current[cat] = el)}
                      onScroll={debouncedScrollHandlers[cat]}
                      onMouseDown={(e) => handleMouseDown(e, cat)}
                      onMouseMove={(e) => handleMouseMove(e, cat)}
                      onMouseUp={() => handleMouseUp(cat)}
                      onMouseLeave={() => handleMouseUp(cat)}
                    >
                      <SliderTrack>
                        <ProductSlider>
                          {prods.map((product) => (
                            <ProductCard key={product.slug}>
                              <Link to={`/products/${product.slug}`}>
                                <ProductImage>
                                  <img
                                    src={
                                      product.images?.[0]?.startsWith("http")
                                        ? product.images[0]
                                        : `${BACKEND_URL}${
                                            product.images?.[0] ||
                                            "/placeholder.jpg"
                                          }`
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
                                      <ProductShortDescription>
                                        {product.shortDescription}
                                      </ProductShortDescription>
                                      <ProductPrice>
                                        {product.price.toLocaleString("vi-VN")}{" "}
                                        đ
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
                      </SliderTrack>
                    </SliderWrapper>

                    {/* Các nút điều hướng vẫn được giữ lại */}
                    {showScrollControls && (
                      <>
                        {!isAtStart && (
                          <SliderArrow
                            className="slider-arrow left"
                            onClick={() => handlePrev(cat)}
                          >
                            <FaChevronLeft />
                          </SliderArrow>
                        )}
                        {!isAtEnd && (
                          <SliderArrow
                            className="slider-arrow right"
                            onClick={() => handleNext(cat)}
                          >
                            <FaChevronRight />
                          </SliderArrow>
                        )}
                      </>
                    )}
                  </SliderContainer>
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
