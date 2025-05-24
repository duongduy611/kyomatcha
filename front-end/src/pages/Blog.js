import React, { useState } from "react";
import styled from 'styled-components';
import bannerWeb from "../assets/images/banner_web.jpg";
import GlobalStyle from '../components/GlobalStyle';

const tabs = [
  { label: "All" },
  { label: "Bespoke Projects" },
  { label: "Mobile Tea Bar" },
  { label: "Progressive Tea Bar" },
  { label: "Workshop" },
];

const featured = {
  image: bannerWeb,
  title: "NOSTALGIA AND TRANQUILITY - SAKURA SEASON 2025",
  desc: "The sakura season is relatively brief, with the peak bloom lasting only about a week — a quiet reminder of transience and the impermanence of life...",
  link: "#",
};

const blogs = [
  {
    image: "https://matchaya.sg/cdn/shop/articles/Webpage-without-words__1800x1200_bd231296-8111-4a9c-a04f-f8509ab2ef6b_400x.png?v=1745214204",
    category: "PROGRESSIVE TEA BAR",
    title: "SANTA'S MENU 2024 | NOW TILL 2 JAN",
    desc: "This year, we're bringing the Grinch's favourite soft serve flavour to our outlets - Chocolate Mint. Chocolate Mint Soft Serve Rich, creamy dark c...",
    link: "https://matchaya.sg/blogs/latest-news/santas-menu-2024-now-till-2-jan"
  },
  {
    image: "https://matchaya.sg/cdn/shop/articles/IMG_3773_400x.jpg?v=1742391264",
    category: "VARIETY TEA BOX",
    title: "CAPTIVATING FLAVOURS ALL AROUND JAPAN | VARIETY TEA BOX",
    desc: "One common misconception about tea is that it can only be enjoyed at certain times of the day. With our carefully curated selection of straight an...",
    link: "https://matchaya.sg/blogs/latest-news/captivating-flavours-all-around-japan-variety-tea-box"
  },
  {
    image: "https://matchaya.sg/cdn/shop/articles/Untitled_design_45_400x.png?v=1738899160",
    category: "WORKSHOP",
    title: "SUSS X MATCHAYA | UWELLNESS FESTIVAL",
    desc: "Earlier this month, we had the pleasure of participating in the UWellness Festival, hosted by the Singapore University of Social Sciences (SUSS) i...",
    link: "https://matchaya.sg/blogs/latest-news/suss-x-matchaya-uwellness"
  }
];

const products = [
  {
    image: "https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658",
    name: "A TEA GATHERING",
    rating: 5,
    reviews: 56,
    price: 11,
    oldPrice: 12,
  },
  {
    image: "https://matchaya.sg/cdn/shop/products/ColdDrinks_Mochi_400x.png?v=1629609719",
    name: "A TEA GATHERING FOR 2 + WARABI MOCHI",
    rating: 5,
    reviews: 37,
    price: 19,
  },
  {
    image: "https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658",
    name: "WINTER'S HERE",
    rating: 5,
    reviews: 29,
    price: 45,
    oldPrice: 48,
  },
];

const PageWrapper = styled.div`
  background: #f4f4f4;
  min-height: 100vh;
  padding-top: 180px;
  padding-bottom: 40px;
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 48px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.3rem;
  letter-spacing: 2px;
  color: #6d6a4f;
  font-weight: 500;
  margin-bottom: 32px;
`;

const TabList = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${({ active }) => (active ? "#81893f" : "#bdbdbd")};
  border-bottom: 2px solid
    ${({ active }) => (active ? "#81893f" : "transparent")};
  padding: 8px 0;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1px;
  transition: color 0.2s, border-bottom 0.2s;
  outline: none;

  &:hover {
    color: #81893f;
  }
`;

const FeaturedWrapper = styled.div`
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const FeaturedImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  background: #f7f6f4;
`;

const FeaturedContent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 48px 32px 32px 48px;
  color: #fff;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.32) 60%,
    rgba(0, 0, 0, 0.08) 100%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 900px) {
    padding: 32px 16px 24px 16px;
  }
`;

const FeaturedTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: 2px;
  margin-bottom: 18px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

const FeaturedDesc = styled.p`
  font-size: 1.08rem;
  margin-bottom: 28px;
  max-width: 600px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ReadMoreBtn = styled.a`
  background: linear-gradient(to right, transparent 50%, #81893f 50%);
  background-size: 200% 100%;
  background-position: right bottom; /* Bắt đầu từ bên phải */
  color: #fff;
  border: 2px solid #81893f;
  padding: 14px 38px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: background-position 0.5s ease, color 0.5s ease;
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
  display: inline-block;
  position: relative;
  z-index: 1;

  &:hover {
    background-position: left bottom; /* Chạy sang trái khi hover */
    color: #fff;
  }
`;

const BlogListSection = styled.section`
  max-width: 1300px;
  margin: 56px auto 0 auto;
`;
const BlogGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  flex-wrap: wrap;
  margin-bottom: 48px;
  @media (max-width: 1100px) {
    gap: 24px;
  }
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
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
  border-radius: 2px;
`;
const BlogCategory = styled.div`
  color: #81893f;
  font-size: 0.95rem;
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;
const BlogTitle = styled.h2`
  font-size: 1.25rem;
  letter-spacing: 2px;
  color: #6d6a4f;
  font-weight: 500;
  margin-bottom: 18px;
  text-transform: uppercase;
`;
const BlogDesc = styled.div`
  color: #6d6a4f;
  font-size: 1rem;
  margin-bottom: 18px;
`;
const BlogReadMore = styled.a`
  color: #81893f;
  font-size: 1rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
  &:hover {
    color: #6d7a44;
  }
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 24px;
  font-size: 1.1rem;
  color: #6d6a4f;
  user-select: none;
`;
const PageNum = styled.span`
  padding: 2px 12px 4px 12px;
  border-bottom: 3px solid ${props => props.active ? '#81893f' : 'transparent'};
  color: ${props => props.active ? '#81893f' : '#6d6a4f'};
  cursor: pointer;
  transition: border 0.2s, color 0.2s;
`;

const SliderWrapper = styled.div`
  max-width: 1300px;
  margin: 48px auto 0 auto;
  background: #f4f4f4;
  position: relative;
  padding: 48px 0 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SliderTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #6d6a4f;
  font-weight: 500;
  margin-bottom: 32px;
`;
const ProductGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  width: 100%;
`;
const ProductCard = styled.div`
  width: 320px;
  background: transparent;
  text-align: center;
`;
const ProductImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 2px;
  margin-bottom: 18px;
`;
const ProductName = styled.div`
  font-size: 1.05rem;
  color: #6d6a4f;
  font-weight: 500;
  margin: 18px 0 8px 0;
  letter-spacing: 1px;
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
const ProductPrice = styled.div`
  color: #81893f;
  font-size: 1rem;
  margin-top: 2px;
  span {
    color: #bdbdbd;
    text-decoration: line-through;
    margin-left: 8px;
    font-size: 0.95rem;
  }
`;
const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  color: #81893f;
  cursor: pointer;
  z-index: 2;
  left: ${props => props.left ? '24px' : 'unset'};
  right: ${props => props.right ? '24px' : 'unset'};
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #f7f6f4;
  }
`;

const Blog = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [slide, setSlide] = useState(0);

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Section>
          <Title>LATEST NEWS</Title>
          <TabList>
            {tabs.map((tab, idx) => (
              <Tab
                key={tab.label}
                active={activeTab === idx}
                onClick={() => setActiveTab(idx)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
          <FeaturedWrapper>
            <FeaturedImage src={featured.image} alt={featured.title} />
            <FeaturedContent>
              <FeaturedTitle>{featured.title}</FeaturedTitle>
              <FeaturedDesc>{featured.desc}</FeaturedDesc>
              <ReadMoreBtn href={featured.link}>READ MORE</ReadMoreBtn>
            </FeaturedContent>
          </FeaturedWrapper>
        </Section>
        <BlogListSection>
          <BlogGrid>
            {blogs.map((b, idx) => (
              <BlogCard key={idx}>
                <BlogImage src={b.image} alt={b.title} />
                <BlogCategory>{b.category}</BlogCategory>
                <BlogTitle>{b.title}</BlogTitle>
                <BlogDesc>{b.desc}</BlogDesc>
                <BlogReadMore href={b.link} target="_blank" rel="noopener noreferrer">Read more</BlogReadMore>
              </BlogCard>
            ))}
          </BlogGrid>
          <Pagination>
            <PageNum active={page===1} onClick={()=>setPage(1)}>1</PageNum>
            <PageNum onClick={()=>setPage(2)}>2</PageNum>
            <PageNum onClick={()=>setPage(3)}>3</PageNum>
            <span>...</span>
            <PageNum onClick={()=>setPage(5)}>5</PageNum>
            <PageNum onClick={()=>setPage(page+1)}>&#8594;</PageNum>
          </Pagination>
        </BlogListSection>
        <SliderWrapper>
          <SliderTitle>SHOP NOW</SliderTitle>
          <ArrowBtn left onClick={() => setSlide(s => Math.max(0, s - 1))}>&lt;</ArrowBtn>
          <ProductGrid>
            {products.slice(slide, slide + 3).map((p, idx) => (
              <ProductCard key={idx}>
                <ProductImage src={p.image} alt={p.name} />
                <ProductName>{p.name}</ProductName>
                <ProductRating>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{color: i < p.rating ? '#bfae5a' : '#e0e0e0'}}>★</span>
                  ))}
                  <span style={{ color: '#81893f', fontSize: '0.95rem', marginLeft: 4 }}>({p.reviews})</span>
                </ProductRating>
                <ProductPrice>
                  ${p.price}
                  {p.oldPrice && <span>${p.oldPrice}</span>}
                </ProductPrice>
              </ProductCard>
            ))}
          </ProductGrid>
          <ArrowBtn right onClick={() => setSlide(s => Math.min(products.length - 3, s + 1))}>&gt;</ArrowBtn>
        </SliderWrapper>
      </PageWrapper>
    </>
  );
};

export default Blog;
