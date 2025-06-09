import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { blogs } from '../data/blogs';

const BlogDetailWrapper = styled.div`
  min-height: 100vh;
`;

const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BannerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1);
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1));
  z-index: 1;
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
`;

const BannerCategory = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;
`;

const BannerTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
  font-family: 'Times New Roman', serif;
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const BannerMeta = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  span {
    margin: 0 8px;
  }
`;

const ContentSection = styled.div`
  max-width: 2000px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 40px;
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MetaInfo = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const CategoryTag = styled.div`
  color: #527328;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
`;

const DateInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.3;
  color: #333;
  font-family: 'Times New Roman', serif;
  margin-bottom: 15px;
`;

const AuthorInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const AuthorName = styled.span`
  color: #333;
  font-weight: 600;
`;

const MiddleColumn = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const ShareSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ShareText = styled.span`
  font-weight: 600;
  color: #333;
`;

const ShareButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  text-decoration: none;
  color: white;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.facebook {
    background: #3b5998;
  }

  &.twitter {
    background: #1da1f2;
  }
`;

const ArticleContent = styled.div`
  padding: 20px;
`;

const Summary = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 25px;
  font-style: italic;
  padding: 20px;
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
`;

const ContentText = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 25px;

  p {
    margin-bottom: 18px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 30px 0 15px;
    color: #333;
  }

  ul {
    margin: 15px 0;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
    }
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin: 20px 0;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SidebarSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const SidebarTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
  font-family: 'Times New Roman', serif;
  font-style: italic;
`;

const RelatedArticle = styled.a`
  display: flex;
  gap: 15px;
  text-decoration: none;
  color: inherit;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9f9f9;
    margin: 0 -15px;
    padding: 15px;
    border-radius: 4px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RelatedImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const RelatedContent = styled.div`
  flex: 1;
`;

const RelatedTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 8px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RelatedMeta = styled.div`
  font-size: 0.8rem;
  color: #999;
`;

const RelatedCategory = styled.div`
  font-size: 0.75rem;
  color: #e74c3c;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const currentBlog = blogs.find(b => b.slug === slug);
    if (currentBlog) {
      setBlog(currentBlog);
      // Get related blogs from same category
      const related = blogs
        .filter(b => b.category === currentBlog.category && b.slug !== currentBlog.slug)
        .slice(0, 3);
      console.log('relatedBlogs:', related);
      setRelatedBlogs(related);
    }
  }, [slug]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  return (
    <BlogDetailWrapper>
      <Banner>
        <BannerImage src={blog.thumbnailUrl} alt={blog.title} />
        <BannerOverlay />
        {/* <BannerContent>
          <BannerCategory>{blog.category}</BannerCategory>
          <BannerTitle>{blog.title}</BannerTitle>
          <BannerMeta>
            <span>By {blog.author}</span>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
          </BannerMeta>
        </BannerContent> */}
      </Banner>

      <ContentSection>
        <LeftColumn>
          <MetaInfo>
            <CategoryTag>{blog.category}</CategoryTag>
            <DateInfo>{formatDate(blog.createdAt)}</DateInfo>
            <Title>{blog.title}</Title>
            <AuthorInfo>
              By <AuthorName>{blog.author}</AuthorName>
            </AuthorInfo>
          </MetaInfo>
        </LeftColumn>

        <MiddleColumn>
          <ShareSection>
            <ShareText>Chia sẻ</ShareText>
            <ShareButton href="#" className="facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </ShareButton>
            <ShareButton href="#" className="twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </ShareButton>
          </ShareSection>

          <ArticleContent>
            <Summary>{blog.summary}</Summary>

            <ContentText>
              {blog.content.map((paragraph, index) => {
                if (typeof paragraph === "string") {
                  return <p key={index}>{paragraph}</p>;
                }
                if (typeof paragraph === "object" && paragraph !== null) {
                  return (
                    <div key={index}>
                      {paragraph.content && <p>{paragraph.content}</p>}
                      {paragraph.image && <img src={paragraph.image} alt="" style={{ maxWidth: '100%', margin: '16px 0' }} />}
                    </div>
                  );
                }
                return null;
              })}

              {blog.ingredients && blog.ingredients.length > 0 && (
                <>
                  <h2>Nguyên liệu</h2>
                  {blog.ingredients.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      {item.ingredient && Array.isArray(item.ingredient) && (
                        <ul>
                          {item.ingredient.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      )}
                      {item.image && (
                        <img src={item.image} alt="Nguyên liệu" style={{ maxWidth: '100%', margin: '8px 0' }} />
                      )}
                    </div>
                  ))}
                </>
              )}

              {blog.directions && blog.directions.length > 0 && (
                <>
                  <h2>Hướng dẫn thực hiện</h2>
                  <ul>
                    {blog.directions.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '16px' }}>
                        {item.step && <span>{item.step}</span>}
                        {item.image && (
                          <div>
                            <img src={item.image} alt="Bước thực hiện" style={{ maxWidth: '100%', margin: '8px 0' }} />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </ContentText>

            <ArticleImage src={blog.thumbnailUrl} alt={blog.title} />
          </ArticleContent>
        </MiddleColumn>

        <RightColumn>
          {relatedBlogs.length > 0 && (
            <SidebarSection>
              <SidebarTitle>Bài viết phổ biến</SidebarTitle>
              {relatedBlogs.map((related, index) => (
                <RelatedArticle key={related.slug} href={`/blogs/${related.slug}`}>
                  <RelatedImage src={related.thumbnailUrl} alt={related.title} />
                  <RelatedContent>
                    <RelatedCategory>{related.category}</RelatedCategory>
                    <RelatedTitle>{related.title}</RelatedTitle>
                    <RelatedMeta>{formatDate(related.createdAt)}</RelatedMeta>
                  </RelatedContent>
                </RelatedArticle>
              ))}
            </SidebarSection>
          )}
        </RightColumn>
      </ContentSection>
    </BlogDetailWrapper>
  );
};

export default BlogDetail;