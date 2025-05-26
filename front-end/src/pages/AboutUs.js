import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';
import logoImg from '../assets/logo/logo1.png'
import logoImg2 from '../assets/logo/logo2.png'


const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const CTAButton = styled.button`
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #4a7c59, #2d5016);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease 0.6s both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(74, 124, 89, 0.3);
  }
`;

const Section = styled.section`
  padding-top: 160px;
  padding-bottom: 160px;
`;

const StorySection = styled(Section)`
  background-color: #f4f4f4;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, rgba(248, 253, 249, 0.5), transparent);
  }
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const StoryContent = styled.div`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? 0 : 30}px);
  transition: all 0.8s ease;

  h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #2d5016;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100px;
      height: 3px;
      background: linear-gradient(135deg, #4a7c59, #2d5016);
    }
  }
`;

const StoryText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #2c5530;
`;

const StoryImage = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transform: ${props => props.isVisible ? 'rotate(0deg) scale(1)' : 'rotate(2deg) scale(0.95)'};
  transition: transform 0.8s ease;
  opacity: ${props => props.isVisible ? 1 : 0};

  &:hover {
    transform: rotate(0deg) scale(1.02);
  }

  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    transform: none;
  }
`;

const ValuesSection = styled(Section)`
  background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
  color: white;
  position: relative;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? 0 : 30}px);
  transition: all 0.8s ease;

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.3rem;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`;

const ValueCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? 0 : 30}px);
  transition-delay: ${props => props.delay}s;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
  }

  .value-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    display: block;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.6;
  }
`;

const QualitySection = styled(Section)`
  background: #f4f4f4;
`;

const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QualityImage = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateX(${props => props.isVisible ? 0 : -30}px);
  transition: all 0.8s ease;

  img {
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
`;

const QualityFeatures = styled.div`
  display: grid;
  gap: 2rem;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateX(${props => props.isVisible ? 0 : 30}px);
  transition: all 0.8s ease;

  h2 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #2d5016;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fdf9;
  border-radius: 15px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 2rem;
    color: #4a7c59;
    margin-top: 0.2rem;
  }

  h4 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #2d5016;
  }

  p {
    color: #2c5530;
    line-height: 1.6;
  }
`;

const CTASection = styled(Section)`
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e8 100%);
  text-align: center;
`;

const CTAContent = styled.div`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? 0 : 30}px);
  transition: all 0.8s ease;

  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #2d5016;
  }

  p {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    color: #2c5530;
  }
`;

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[id^="section-"]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const valuesData = [
    {
      icon: "🌱",
      title: "Tự nhiên",
      description: "100% nguyên liệu tự nhiên, không chất bảo quản, không phẩm màu nhân tạo. An toàn cho sức khỏe."
    },
    {
      icon: "⭐",
      title: "Chất lượng",
      description: "Tiêu chuẩn xuất khẩu Nhật Bản, từ khâu chọn lá đến quy trình chế biến đều được kiểm soát nghiêm ngặt."
    },
    {
      icon: "🎯",
      title: "Truyền thống",
      description: "Kế thừa và phát huy nghề truyền thống chế biến matcha Kyoto với hơn 400 năm lịch sử."
    }
  ];

  const featuresData = [
    {
      icon: "🏆",
      title: "Nguồn gốc rõ ràng",
      description: "Trực tiếp từ các vườn trà danh tiếng tại Uji, Kyoto - nơi sản xuất matcha hảo hạng nhất Nhật Bản."
    },
    {
      icon: "🔬",
      title: "Công nghệ hiện đại",
      description: "Kết hợp phương pháp truyền thống với công nghệ hiện đại để bảo toàn hương vị và dinh dưỡng."
    },
    {
      icon: "🌿",
      title: "Giàu dinh dưỡng",
      description: "Chứa nhiều chất chống oxy hóa, vitamin, và amino acid L-theanine tốt cho sức khỏe."
    },
    {
      icon: "📦",
      title: "Bao bì cao cấp",
      description: "Đóng gói kín khít, chống oxy hóa, bảo quản hương vị tươi ngon như ban đầu."
    }
  ];

  return (
    <>
      <GlobalStyle />



      <StorySection id="section-story">
        <Container>
          <StoryGrid>
            <StoryContent isVisible={visibleSections['section-story']}>
              <h2>Câu chuyện của chúng tôi</h2>
              <StoryText>
                Từ những vườn trà cổ kính tại Kyoto, KyoMatcha ra đời với sứ mệnh mang đến cho bạn hương vị matcha thuần khiết nhất. Chúng tôi kế thừa nghề trồng và chế biến trà truyền thống Nhật Bản qua nhiều thế hệ.
              </StoryText>
              <StoryText>
                Mỗi lá trà được chăm sóc tỉ mỉ, thu hoạch vào đúng thời điểm và xay mịn theo phương pháp truyền thống để tạo ra bột matcha có màu xanh tươi và hương vị đậm đà đặc trưng.
              </StoryText>
              <StoryText>
                KyoMatcha không chỉ là thức uống, mà còn là cầu nối văn hóa, mang đến cho bạn trải nghiệm trà đạo Nhật Bản ngay tại Việt Nam.
              </StoryText>
            </StoryContent>
            <StoryImage isVisible={visibleSections['section-story']}>
              <img src={logoImg} alt="Trà Matcha Kyoto" />
            </StoryImage>
          </StoryGrid>
        </Container>
      </StorySection>

      <ValuesSection id="section-values">
        <Container>
          <SectionTitle isVisible={visibleSections['section-values']}>
            <h2>Giá trị cốt lõi</h2>
            <p>Những nguyên tắc định hướng hành động của chúng tôi</p>
          </SectionTitle>
          <ValuesGrid>
            {valuesData.map((value, index) => (
              <ValueCard
                key={index}
                isVisible={visibleSections['section-values']}
                delay={index * 0.2}
              >
                <span className="value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Container>
      </ValuesSection>

      <QualitySection id="section-quality">
        <Container>
          <QualityGrid>
            <QualityImage isVisible={visibleSections['section-quality']}>
              <img src={logoImg2} alt="Chất lượng Matcha" />
            </QualityImage>
            <QualityFeatures isVisible={visibleSections['section-quality']}>
              <h2>Tại sao chọn KyoMatcha?</h2>
              {featuresData.map((feature, index) => (
                <FeatureItem key={index}>
                  <span className="feature-icon">{feature.icon}</span>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </FeatureItem>
              ))}
            </QualityFeatures>
          </QualityGrid>
        </Container>
      </QualitySection>

      <CTASection id="section-cta">
        <Container>
          <CTAContent isVisible={visibleSections['section-cta']}>
            <h2>Trải nghiệm KyoMatcha ngay hôm nay</h2>
            <p>Khám phá hương vị tinh túy của trà xanh Kyoto</p>
            <CTAButton>Đặt mua ngay</CTAButton>
          </CTAContent>
        </Container>
      </CTASection>
    </>
  );
};

export default AboutUs;