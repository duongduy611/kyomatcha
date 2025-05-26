import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';
import { useNavigate } from 'react-router-dom';
import { blogs } from '../data/blogs';
import { useAppContext } from '../context/AppContext';

const tabs = [
  { label: "Tất cả" },
  { label: "Khám phá về Matcha" },
  { label: "Làm đẹp" },
  { label: "Pha chế" },
];

const featuredContent = {
  "Tất cả": {
    image: "https://matchaya.sg/cdn/shop/articles/artem-r-BLNqqiIJaos-unsplash_2b6efb14-0198-4271-8513-4c07aa3d40e9_400x.jpg?v=1746154725",
    title: "NOSTALGIA AND TRANQUILITY - SAKURA SEASON 2025",
  },
  "Khám phá về Matcha": {
    image: "matchaBanner",
    title: "HÀNH TRÌNH TÌM HIỂU VỀ MATCHA NHẬT BẢN",
    desc: "Khám phá nguồn gốc và quy trình sản xuất Matcha truyền thống",
    link: "#"
  },
  "Làm đẹp": {
    image: "beautyBanner",
    title: "BÍ QUYẾT LÀM ĐẸP VỚI BỘT MATCHA",
    desc: "Tận dụng công dụng làm đẹp tuyệt vời từ bột Matcha",
    link: "#"
  },
  "Pha chế": {
    image: "recipeBanner",
    title: "NGHỆ THUẬT PHA CHẾ MATCHA",
    desc: "Học cách pha chế những món đồ uống tuyệt hảo từ Matcha",
    link: "#"
  }
};

const products = [
  {
    image: "https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658",
    name: "A TEA GATHERING",
    price: 11,
    oldPrice: 12,
  },
  {
    image: "https://matchaya.sg/cdn/shop/products/ColdDrinks_Mochi_400x.png?v=1629609719",
    name: "A TEA GATHERING FOR 2 + WARABI MOCHI",
    price: 19,
  },
  {
    image: "https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658",
    name: "WINTER'S HERE",
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
  font-family: 'Montserrat', sans-serif;
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
  background-position: right bottom;
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
    background-position: left bottom;
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
const BlogDate = styled.div`
  color: #81893f;
  font-size: 0.9rem;
  margin-bottom: 8px;
  font-style: italic;
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

const FeaturedCategory = styled(BlogCategory)`
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const FeaturedDate = styled(BlogDate)`
  font-size: 1rem;
  margin-bottom: 12px;
`;

const Blog = () => {
  const [page, setPage] = useState(1);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const { selectedBlogCategory, setSelectedBlogCategory } = useAppContext();

  // Format date to display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Get featured blog based on selected category
  const getFeaturedBlog = () => {
    let filteredBlogs;
    if (selectedBlogCategory === 'Tất cả') {
      // Get all blogs
      filteredBlogs = [...blogs];
    } else {
      // Get blogs for specific category
      filteredBlogs = blogs.filter(b => b.category === selectedBlogCategory);
    }
    // Sort by date and get the latest
    return filteredBlogs.sort((a, b) =>
      new Date(b.publishDate) - new Date(a.publishDate)
    )[0];
  };

  // Get featured content from latest blog
  const featured = getFeaturedBlog();

  // Lọc và sắp xếp blog
  let filteredBlogs = [];
  if (selectedBlogCategory === 'Tất cả') {
    // Hiển thị tất cả blog và sắp xếp theo ngày mới nhất
    filteredBlogs = [...blogs].sort((a, b) =>
      new Date(b.publishDate) - new Date(a.publishDate)
    );
  } else {
    filteredBlogs = blogs
      .filter(b => b.category === selectedBlogCategory)
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Section>
          <Title>LATEST BLOG</Title>
          <TabList>
            {tabs.map((tab, idx) => (
              <Tab
                key={tab.label}
                active={selectedBlogCategory === tab.label}
                onClick={() => setSelectedBlogCategory(tab.label)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
          <FeaturedWrapper>
            <FeaturedImage src={featured.image} alt={featured.title} />
            <FeaturedContent>
              <FeaturedCategory>{featured.category}</FeaturedCategory>
              <FeaturedDate>{formatDate(featured.publishDate)}</FeaturedDate>
              <FeaturedTitle>{featured.title}</FeaturedTitle>
              <FeaturedDesc>{featured.desc}</FeaturedDesc>
              <ReadMoreBtn onClick={() => handleBlogClick(featured.id)}>READ MORE</ReadMoreBtn>
            </FeaturedContent>
          </FeaturedWrapper>
        </Section>
        <BlogListSection>
          <BlogGrid>
            {filteredBlogs.map((b, idx) => (
              <BlogCard key={idx}>
                <BlogImage
                  src={b.image}
                  alt={b.title}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleBlogClick(b.id)}
                />
                <BlogCategory>{b.category}</BlogCategory>
                <BlogDate>{formatDate(b.publishDate)}</BlogDate>
                <BlogTitle
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleBlogClick(b.id)}
                >
                  {b.title}
                </BlogTitle>
                <BlogDesc>{b.desc}</BlogDesc>
                <BlogReadMore onClick={() => handleBlogClick(b.id)}>Read more</BlogReadMore>
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
