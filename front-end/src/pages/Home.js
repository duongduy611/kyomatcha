import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import axios from "axios";
import { Link } from "react-router-dom";
import { blogs } from "../data/blogs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Marquee from "../components/Marquee";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import bannerBg from "../assets/images/botmatcha.jpg";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CarouselContainer = styled.div`
  margin-top: 100px;
  position: relative;

  .slick-dots {
    position: absolute;
    bottom: 8vh;
    left: 57%;
    transform: translateX(-50%);
    width: auto;

    li button:before {
      font-size: 10px;
      color: #c8bca7;
      opacity: 1;
    }
    li.slick-active button:before {
      color: #7c6a46;
    }
  }

  &:hover .prev-arrow,
  &:hover .next-arrow {
    opacity: 1;
  }
`;

const Slide = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
  height: 89vh;
  background-color: #f6f6ee;

  @media (max-width: 768px) {
    height: 50vh;
    flex-direction: column;
  }
`;

const SlideImage = styled.div`
  width: 50%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
  }
`;

const SlideContent = styled.div`
  width: 50%;
  padding: 0 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 50%;
    padding: 24px;
    text-align: center;
    align-items: center;
  }
`;

const SlidePreTitle = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #888;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const SlideTitle = styled.h1`
  font-family: "Vollkorn", serif;
  font-size: 2.8rem;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #333;

  @media (max-width: 1024px) {
    font-size: 2.4rem;
  }
`;

const SlideDescription = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 500px;
`;

const SlideButton = styled(Link)`
  font-family: "Montserrat", sans-serif;
  background: #eedecc;
  color: #333;
  border: 1px solid #f0f0f0;
  padding: 18px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  align-self: flex-start;
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: #f6f6ee;
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const Arrow = styled.div`
  display: block;
  background: #2c2c2c;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;

  &:hover {
    background: #404040;
  }

  &.prev-arrow {
    left: 20px;
  }
  &.next-arrow {
    right: 20px;
  }

  svg {
    color: white;
    font-size: 20px;
  }
`;

const PrevArrow = ({ onClick }) => (
  <Arrow className="prev-arrow" onClick={onClick}>
    <FaChevronLeft />
  </Arrow>
);
const NextArrow = ({ onClick }) => (
  <Arrow className="next-arrow" onClick={onClick}>
    <FaChevronRight />
  </Arrow>
);

const Section = styled.section`
  border-top: 1px solid #e5e5e5;
  background: #f6f6ee;
  padding: 40px 0 40px 0;
`;

const ProductGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: #f6f6ee;
  border-radius: 8px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
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
  @media (max-width: 768px) {
    height: 280px;
  }
  @media (max-width: 480px) {
    height: 250px;
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
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductShortDescription = styled.p`
  font-size: 0.75rem;
  color: #666;
  margin: 0 0 6px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const SectionContainer = styled.div`
  margin: 0 auto;
  display: flex;
  padding: 0 32px;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }
`;

const Header = styled.div`
  flex: 0 0 28%;

  @media (max-width: 1024px) {
    flex: 0 0 auto;
    text-align: center;
  }
`;

const HeaderHeading = styled.h2`
  font-family: "Vollkorn", serif;
  line-height: 1;
  margin: 0 0 24px 0;
  color: #000;

  span:first-child {
    font-size: 4.2rem;
    font-style: italic;
    display: block;
  }

  span:last-child {
    font-size: 2.8rem;
    font-weight: 600;
    display: block;
    font-family: "Montserrat", sans-serif;
  }

  @media (max-width: 1024px) {
    font-size: 2.6rem;
  }

  @media (max-width: 480px) {
    font-size: 2.2rem;
  }
`;

const HeaderDescription = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #333;
  max-width: 280px;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const TeaCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddToCart = async (productId, color = "", size = "") => {
    try {
      // Lấy token từ localStorage và userId từ context
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Nếu chưa đăng nhập hoặc chưa có userId, điều hướng về trang login
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
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        if (response.data && response.data.data) {
          const filteredProducts = response.data.data
            .filter(
              (product) =>
                product.name.includes("Matcha") &&
                (product.name.includes("Matcha Natsu") ||
                  product.name.includes("Matcha Aki") ||
                  product.name.includes("Matcha Haru"))
            )
            .slice(0, 3);
          console.log("Filtered Matcha Products:", filteredProducts);
          setProducts(filteredProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Section>
      <SectionContainer>
        <Header>
          <HeaderHeading>
            <span>Sản phẩm</span>
            <span>BÁN CHẠY</span>
          </HeaderHeading>
          <HeaderDescription>
            Kyo Matcha tự hào khi các sản phẩm mà chúng tôi mang đến cho bạn là
            những sản phẩm chất lượng, an toàn và đảm bảo sức khỏe cho bạn.
          </HeaderDescription>
        </Header>
        <ProductGrid>
          {products.map((product) => (
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
                    <div style={{ width: "60%" }}>
                      <ProductName>{product.name}</ProductName>
                      {product.shortDescription && (
                        <ProductShortDescription>
                          {product.shortDescription}
                        </ProductShortDescription>
                      )}
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
        </ProductGrid>
      </SectionContainer>
    </Section>
  );
};

const BlogSection = styled.section`
  background: #f6f6ee;
  padding: 60px 0 40px 0;
  border-top: 1px solid #e5e5e5;
`;

const BlogTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #000;
  font-weight: 500;
  margin-bottom: 48px;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 25%);
  justify-content: center;
  gap: 32px;
  padding: 0 32px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 35%);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 40%);
    gap: 20px;
    padding: 0 20px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const BlogCard = styled.div`
  background: #f6f6ee;
  border-radius: 8px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #f6f6ee;
  padding: 10px;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 210px;
  object-fit: cover;
  margin-bottom: 18px;
  cursor: pointer;
  @media (max-width: 768px) {
    height: 180px;
  }
  @media (max-width: 480px) {
    height: 160px;
  }
`;

const BlogCategory = styled.div`
  color: #000;
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const BlogPostTitle = styled.div`
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 12px;
  line-height: 1.4;
  cursor: pointer;

  &:hover {
    color: #4a7c59;
  }
`;

const BlogDesc = styled.div`
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 18px;
  line-height: 1.6;
`;

const BlogReadMore = styled(Link)`
  color: #4a7c59;
  font-size: 0.95rem;
  text-decoration: none;
  text-underline-offset: 3px;
  transition: color 0.2s;
  font-weight: 500;
  position: relative;
  width: 86px;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background: #4a7c59;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 auto;
  }

  &:hover {
    color: #4a7c59;
  }
  &:hover::after {
    width: 100%;
  }
`;

function BlogList() {
  const latestBlogs = blogs
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 3);

  return (
    <BlogSection>
      <BlogTitle>BÀI VIẾT MỚI NHẤT</BlogTitle>
      <BlogGrid>
        {latestBlogs.map((blog, idx) => (
          <BlogCard key={idx}>
            <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: "none" }}>
              <BlogImage src={blog.thumbnailUrl} alt={blog.title} />
              <BlogPostTitle>{blog.title}</BlogPostTitle>
              <BlogCategory>{blog.category}</BlogCategory>
              <BlogDesc>{blog.summary || blog.desc}</BlogDesc>
              <BlogReadMore to={`/blogs/${blog.slug}`}>XEM THÊM</BlogReadMore>
            </Link>
          </BlogCard>
        ))}
      </BlogGrid>
    </BlogSection>
  );
}

const PhilosophySection = styled.section`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center;
  padding: 120px 32px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const PhilosophyContent = styled.div`
  background-color: #fffcef;
  padding: 50px;
  max-width: 650px;
  text-align: center;
  border-radius: 4px;
  position: relative;
  z-index: 1;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const PhilosophyTitle = styled.h2`
  font-family: "Vollkorn", serif;
  font-style: italic;
  font-size: 2.2rem;
  margin-bottom: 24px;
  color: #222;
  font-weight: normal;

  span {
    font-style: normal;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const PhilosophyDescription = styled.p`
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  color: #555;
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const PhilosophyButton = styled(Link)`
  font-family: "Montserrat", sans-serif;
  background: #252525;
  color: #fff;
  padding: 18px 32px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  text-transform: uppercase;
  width: 280px;

  &:hover {
    background: #000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(5px);
  }
`;

function BrandPhilosophy() {
  return (
    <PhilosophySection bg={bannerBg}>
      <PhilosophyContent>
        <PhilosophyTitle>
          Triết lý <span>THƯƠNG HIỆU</span>
        </PhilosophyTitle>
        <PhilosophyDescription>
          Kyo Matcha được thành lập vào năm 2025 bởi những tâm hồn yêu trà và
          tin vào giá trị sâu sắc mà matcha mang lại cho cuộc sống hiện đại. Với
          khả năng thanh lọc, giảm căng thẳng và nuôi dưỡng sự tĩnh tại, matcha
          không chỉ là một thức uống – mà là một lối sống, một nghi thức chăm
          sóc bản thân đầy ý nghĩa.
        </PhilosophyDescription>
        <PhilosophyButton to="/about-us">
          Tìm hiểu thêm <FaArrowRight />
        </PhilosophyButton>
      </PhilosophyContent>
    </PhilosophySection>
  );
}

const Home = () => {
  const scrollingText = "Kyo Matcha - Matcha cho 1 ngày dài tỉnh táo";

  const latestBlogs = blogs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const slides = latestBlogs.map((blog) => ({
    preTitle: blog.category,
    title: blog.title,
    description: blog.summary,
    buttonText: "XEM THÊM",
    buttonLink: `/blogs/${blog.slug}`,
    image: blog.thumbnailUrl,
  }));

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <GlobalStyle />
      <CarouselContainer>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <Slide key={index}>
              <SlideImage src={slide.image} />
              <SlideContent>
                <SlidePreTitle>{slide.preTitle}</SlidePreTitle>
                <SlideTitle>{slide.title}</SlideTitle>
                <SlideDescription>{slide.description}</SlideDescription>
                <SlideButton to={slide.buttonLink}>
                  {slide.buttonText}
                  <FaArrowRight />
                </SlideButton>
              </SlideContent>
            </Slide>
          ))}
        </Slider>
      </CarouselContainer>
      <TeaCollection />
      <BrandPhilosophy />
      <Marquee text={scrollingText} duration="30s" />
      <BlogList />
    </>
  );
};

export default Home;
