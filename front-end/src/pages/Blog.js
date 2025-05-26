import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import { useNavigate } from "react-router-dom";
import { blogs } from "../data/blogs";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const BACKEND_URL = "http://localhost:9999";

const tabs = [
  { label: "Tất cả" },
  { label: "Khám phá về Matcha" },
  { label: "Làm đẹp" },
  { label: "Pha chế" },
];

const ITEMS_PER_PAGE = 6;

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
  font-family: "Montserrat", sans-serif;
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

const ReadMoreBtn = styled.button`
  background: #fff;
  color: black;
  border: 2px solid #fff;
  padding: 14px 38px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  font-family: "Montserrat", sans-serif;
  &:hover {
    background: transparent;
    color: #fff;
    border: 2px solid #fff;
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
const PageArrow = styled.button`
  background: none;
  border: none;
  color: ${props => props.disabled ? '#bdbdbd' : '#81893f'};
  font-size: 1.2rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 0 12px;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.disabled ? '#bdbdbd' : '#6d7a44'};
  }
`;
const PageNum = styled.span`
  padding: 2px 12px 4px 12px;
  border-bottom: 3px solid ${(props) => (props.active ? "#81893f" : "transparent")};
  color: ${(props) => {
    if (props.isEllipsis) return '#bdbdbd';
    return props.active ? "#81893f" : "#6d6a4f";
  }};
  cursor: ${props => props.isEllipsis ? 'default' : 'pointer'};
  transition: border 0.2s, color 0.2s;
  user-select: none;

  &:hover {
    color: ${props => props.isEllipsis ? '#bdbdbd' : '#81893f'};
  }
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

const Blog = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { selectedBlogCategory, setSelectedBlogCategory } = useAppContext();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Get featured blog based on selected category
  const getFeaturedBlog = () => {
    let filteredBlogs;
    if (selectedBlogCategory === "Tất cả") {
      filteredBlogs = [...blogs];
    } else {
      filteredBlogs = blogs.filter((b) => b.category === selectedBlogCategory);
    }
    return filteredBlogs.sort(
      (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
    )[0];
  };

  // Get featured content from latest blog
  const featured = getFeaturedBlog();

  // Lọc và sắp xếp blog
  const getFilteredBlogs = () => {
    if (selectedBlogCategory === "Tất cả") {
      return [...blogs].sort(
        (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
      );
    } else {
      return blogs
        .filter((b) => b.category === selectedBlogCategory)
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    }
  };

  // Fetch featured Matcha products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`, {
          params: {
            limit: 3,
          }
        });

        if (response.data && response.data.data) {
          setFeaturedProducts(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching Matcha products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const filteredBlogs = getFilteredBlogs();
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);

  // Reset page to 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [selectedBlogCategory]);

  // Get current page blogs
  const getCurrentPageBlogs = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBlogs.slice(startIndex, endIndex);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (page <= 3) {
        pageNumbers.push(2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pageNumbers.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push('...', page - 1, page, page + 1, '...', totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const handleProductClick = (slug) => {
    navigate(`/products/${slug}`);
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
              <FeaturedTitle>{featured.title}</FeaturedTitle>
              <ReadMoreBtn onClick={() => handleBlogClick(featured.id)}>
                READ MORE
              </ReadMoreBtn>
            </FeaturedContent>
          </FeaturedWrapper>
        </Section>
        <BlogListSection>
          <BlogGrid>
            {getCurrentPageBlogs().map((b, idx) => (
              <BlogCard key={idx}>
                <BlogImage
                  src={b.image}
                  alt={b.title}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBlogClick(b.id)}
                />
                <BlogCategory>{b.category}</BlogCategory>
                <BlogTitle
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBlogClick(b.id)}
                >
                  {b.title}
                </BlogTitle>
                <BlogDesc>{b.desc}</BlogDesc>
                <BlogReadMore onClick={() => handleBlogClick(b.id)}>
                  Read more
                </BlogReadMore>
              </BlogCard>
            ))}
          </BlogGrid>
          {totalPages > 1 && (
            <Pagination>
              <PageArrow
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                &larr;
              </PageArrow>
              {getPageNumbers().map((pageNum, idx) => (
                <PageNum
                  key={idx}
                  active={page === pageNum}
                  onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                  isEllipsis={pageNum === '...'}
                >
                  {pageNum}
                </PageNum>
              ))}
              <PageArrow
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                &rarr;
              </PageArrow>
            </Pagination>
          )}
        </BlogListSection>
        <ProductSection>
          <ProductTitle>MATCHA PREMIUM</ProductTitle>
          <ProductGrid>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id}>
                <ProductImage
                  src={`${BACKEND_URL}${product.images[0]}`}
                  alt={product.name}
                  onClick={() => handleProductClick(product.slug)}
                />
                <ProductName>{product.name}</ProductName>
                <ProductPrice>
                  Chỉ từ {product.price.toLocaleString()}đ
                </ProductPrice>
              </ProductCard>
            ))}
          </ProductGrid>
        </ProductSection>
      </PageWrapper>
    </>
  );
};

export default Blog;
