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
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(30,30,30,0.25);
  text-align: center;
`;

const BannerPresent = styled.div`
  font-size: 2.2rem;
  font-weight: 400;
  letter-spacing: 2px;
  margin-bottom: 16px;
  opacity: 0.95;
`;

const BannerTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 6px;
  margin: 0;
  line-height: 1.1;
  text-shadow: 0 2px 16px rgba(0,0,0,0.18);
`;

const BannerSubtitle = styled.div`
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: 6px;
  margin-top: 8px;
  line-height: 1.1;
  text-shadow: 0 2px 16px rgba(0,0,0,0.18);
`;

const BannerDate = styled.div`
  font-size: 1rem;
  letter-spacing: 2px;
  color: #eaeaea;
  margin-top: 32px;
  opacity: 0.85;
`;

const MainContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #f5f5f5;
  padding: 48px 0 0 0;
  text-align: center;
`;

const MainDesc = styled.div`
  color: #7a7a3a;
  font-size: 1.2rem;
  margin-bottom: 40px;
`;

const RelatedSection = styled.div`
  min-height: 80vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  padding: 60px 0;
`;
const RelatedWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
`;
const RelatedCard = styled.div`
  width: 500px;
  color: #fff;
`;
const RelatedImg = styled.img`
  width: 100%;
  height: 300px;
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
  margin: 0 auto;
  padding: 80px 20px;
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

const Section = styled.section`
  max-width: 900px;
  margin: 0 auto 48px auto;
  background: #f7f7f7;
  padding: 48px 0 0 0;
  text-align: center;
`;
const SectionTitle = styled.h2`
  letter-spacing: 6px;
  color: #81893f;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 32px;
  text-transform: uppercase;
`;
const SectionImg = styled.img`
  width: 500px;
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 32px;
  object-fit: cover;
`;
const SectionList = styled.ul`
  list-style: disc inside;
  text-align: left;
  max-width: 400px;
  margin: 0 auto 32px auto;
  color: #6d6a4f;
  font-size: 1rem;
  line-height: 2;
  padding-left: 0;
`;
const SectionItem = styled.li`
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;
const ItemImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f5;
`;
const ItemText = styled.span`
  display: block;
  margin-top: 8px;
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
        {/* Banner */}
        <Banner>
          <BannerImg src={blog.thumbnailUrl} alt={blog.title} />
          <BannerOverlay>
            <BannerPresent>Matchaya presents</BannerPresent>
            <BannerTitle>
              {blog.title.split('|')[0].toUpperCase()}
            </BannerTitle>
            <BannerSubtitle>
              {blog.title.split('|')[1] ? blog.title.split('|')[1].toUpperCase() : ''}
            </BannerSubtitle>
            <BannerDate>
              {blog.date || "SEPTEMBER 23, 2024"}
            </BannerDate>
          </BannerOverlay>
        </Banner>

        {/* Nội dung chính */}
        <MainContent>
          <MainDesc>{blog.summary}</MainDesc>
          {/* Nếu có nội dung chi tiết, render ở đây */}
        </MainContent>

        {/* TEAWARES section */}
        {blog.teawares && blog.teawares.length > 0 && (
          <Section>
            <SectionTitle>TEAWARES</SectionTitle>
            {/* Nếu có image cho teaware đầu tiên thì hiển thị */}
            {blog.teawares[0].image && (
              <SectionImg src={blog.teawares[0].image} alt="Teaware" />
            )}
            <SectionList>
              {blog.teawares.map((item, idx) => (
                <SectionItem key={idx}>
                  {/* Nếu item là object có image */}
                  {typeof item === 'object' && item.image && (
                    <ItemImg src={item.image} alt={item.name || item.ingredient || item.step || 'teaware'} />
                  )}
                  <ItemText>{typeof item === 'string' ? item : item.name || item.ingredient || item.step}</ItemText>
                </SectionItem>
              ))}
            </SectionList>
          </Section>
        )}
        {/* INGREDIENTS section */}
        {blog.ingredients && blog.ingredients.length > 0 && (
          <Section>
            <SectionTitle>INGREDIENTS</SectionTitle>
            {blog.ingredients[0].image && (
              <SectionImg src={blog.ingredients[0].image} alt="Ingredient" />
            )}
            <SectionList>
              {blog.ingredients.map((item, idx) => (
                <SectionItem key={idx}>
                  {typeof item === 'object' && item.image && (
                    <ItemImg src={item.image} alt={item.ingredient || item.name || 'ingredient'} />
                  )}
                  <ItemText>{typeof item === 'string' ? item : item.ingredient || item.name}</ItemText>
                </SectionItem>
              ))}
            </SectionList>
          </Section>
        )}
        {/* DIRECTIONS section */}
        {blog.directions && blog.directions.length > 0 && (
          <Section>
            <SectionTitle>DIRECTIONS</SectionTitle>
            {blog.directions[0].image && (
              <SectionImg src={blog.directions[0].image} alt="Direction" />
            )}
            <SectionList>
              {blog.directions.map((item, idx) => (
                <SectionItem key={idx}>
                  {typeof item === 'object' && item.image && (
                    <ItemImg src={item.image} alt={item.step || 'direction'} />
                  )}
                  <ItemText>{typeof item === 'string' ? item : item.step}</ItemText>
                </SectionItem>
              ))}
            </SectionList>
          </Section>
        )}

        {/* Các bài viết liên quan */}
        {blog && (
          <RelatedSection>
            <RelatedWrapper>
              {blogs
                .filter(b => b.category === blog.category && b.id !== blog.id)
                .slice(0, 2)
                .map((related, idx) => (
                  <RelatedCard key={related.id}>
                    <Link to={`/blog/${related.id}`} style={{ textDecoration: 'none' }}>
                      <RelatedImg src={related.thumbnailUrl || related.image} alt={related.title} />
                      <RelatedTitle>{related.title}</RelatedTitle>
                    </Link>
                  </RelatedCard>
                ))}
            </RelatedWrapper>
          </RelatedSection>
        )}

        {/* Carousel sản phẩm */}
        <ProductSection>
          <ProductTitle>SẢN PHẨM LIÊN QUAN</ProductTitle>
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