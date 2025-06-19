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
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  width: 100%;
  padding: 0 32px;

  @media (min-width: 1600px) {
    max-width: 1600px;
    padding: 0 48px;
  }

  @media (max-width: 1280px) {
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Header = styled.div`
  padding-top: 2rem;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  border-bottom: 6px solid #F8F6EF;

  @media (max-width: 1280px) {
    width: 100%;
    left: 0;
    right: 0;
    margin-left: -20px;
    margin-right: -20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: -16px;
    margin-right: -16px;
    padding-top: 1rem;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 64px;
  gap: 2rem;

  @media (min-width: 1600px) {
    max-width: 1600px;
    padding: 0 80px;
  }

  @media (max-width: 1280px) {
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 16px;
    gap: 1rem;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
  margin-right: 5%;

  @media (max-width: 768px) {
    display: none;
  }

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
      border-color: #476422;
      background-color: white;
      box-shadow: 0 2px 8px rgba(46, 204, 64, 0.1);
    }

    &::placeholder {
      color: #999;
    }
  }
`;

const TabWrapper = styled.div`
  display: flex;
  padding: 0 64px;

  @media (max-width: 768px) {
    padding: 0 16px;
    width: 100%;
    justify-content: space-between;
  }
`;

const Tab = styled.button`
  font-size: 1.125rem;
  font-weight: 500;
  padding: 12px 24px;
  color: ${(props) => (props.active ? "#476422" : "#668d35")};
  background: ${(props) => (props.active ? "#F8F6EF" : "transparent")};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px 8px 0 0;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 16px;
    flex: 1;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
`;

const ProductCard = styled.div`
  background: #f6f6ee;
  flex: 0 0 auto;
  width: 280px;
  flex-shrink: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (min-width: 1600px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    width: 200px;
  }

  @media (max-width: 480px) {
    width: 160px;
  }

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
  height: 360px;

  @media (min-width: 1600px) {
    height: 400px;
  }

  @media (max-width: 768px) {
    height: 260px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }

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
  overflow: hidden;
  white-space: normal;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
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

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
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

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
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
  padding: 32px 0;
  min-height: 420px;
  margin-bottom: 2rem;
  width: 100%;

  @media (min-width: 1600px) {
    padding: 40px 0;
    min-height: 480px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
    padding: 20px 0;
    border-radius: 16px;
  }
`;

const CategoryInfo = styled.div`
  width: 26%;
  padding: 0 30px 0 64px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 1600px) {
    padding: 0 40px 0 80px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 20px 20px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 40px;
  font-weight: 550;
  color: #476422;
  margin: 200px 0 0 0;
  font-family: MJ Royale Couture Serif;

  @media (max-width: 1280px) {
    font-size: 32px;
    margin: 0;
  }

  @media (max-width: 768px) {
    font-size: 28px;
    text-align: center;
  }
`;

const SliderWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  cursor: grab;

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  &.dragging {
    cursor: grabbing;
  }

  /* Tùy chỉnh màu thanh cuộn mặc định cho WebKit (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    height: 8px;
    
    @media (max-width: 768px) {
      height: 4px;
    }
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
  gap: 24px;
  flex-wrap: nowrap;
  padding-bottom: 0px;

  @media (min-width: 1600px) {
    gap: 32px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
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
  padding-right: 32px;

  @media (min-width: 1600px) {
    padding-right: 48px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding-right: 0;
  }

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

const ComboSection = styled.div`
  padding: 2rem 0;
  background: #f9f6ef;
  border-radius: 24px;
  margin-bottom: 2rem;
`;

const ComboGrid = styled.div`
  display: grid;
  /* Giữ nguyên logic responsive của bạn, rất tốt! */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 3rem; /* Tăng gap cho thoáng hơn */
  padding: 0 64px;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    padding: 0 80px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Hiển thị 1 cột trên mobile */
    padding: 0 20px;
    gap: 1.5rem;
  }
`;

// ComboCard bây giờ là khung viền
const ComboCard = styled.div`
  padding: 0.75rem; /* Padding để tạo khoảng cách giữa viền và nội dung */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* BỎ HẾT CÁC THUỘC TÍNH WIDTH CỐ ĐỊNH */
  /* width: 100%; không cần thiết vì grid item sẽ tự dãn ra */
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  a {
    background: #fcfcf9; /* Màu nền kem cho nội dung bên trong */
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .image-wrapper {
    padding: 2rem; /* Padding cho hình ảnh */
    background: white; /* Nền trắng cho khu vực ảnh */
    img {
      width: 100%;
      height: auto;
      object-fit: contain;
    }
  }

  .info-wrapper {
    display: flex;
    justify-content: space-between; /* Đẩy text và nút về 2 phía */
    align-items: center; /* Căn giữa theo chiều dọc */
    padding: 1rem 1.5rem;
    gap: 1rem;
  }
  
  .text-details {
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 0.5rem 0;
    }
    p {
      font-size: 0.875rem;
      color: #666;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }
    span {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }
  }

  .cart-button {
    background: #5a7247; /* Màu xanh của nút */
    border: none;
    border-radius: 4px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0; /* Ngăn nút bị co lại */
    
    /* Thêm icon giỏ hàng (SVG hoặc Font Awesome) vào đây */
    /* ví dụ: color: white; */
  }
`;

const ComboTitle = styled.h2`
  font-size: 2rem;
  color: #476422;
  margin: 0 0 2rem 64px;
  font-family: MJ Royale Couture Serif;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 20px;
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
  const [selectedTab, setSelectedTab] = useState("product");
  const [combos, setCombos] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);

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

  // Fetch combos
  const fetchCombos = useCallback(async () => {
    if (selectedTab === 'combo') {
      setLoadingCombos(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/combo`);
        console.log(response.data.data);
        setCombos(response.data.data || []);
      } catch (error) {
        console.error('Error fetching combos:', error);
        toast.error('Không thể tải combo sản phẩm');
      } finally {
        setLoadingCombos(false);
      }
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchCombos();
  }, [fetchCombos]);

  // Add to cart function for combo
  const handleAddComboToCart = async (comboId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        toast.info("Vui lòng đăng nhập để thêm combo vào giỏ hàng");
        navigate("/login");
        return;
      }
      const payload = { userId, comboId, quantity: 1 };
      const response = await axios.post(`${BACKEND_URL}/cart/add-combo`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 && response.data?._id) {
        toast.success("Đã thêm combo vào giỏ hàng!");
      } else {
        toast.error("Thêm combo vào giỏ hàng không thành công. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error adding combo to cart:", error);
      if (error.response?.status === 401) {
        toast.error("Vui lòng đăng nhập để thêm combo vào giỏ hàng");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng"
        );
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <KingofTea>
        <Banner>
          <BannerText>sản phẩm của chúng tôi</BannerText>
        </Banner>
        <Container>
          <Header>
            <HeaderContent>
              <TabWrapper>
                <Tab
                  active={selectedTab === "product"}
                  onClick={() => setSelectedTab("product")}
                >
                  Sản phẩm riêng lẻ
                </Tab>
                <Tab
                  active={selectedTab === "combo"}
                  onClick={() => setSelectedTab("combo")}
                >
                  Combo sản phẩm
                </Tab>
              </TabWrapper>

              <SearchBar>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBar>
            </HeaderContent>
          </Header>

          {selectedTab === "product" ? (
            loading ? (
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
                                        product.images?.[0]?.startsWith(
                                          "http"
                                        )
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
                                        <ProductName>
                                          {product.name}
                                        </ProductName>
                                        <ProductShortDescription>
                                          {product.shortDescription}
                                        </ProductShortDescription>
                                        <ProductPrice>
                                          {product.price.toLocaleString(
                                            "vi-VN"
                                          )}{" "}
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
            )
          ) : loadingCombos ? (
            <Loading>Đang tải combo sản phẩm...</Loading>
          ) : (
            <ComboSection>
              <ComboTitle>Combo Sản Phẩm</ComboTitle>
              <ComboGrid>
                {combos.map((combo) => (
                  <ComboCard key={combo._id}>
                    <Link to={`/combo-detail/${combo._id}`}>
                      <ProductImage>
                        <img
                          src={
                            combo.images?.[0]?.startsWith("http")
                              ? combo.images[0]
                              : `${BACKEND_URL}${combo.images?.[0] || "/placeholder.jpg"}`
                          }
                          alt={combo.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </ProductImage>
                      <ProductInfo>
                        <ProductBottom>
                          <div style={{ width: "50%" }}>
                            <ProductName>{combo.title}</ProductName>
                            <ProductShortDescription>
                              {combo.suitableFor}
                            </ProductShortDescription>
                            <ProductPrice>
                              {combo.price.toLocaleString("vi-VN")} đ
                            </ProductPrice>
                          </div>
                          <Button
                            className="add-to-cart"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddComboToCart(combo._id);
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
                  </ComboCard>
                ))}
              </ComboGrid>
            </ComboSection>
          )}
        </Container>
      </KingofTea>
    </>
  );
};

export default AllProducts;
