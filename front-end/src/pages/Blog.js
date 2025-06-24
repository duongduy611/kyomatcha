import React from "react";
import styled from "styled-components";
import { blogs } from "../data/blogs";
import { Link } from "react-router-dom";

const BlogWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const LeftCol = styled.div`
  flex: 0 0 33.3333%; /* 4/12 */
  max-width: 33.3333%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px 40px 100px;
  @media (max-width: 1200px) {
    padding: 60px 24px 24px 40px;
  }
  @media (max-width: 900px) {
    padding: 32px 16px 0 16px;
    align-items: center;
    text-align: center;
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const RightCol = styled.div`
  flex: 0 0 66.6667%; /* 8/12 */
  max-width: 66.6667%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  @media (max-width: 900px) {
    padding: 0 0 32px 0;
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-family: "Vollkorn", serif;
  font-weight: 600;
  color: #23201b;
  margin-bottom: 32px;
  line-height: 1.2;
  @media (max-width: 600px) {
    font-size: 2.1rem;
  }
`;

const Description = styled.p`
  font-size: 1.18rem;
  color: #6b665b;
  margin-bottom: 40px;
  max-width: 480px;
  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const ReadButton = styled.a`
  display: inline-flex;
  align-items: center;
  color: #23201b;
  border: 1px solid #527328;
  border-radius: 5px;
  padding: 16px 32px;
  font-size: 1.15rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  &:hover {
    background: #527328;
    color: #fff;
    border-color: #527328;
  }
  svg {
    margin-left: 12px;
    font-size: 1.4em;
    transition: transform 0.2s;
  }
  &:hover svg {
    transform: translateX(4px);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  max-width: 1000px;
  height: 80%;
  border-radius: 10px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  object-fit: cover;
  @media (max-width: 900px) {
    width: 100%;
    max-width: 100vw;
    border-radius: 12px;
  }
`;

const Section = styled.section`
  width: 100%;
  padding: 60px 0 0 0;
  margin-top: 100px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 32px 100px;
  text-align: left;
  letter-spacing: 1px;
  @media (max-width: 900px) {
    margin-left: 16px;
    font-size: 1.5rem;
  }
`;

const BeautySection = styled.section`
  width: 100%;
  padding: 40px 100px;
  @media (max-width: 900px) {
    padding: 40px 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const BeautyTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #23201b;
  font-family: "Vollkorn", serif;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 33%);
  justify-content: center;
  gap: 32px;
  padding: 0 32px;
`;

const Card = styled.div`
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

const CardTitle = styled.h3`
  font-size: 1.4rem;
  color: #23201b;
  margin-bottom: 12px;
  font-family: "Vollkorn", serif;
  line-height: 1.4;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CardLink= styled(Link)`
  text-decoration: none;
  &:hover ${CardTitle}{
    text-decoration: underline;
  }
`

const CardImageWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const CardMeta = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #23201b;
  margin-bottom: 8px;
  span {
    color: #527328;
  }
`;


const CardDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const Blog = () => {
  // Filter blogs by category and sort by date
  const getLatestBlogsByCategory = (category) => {
    return blogs
      .filter((blog) => blog.category === category)
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, 3);
  };

  const beautyBlogs = getLatestBlogsByCategory("Làm đẹp");
  const brewingBlogs = getLatestBlogsByCategory("Pha chế");
  const explorationBlogs = getLatestBlogsByCategory("Khám phá");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  // Lấy blog đầu tiên của category Khám phá (hoặc bài đầu tiên toàn bộ nếu không có)
  const firstExplorationBlog = explorationBlogs[0] || blogs[0];

  return (
    <>
      <Section>
        <SectionTitle>BÀI VIẾT</SectionTitle>
        <BlogWrapper>
          <LeftCol>
            <Title>
              Chương trình
              <br />
              "Khám Phá Matcha - Sống Xanh Từ Lá Trà" năm 2025
            </Title>
            <Description>
              Bắt đầu từ ngày 10/5, chương trình "Khám Phá Matcha - Sống Xanh Từ
              Lá Trà" chính thức được phát động. Với hơn 160 điểm trải nghiệm
              trên toàn quốc, chương trình mang đến cho cộng đồng cơ hội tìm
              hiểu về quy trình trồng, chế biến và tận hưởng matcha nguyên chất.
              Chúng tôi hy vọng bạn sẽ cùng đồng hành để lan tỏa lối sống lành
              mạnh, yêu thiên nhiên và yêu từng lá trà xanh tinh khiết.
            </Description>
            <ReadButton
              as={Link}
              to={
                firstExplorationBlog
                  ? `/blogs/${firstExplorationBlog.slug}`
                  : "#"
              }
            >
              Đọc bài viết
              <span style={{ display: "inline-block", marginLeft: 8 }}>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </ReadButton>
          </LeftCol>
          <RightCol>
            <BlogImage
              src="https://i.pinimg.com/736x/6c/f7/b2/6cf7b2cc6d7a63e99b7f520ba3b33fb9.jpg"
              alt="Khám Phá Matcha"
            />
          </RightCol>
        </BlogWrapper>
      </Section>

      <BeautySection>
        <SectionHeader>
          <BeautyTitle>Làm đẹp</BeautyTitle>
          <ReadButton href="/blogs">
            Tất cả bài viết
            <span style={{ display: "inline-block", marginLeft: 8 }}>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </ReadButton>
        </SectionHeader>
        <CardContainer>
          {beautyBlogs.map((blog, index) => (
            <Card key={index}>
              <CardLink
                to={`/blogs/${blog.slug}`}
                style={{ textDecoration: "none" }}
              >
                <CardImageWrapper>
                  <CardImage src={blog.thumbnailUrl} alt={blog.title} />
                </CardImageWrapper>
                <CardMeta>
                  Làm đẹp | <span>{formatDate(blog.createdAt)}</span>
                </CardMeta>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>{blog.summary}</CardDescription>
              </CardLink>
            </Card>
          ))}
        </CardContainer>
      </BeautySection>

      <BeautySection>
        <SectionHeader>
          <BeautyTitle>Pha chế</BeautyTitle>
          <ReadButton href="/blogs">
            Tất cả bài viết
            <span style={{ display: "inline-block", marginLeft: 8 }}>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </ReadButton>
        </SectionHeader>
        <CardContainer>
          {brewingBlogs.map((blog, index) => (
            <Card key={index}>
              <CardLink
                to={`/blogs/${blog.slug}`}
                style={{ textDecoration: "none" }}
              >
                <CardImageWrapper>
                  <CardImage src={blog.thumbnailUrl} alt={blog.title} />
                </CardImageWrapper>
                <CardMeta>
                  Pha chế | <span>{formatDate(blog.createdAt)}</span>
                </CardMeta>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>{blog.summary}</CardDescription>
              </CardLink>
            </Card>
          ))}
        </CardContainer>
      </BeautySection>

      <BeautySection>
        <SectionHeader>
          <BeautyTitle>Khám phá</BeautyTitle>
          <ReadButton href="/blogs">
            Tất cả bài viết
            <span style={{ display: "inline-block", marginLeft: 8 }}>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </ReadButton>
        </SectionHeader>
        <CardContainer>
          {explorationBlogs.map((blog, index) => (
            <Card key={index}>
              <CardLink
                to={`/blogs/${blog.slug}`}
                style={{ textDecoration: "none" }}
              >
                <CardImageWrapper>
                  <CardImage src={blog.thumbnailUrl} alt={blog.title} />
                </CardImageWrapper>
                <CardMeta>
                  Khám phá | <span>{formatDate(blog.createdAt)}</span>
                </CardMeta>
                <CardTitle>{blog.title}</CardTitle>
                <CardDescription>{blog.summary}</CardDescription>
              </CardLink>
            </Card>
          ))}
        </CardContainer>
      </BeautySection>
    </>
  );
};

export default Blog;
