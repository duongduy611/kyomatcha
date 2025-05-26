import React, { useState, useEffect } from 'react';
import bannerWeb from '../assets/images/banner_web.jpg';
import styled from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:9999';

const BannerWrapper = styled.div`  width: 100%;
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
  background: linear-gradient(to top, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0) 100%);
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
  text-shadow: 0 3px 10px rgba(0,0,0,0.6);
`;

const BannerButtonGroup = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
`;

const BannerButton = styled.button`
  background: #81893f;
  color: #fff;
  border: 2px solid #81893f;
  padding: 14px 38px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  font-family: 'Montserrat', sans-serif;
  &:hover {
    background: transparent;
    color: #81893f;
    border: 2px solid #81893f;
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
  color: #6d6a4f;
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
  color: #6d6a4f;
  font-weight: 500;
  margin: 18px 0 8px 0;
  letter-spacing: 1px;
`;

const ProductPrice = styled.div`
  color: #81893f;
  font-size: 1rem;
  margin-top: 2px;
`;

const ProductRating = styled.div`
  color: #bfae5a;
  font-size: 1rem;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
            .filter(product =>
              !product.name.includes('matcha fuji 01') &&
              (product.name.includes('Matcha Natsu') ||
               product.name.includes('Matcha Aki') ||
               product.name.includes('Matcha Haru') ||
               product.name.includes('Matcha Fuji 02') ||
               product.name.includes('Matcha Fuji 03') ||
               product.name.includes('Matcha Fuji 05'))
            )
            .slice(0, 6);
          console.log('Filtered Products:', filteredProducts); // Debug log
          setProducts(filteredProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Section>
        <SectionTitle>TEA COLLECTION</SectionTitle>
        <div style={{ textAlign: 'center' }}>Loading...</div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>TEA COLLECTION</SectionTitle>
      <ProductGrid>
        {products.map((product) => {
          console.log('Product images:', product.images); // Debug log
          return (
            <ProductCard key={product._id}>
              <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                <ProductImage
                  src={product.images && product.images.length > 0
                    ? `${BACKEND_URL}${product.images[0]}`
                    : '/placeholder.jpg'
                  }
                  alt={product.name}
                  onError={(e) => {
                    console.log('Image load error for:', product.name); // Debug log
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <ProductName>{product.name}</ProductName>
                <ProductPrice>Chỉ từ {product.price.toLocaleString()}đ</ProductPrice>
              </Link>
            </ProductCard>
          );
        })}
      </ProductGrid>
    </Section>
  );
}

const blogs = [
  {
    image: "https://matchaya.sg/cdn/shop/articles/Webpage-without-words__1800x1200_bd231296-8111-4a9c-a04f-f8509ab2ef6b_400x.png?v=1745214204",
    title: "NOSTALGIA AND TRANQUILITY - SAKURA SEASON 2025",
    desc: "The sakura season is relatively brief, with the peak bloom lasting only about a week — a quiet reminder of transience and the impermanence of life...",
    link: "#"
  },
  {
    image: "https://matchaya.sg/cdn/shop/articles/IMG_3773_400x.jpg?v=1742391264",
    title: "KEYSIGHT X MATCHAYA | MOBILE TEA BAR",
    desc: "After a great event at Keysight's carnival last year, we're excited to be back with another Mobile Tea Bar activation!  Originally planned for Inte...",
    link: "#"
  },
  {
    image: "https://matchaya.sg/cdn/shop/articles/Untitled_design_45_400x.png?v=1738899160",
    title: "A FRESH BEGINNING | REVAMP PACKAGING",
    desc: "The Year of the Snake invites us to reflect on transformation and personal growth, much like a snake shedding its skin, we've made space for someth...",
    link: "#"
  }
];

const BlogSection = styled.section`
  background: #f7f6f4;
  padding: 60px 0 40px 0;
  border-top: 1px solid #e5e5e5;
`;

const BlogLabel = styled.div`
  text-align: center;
  color: #81893f;
  font-size: 0.95rem;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const BlogTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #6d6a4f;
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
  background: transparent;
  text-align: left;
`;

const BlogImage = styled.img`
  width: 100%;
  height: 210px;
  object-fit: cover;
  margin-bottom: 18px;
`;

const BlogPostTitle = styled.div`
  font-size: 1.08rem;
  color: #6d6a4f;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const BlogDesc = styled.div`
  font-family: 'Nunito Sans', sans-serif;
  color: #81893f;
  font-size: 14px;
  margin-bottom: 18px;
`;

const BlogReadMore = styled(Link)`
  font-family: 'Nunito Sans', sans-serif;
  color: #81893f;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
  &:hover {
    color: #6d7a44;
  }
`;

function BlogList() {
  return (
    <BlogSection>
      <BlogLabel>Blogs</BlogLabel>
      <BlogTitle>LATEST BLOGS</BlogTitle>
      <BlogGrid>
        {blogs.map((b, idx) => (
          <BlogCard key={idx}>
            <BlogImage src={b.image} alt={b.title} />
            <BlogPostTitle>{b.title}</BlogPostTitle>
            <BlogDesc>{b.desc}</BlogDesc>
            <BlogReadMore to={b.link}>Read more</BlogReadMore>
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
          <BannerSubText>CULTIVATING MINDFULNESS AND TRANQUILITY</BannerSubText>
          <BannerTitle>A FRESH BEGINNING</BannerTitle>
          <BannerButtonGroup>
            <BannerButton>SHOP NEW LOOK</BannerButton>
            <BannerButton>READ MORE</BannerButton>
          </BannerButtonGroup>
        </BannerTextWrapper>
      </BannerWrapper>
      <TeaCollection />
      <BlogList />
    </>
  );
};

export default Home;