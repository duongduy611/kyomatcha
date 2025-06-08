import React, { useState, useEffect } from "react";
import bannerWeb from "../assets/images/e1df83de170ef44fef5a41025bb81813.jpg";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import axios from "axios";
import { Link } from "react-router-dom";
import { blogs } from "../data/blogs";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const BannerWrapper = styled.div`
  margin-top: 100px;
  width: 100%;
  height: 70vh;
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
    rgba(0, 0, 0, 0.30) 50%,
    rgba(0, 0, 0, 0.30) 100%
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

const BannerTitle = styled.div`
  color: #fff;
  font-size: 24px;
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
  background: #527328;
  color: #fff;
  border: 2px solid #527328;
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
  background: #f6f6ee;
  padding: 40px 0 40px 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #000;
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
  background: #f6f6ee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 450px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.18);
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
  border-radius: 8px;
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
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #527328;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
   width: 40%;
  height: 120%;
  &:hover {
    border: 1px solid #527328;
    background: #f6f6ee;
    color: #527328;
  }
`;

const TeaCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toggleFavorite, isProductFavorited, user } = useAppContext();

 const handleAddToCart = async (productId, color = "", size = "") => {
  try {
    // Lấy token từ localStorage và userId từ context
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
   console.log(userId);
    // Nếu chưa đăng nhập hoặc chưa có userId, điều hướng về trang login
    if (!token || !userId) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    // Chuẩn bị payload theo đúng spec của backend
    const payload = {
      userId: userId,
      productId: productId,
      quantity: 1,      // ở đây mình để mặc định 1; bạn có thể truyền vào tham số nếu muốn
      color: color,     // truyền vào từ component hoặc để mặc định
      size: size        // truyền vào từ component hoặc để mặc định
    };

    // Gọi API thêm vào giỏ
    const response = await axios.post(
      `${BACKEND_URL}/cart/add`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

  if (response.status === 200 && response.data && response.data._id) {
      // Backend trả về obj cart mới (có _id) → coi như thành công
      toast.success('Đã thêm vào giỏ hàng!');
    } else {
      console.log('Unexpected response from /cart/add:', response.data);
      toast.error('Thêm vào giỏ hàng không thành công. Vui lòng thử lại.');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error.response?.status === 401) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
    } else if (error.response?.data?.message) {
      // Hiển thị message lỗi do backend trả về (nếu có)
      toast.error(error.response.data.message);
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
    e.preventDefault(); // Ngăn hành vi mặc định nếu cần
    navigate(`/products/${product.slug}`);
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
    </Section>
  );
}

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
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  text-decoration: none;
  text-underline-offset: 3px;
  transition: color 0.2s;
  font-weight: 500;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background: #4A7C59;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 auto;
  }

  &:hover {
    color: #4A7C59;
  }
  &:hover::after {
    width: 100%;
  }
`;

function BlogList() {
  // Lấy 6 blog mới nhất, sắp xếp theo ngày tạo hoặc cập nhật mới nhất
  const latestBlogs = blogs
    .slice() // copy mảng để không ảnh hưởng gốc
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);

  return (
    <BlogSection>
      <BlogTitle>BÀI VIẾT MỚI NHẤT</BlogTitle>
      <BlogGrid>
        {latestBlogs.map((blog, idx) => (
          <BlogCard key={idx}>
            <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: 'none' }}>
              <BlogImage src={blog.thumbnailUrl} alt={blog.title} />
              <BlogPostTitle>{blog.title}</BlogPostTitle>
            </Link>
            <BlogCategory>{blog.category}</BlogCategory>
            <BlogDesc>{blog.summary || blog.desc}</BlogDesc>
            <BlogReadMore to={`/blogs/${blog.slug}`}>XEM THÊM</BlogReadMore>
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
          <BannerTitle>MỘT KHỞI ĐẦU MỚI</BannerTitle>
          <BannerButtonGroup>
            <BannerButton to="/products">MUA NGAY</BannerButton>
            <BannerButton to="/blogs">XEM THÊM</BannerButton>
          </BannerButtonGroup>
        </BannerTextWrapper>
      </BannerWrapper>
      <TeaCollection />
      <BlogList />
    </>
  );
};

export default Home;
