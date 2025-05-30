import React, { useState, useEffect } from "react";
import bannerWeb from "../assets/images/banner_web.jpg";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import axios from "axios";
import { Link } from "react-router-dom";
import { blogs } from "../data/blogs";

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
`;

const ProductCard = styled.div`
  background: transparent;
  width: 370px;
  padding-bottom: 24px;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
`;

const ProductName = styled.div`
  font-size: 1.05rem;
  color: #4A7C59;
  font-weight: 500;
  margin: 18px 0 8px 0;
  letter-spacing: 1px;
`;

const ProductPrice = styled.div`
  color: #4A7C59;
  font-size: 1rem;
  margin-top: 2px;
`;

function TeaCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        {products.map((product) => {
          console.log("Product images:", product.images); // Debug log
          return (
            <ProductCard key={product._id}>
              <Link
                to={`/products/${product.slug}`}
                style={{ textDecoration: "none" }}
              >
                <ProductImage
                  src={
                    product.images && product.images.length > 0
                      ? `${BACKEND_URL}${product.images[0]}`
                      : "/placeholder.jpg"
                  }
                  alt={product.name}
                  onError={(e) => {
                    console.log("Image load error for:", product.name); // Debug log
                    e.target.onerror = null;
                    e.target.src = "/placeholder.jpg";
                  }}
                />
                <ProductName>{product.name}</ProductName>
                <ProductPrice>
                  Chỉ từ {product.price.toLocaleString()}đ
                </ProductPrice>
              </Link>
            </ProductCard>
          );
        })}
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
