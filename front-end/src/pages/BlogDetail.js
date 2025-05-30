import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';
import { useParams, Link } from 'react-router-dom';
import { blogs } from '../data/blogs';
import axios from 'axios';

const BACKEND_URL = "http://localhost:9999";

const Wrapper = styled.div`
  padding-top: 80px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
`;
const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const BannerOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(245,245,245,0.95);
  padding: 40px 0 20px 0;
  text-align: center;
`;
const BannerDate = styled.div`
  color: #7a7a3a;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;
const BannerTitle = styled.h1`
  color: #3a3a2a;
  font-weight: 400;
  letter-spacing: 3px;
  font-size: 28px;
  margin: 0;
`;

const MainContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: #f5f5f5;
  padding: 40px 0 0 0;
  text-align: center;
`;

const MainDesc = styled.div`
  color: #7a7a3a;
  font-size: 16px;
  margin-bottom: 40px;
`;

const EndContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;
const EndImg = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 24px;
`;
const EndDesc = styled.div`
  color: #7a7a3a;
  font-size: 16px;
  margin-bottom: 32px;
`;

const CTA = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;
const CTALink = styled.a`
  color: #3a3a2a;
  font-size: 22px;
  letter-spacing: 3px;
  text-decoration: underline;
  font-weight: 400;
`;

const Author = styled.div`
  text-align: center;
  color: #7a7a3a;
  font-size: 15px;
  margin-bottom: 32px;
`;

const SocialShare = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;
const SocialBtn = styled.button`
  margin: 0 8px;
  background: none;
  border: 1px solid #d6d6b8;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
`;
const SocialIcon = styled.i`
  color: #3a3a2a;
  font-size: 18px;
`;

const RelatedSection = styled.div`
  min-height: 80vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #181818;
  padding: 60px 0;
`;
const RelatedWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
`;
const RelatedCard = styled.div`
  width: 350px;
  color: #fff;
`;
const RelatedImg = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  margin-bottom: 16px;
`;
const RelatedTitle = styled.div`
  font-size: 20px;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const ProductSection = styled.section`
  max-width: 1200px;
  margin: 48px auto;
  padding: 0 20px;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 40px 20px;
`;
const ProductTitle = styled.h2`
  text-align: center;
  font-size: 1.6rem;
  letter-spacing: 3px;
  color: #81893f;
  font-weight: 600;
  margin-bottom: 40px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #81893f;
    border-radius: 2px;
  }
`;
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const ProductCard = styled.div`
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;
const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;
const ProductName = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
  letter-spacing: 1px;
`;
const ProductPrice = styled.p`
  color: #81893f;
  font-weight: 600;
  font-size: 1.1rem;
`;

const BlogDetail = () => {
  const { blogId } = useParams();
  const blog = blogs.find(b => b.id === Number(blogId));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`, {
          params: { limit: 3 },
        });
        if (response.data && response.data.data) {
          setProducts(response.data.data.slice(0, 3));
        }
      } catch (error) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (!blog) return <div style={{paddingTop: 180, textAlign: 'center'}}>Blog không tồn tại!</div>;

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        {/* Banner đầu trang */}
        <Banner>
          <BannerImg src={blog.image} alt={blog.title} />
          <BannerOverlay>
            <BannerDate>{blog.category}</BannerDate>
            <BannerTitle>{blog.title}</BannerTitle>
          </BannerOverlay>
        </Banner>

        {/* Nội dung chính */}
        <MainContent>
          <MainDesc>{blog.desc}</MainDesc>
        </MainContent>

        {/* Ảnh cuối bài và cảm ơn */}
        <EndContent>
          <EndImg src="https://cdn.shopify.com/s/files/1/0081/8734/7026/files/IMG_3760.jpg?v=1742390813" alt="Banner End" />
          <EndDesc>
            Thank you for having us and wishing everyone an empowering International Women's Day!
          </EndDesc>
        </EndContent>

        {/* CTA */}
        <CTA>
          <CTALink href="#">
            DISCOVER THE BENEFITS OF PARTNERING WITH US!
          </CTALink>
        </CTA>

        {/* Thông tin tác giả */}
        <Author>WRITTEN BY MATCHAYA ONLINE TEAM</Author>

        {/* Các bài viết liên quan */}
        <RelatedSection>
          <RelatedWrapper>
            <RelatedCard>
              <RelatedImg src="https://matchaya.sg/cdn/shop/articles/Webpage-without-words__1800x1200_bd231296-8111-4a9c-a04f-f8509ab2ef6b_600x.png?v=1745214204" alt="Sakura Season" />
              <RelatedTitle>NOSTALGIA AND TRANQUILITY - SAKURA SEASON 2025</RelatedTitle>
            </RelatedCard>
            <RelatedCard>
              <RelatedImg src="https://matchaya.sg/cdn/shop/articles/Untitled_design_45_600x.png?v=1738899160" alt="Revamp Packaging" />
              <RelatedTitle>A FRESH BEGINNING | REVAMP PACKAGING</RelatedTitle>
            </RelatedCard>
          </RelatedWrapper>
        </RelatedSection>

        {/* Carousel sản phẩm */}
        <ProductSection>
          <ProductTitle>MATCHA PREMIUM</ProductTitle>
          {loading ? (
            <div style={{ textAlign: 'center' }}>Loading...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center' }}>No products found.</div>
          ) : (
            <ProductGrid>
              {products.map(product => (
                <ProductCard key={product._id}>
                  <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <ProductImage
                      src={product.images && product.images.length > 0 ? `${BACKEND_URL}${product.images[0]}` : "/placeholder.jpg"}
                      alt={product.name}
                      onError={e => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
                    />
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>
                      {product.price ? `Chỉ từ ${product.price.toLocaleString()}đ` : ''}
                    </ProductPrice>
                  </Link>
                </ProductCard>
              ))}
            </ProductGrid>
          )}
        </ProductSection>
      </Wrapper>
    </>
  );
};

export default BlogDetail;