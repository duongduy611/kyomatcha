import React, { useState, useEffect } from "react";
import bannerWeb from "../assets/images/banner_web.jpg";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import axios from "axios";
import { Link } from "react-router-dom";
import { blogs } from "../data/blogs";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

const BACKEND_URL = "http://localhost:9999";

const BannerWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.45) 60%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
`;

const BannerTextWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: flex-start;
  z-index: 2;
  padding-left: 64px;
  padding-bottom: 64px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding-left: 24px;
    padding-bottom: 24px;
  }
`;

const BannerSubText = styled.div`
  color: #fff;
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 18px;
  opacity: 0.85;
`;

const BannerTitle = styled.div`
  color: #fff;
  font-size: 22px;
  letter-spacing: 3px;
  margin-bottom: 32px;
  text-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);
`;

const BannerButtonGroup = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
`;

const BannerButton = styled(Link)`
  background: #4A7C59;
  color: #fff;
  border: 2px solid #4A7C59;
  padding: 14px 38px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  font-family: "Montserrat", sans-serif;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: transparent;
    color: #fff;
    border: 2px solid #fff;
  }
`;

const Section = styled.section`
  border-top: 1px solid #e5e5e5;
  background: #f7f6f4;
  padding: 60px 0 40px 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #4A7C59;
  font-weight: 500;
  margin-bottom: 48px;
`;

const ProductGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  padding: 0 32px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 280px;
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

const TeaCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toggleFavorite, isProductFavorited } = useAppContext();

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        if (response.data && response.data.data) {
          const filteredProducts = response.data.data
            .filter(
              (product) =>
                !product.name.includes("matcha fuji 01") &&
                (product.name.includes("Matcha Natsu") ||
                  product.name.includes("Matcha Aki") ||
                  product.name.includes("Matcha Haru") ||
                  product.name.includes("Matcha Fuji 02") ||
                  product.name.includes("Matcha Fuji 03") ||
                  product.name.includes("Matcha Fuji 05"))
            )
            .slice(0, 6);
          console.log("Filtered Products:", filteredProducts); // Debug log
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

  if (loading) {
    return (
      <Section>
        <SectionTitle>MATCHA CỦA CHÚNG TÔI</SectionTitle>
        <div style={{ textAlign: "center" }}>Loading...</div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>MATCHA CỦA CHÚNG TÔI</SectionTitle>
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
    </Section>
  );
}

const BlogSection = styled.section`
  background: #f7f6f4;
  padding: 60px 0 40px 0;
  border-top: 1px solid #e5e5e5;
`;

const BlogLabel = styled.div`
  text-align: center;
  color: #4A7C59;
  font-size: 0.95rem;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const BlogTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #4A7C59;
  font-weight: 500;
  margin-bottom: 48px;
`;

const BlogGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
`;

const BlogCard = styled.div`
  width: 370px;
  text-align: left;
  padding: 20px;
  transition: transform 0.3s ease;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 210px;
  object-fit: cover;
  margin-bottom: 18px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const BlogCategory = styled.div`
  color: #4A7C59;
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
    color: #4A7C59;
  }
`;

const BlogDesc = styled.div`
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 18px;
  line-height: 1.6;
`;

const BlogReadMore = styled(Link)`
  color: #4A7C59;
  font-size: 0.95rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
  font-weight: 500;

  &:hover {
    color: #4A7C59;
  }
`;

function BlogList() {
  const getLatestBlogsByCategory = () => {
    const categories = ["Khám phá về Matcha", "Làm đẹp", "Pha chế"];
    const latestBlogs = [];

    categories.forEach((category) => {
      const categoryBlogs = blogs
        .filter((blog) => blog.category === category)
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

      if (categoryBlogs.length > 0) {
        latestBlogs.push(categoryBlogs[0]);
      }
    });

    return latestBlogs;
  };

  const latestBlogs = getLatestBlogsByCategory();

  return (
    <BlogSection>
      <BlogLabel>Blogs</BlogLabel>
      <BlogTitle>BLOGS MỚI NHẤT</BlogTitle>
      <BlogGrid>
        {latestBlogs.map((blog, idx) => (
          <BlogCard key={idx}>
            <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none' }}>
              <BlogImage src={blog.image} alt={blog.title} />
              <BlogPostTitle>{blog.title}</BlogPostTitle>
            </Link>
            <BlogCategory>{blog.category}</BlogCategory>
            <BlogDesc>{blog.desc}</BlogDesc>
            <BlogReadMore to={`/blog/${blog.id}`}>Xem thêm</BlogReadMore>
          </BlogCard>
        ))}
      </BlogGrid>
    </BlogSection>
  );
}

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <BannerWrapper>
        <BannerImage src={bannerWeb} alt="Banner" />
        <BannerOverlay />
        <BannerTextWrapper>
          <BannerSubText>TU LUYỆN CHÁNH NIỆM VÀ SỰ YÊN TĨNH</BannerSubText>
          <BannerTitle>MỘT KHỞI ĐẦU MỚI</BannerTitle>
          <BannerButtonGroup>
            <BannerButton to="/products">MUA NGAY</BannerButton>
            <BannerButton to="/blog">XEM THÊM</BannerButton>
          </BannerButtonGroup>
        </BannerTextWrapper>
      </BannerWrapper>
      <TeaCollection />
      <BlogList />
    </>
  );
};

export default Home;
