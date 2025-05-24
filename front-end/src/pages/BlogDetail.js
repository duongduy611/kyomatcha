import React from 'react';
import styled from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';

const Wrapper = styled.div`
  padding-top: 160px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 420px;
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
const MainImg = styled.img`
  width: 60%;
  border-radius: 8px;
  margin-bottom: 24px;
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

const ProductSection = styled.div`
  padding: 60px 0;
`;
const SliderTitle = styled.h2`
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #6d6a4f;
  font-weight: 500;
  margin-bottom: 32px;
`;
const ProductWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 60px;
`;
const ProductCard = styled.div`
  width: 250px;
  text-align: center;
`;
const ProductImg = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
`;
const ProductName = styled.div`
  font-size: 16px;
  color: #3a3a2a;
  margin-bottom: 4px;
`;
const ProductRating = styled.div`
  color: #e6b800;
  font-weight: 600;
  font-size: 15px;
`;
const ProductReview = styled.span`
  color: #7a7a3a;
  font-weight: 400;
`;
const ProductPrice = styled.div`
  color: #e74c3c;
  font-weight: 600;
  font-size: 16px;
`;
const ProductOldPrice = styled.span`
  color: #7a7a3a;
  text-decoration: line-through;
  font-weight: 400;
`;

const BlogDetail = () => {
  return (
    <>
      <GlobalStyle />
      <Wrapper>

      {/* Banner đầu trang */}
      <Banner>
        <BannerImg src="//matchaya.sg/cdn/shop/articles/IMG_3773_1200x.jpg?v=1742391264" alt="Banner" />
        <BannerOverlay>
          <BannerDate>MARCH 19, 2025 &nbsp; • &nbsp; MOBILE TEA BAR</BannerDate>
          <BannerTitle>KEYSIGHT X MATCHAYA | MOBILE TEA BAR</BannerTitle>
        </BannerOverlay>
      </Banner>

      {/* Nội dung chính */}
      <MainContent>
        <MainImg src="http://cdn.shopify.com/s/files/1/0081/8734/7026/files/IMG_3717.jpg?v=1742390812" alt="Mobile Tea Bar" />
        <MainDesc>
          After a great event at Keysight's carnival last year, we're excited to be back with another Mobile Tea Bar activation!
        </MainDesc>
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

      {/* Chia sẻ mạng xã hội */}
      <SocialShare>
        <SocialBtn><SocialIcon className="fab fa-facebook-f" /></SocialBtn>
        <SocialBtn><SocialIcon className="fab fa-twitter" /></SocialBtn>
        <SocialBtn><SocialIcon className="fab fa-pinterest-p" /></SocialBtn>
      </SocialShare>

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
      <SliderTitle>SHOP NOW</SliderTitle>
        <ProductWrapper>
          <ProductCard>
            <ProductImg src="https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658" alt="A Tea Gathering" />
            <ProductName>A TEA GATHERING</ProductName>
            <ProductRating>★ 4.9 <ProductReview>(56)</ProductReview></ProductRating>
            <ProductPrice>$11 <ProductOldPrice>$12</ProductOldPrice></ProductPrice>
          </ProductCard>
          <ProductCard>
            <ProductImg src="https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658" alt="A Tea Gathering for 2 + Warabi Mochi" />
            <ProductName>A TEA GATHERING FOR 2 + WARABI MOCHI</ProductName>
            <ProductRating>★ 4.8 <ProductReview>(37)</ProductReview></ProductRating>
          </ProductCard>
          <ProductCard>
            <ProductImg src="https://matchaya.sg/cdn/shop/products/DualColdDrinks_400x.png?v=1629609658" alt="Winter's Here" />
            <ProductName>WINTER'S HERE</ProductName>
            <ProductRating>★ 4.7 <ProductReview>(29)</ProductReview></ProductRating>
            <ProductPrice>$45 <ProductOldPrice>$48</ProductOldPrice></ProductPrice>
          </ProductCard>
        </ProductWrapper>
      </ProductSection>
    </Wrapper>
    </>
  );
};

export default BlogDetail;