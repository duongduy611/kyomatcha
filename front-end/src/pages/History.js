import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';
import banner2 from '../assets/images/about-us/banner-2-history.jpg';
import banner1 from '../assets/images/about-us/banner-1.jpg';
import banner3 from '../assets/images/about-us/tra-dao.jpg';

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

const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.3);
  z-index: 1000;
`;

const ScrollProgress = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const HeroSection = styled.section`
  width: 100%;
  min-height: 400px;
  background: linear-gradient(rgba(30,40,30,0.6),rgba(30,40,30,0.6)), url('${banner2}') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  position: relative;
  margin-top: 80px;

  @media (max-width: 768px) {
    margin-top: 100px;
  }
`;

const HeroContent = styled.div`
  padding: 3rem;
  max-width: 700px;
  margin: 0 auto;
  animation: ${fadeInUp} 1s ease forwards;
`;

const HeroTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 400;
`;

const Timeline = styled.div`
  position: relative;
  padding: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #4a7c59, #2c5530);
    transform: translateX(-50%);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled.div`
  position: relative;
  margin: 3rem 0;
  opacity: 1;
`;

const TimelineContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  position: relative;
  width: 45%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  ${props => props.position === 'left' ? `
    margin-left: 55%;
  ` : `
    margin-right: 55%;
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    width: calc(100% - 60px);
    margin-left: 60px !important;
    margin-right: 0 !important;
  }
`;

const TimelineDate = styled.div`
  position: absolute;
  left: 50%;
  top: 2rem;
  transform: translateX(-50%);
  background: #4a7c59;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 10;

  @media (max-width: 768px) {
    left: 20px;
    transform: none;
  }
`;

const TimelineTitle = styled.h3`
  color: #2c5530;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;

const TimelineText = styled.p`
  color: #666;
  line-height: 1.8;
`;

const Section = styled.section`
  padding: 0 2rem 3rem 2rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #fff;
  font-size: 2rem;
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: #fff;
  }
`;

const TeaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeaCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: #4a7c59;
  }
`;

const TeaImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: block;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  background: #f8f9fa;
`;

const TeaTitle = styled.h4`
  color: #2c5530;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const TeaDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const PhilosophySection = styled.section`
  width: 100%;
  min-height: 400px;
  background: linear-gradient(rgba(30,40,30,0.6),rgba(30,40,30,0.6)), url('${banner3}') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  position: relative;
  padding: 60px 0 80px 0;
`;
const PhilosophyText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 2;
`;

const PhilosophyTextWhite = styled(PhilosophyText)`
  color: #fff;
`;

const History = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const timelineItems = document.querySelectorAll('[data-timeline-item]');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const timelineData = [
    {
      date: "Thế kỷ 9",
      title: "Sự Du Nhập Đầu Tiên",
      content: "Trà được du nhập vào Nhật Bản lần đầu tiên bởi các nhà sư Phật giáo từ Trung Quốc. Họ mang theo hạt giống trà và kiến thức về cách pha chế, chủ yếu để sử dụng trong các nghi lễ tôn giáo và thiền định."
    },
    {
      date: "Năm 1191",
      title: "Eisai và Trà Matcha",
      content: "Thiền sư Eisai được coi là người đã mang trà matcha từ Trung Quốc về Nhật Bản. Ông viết cuốn sách \"Kissa Yōjōki\" (Uống trà để dưỡng sinh), khẳng định lợi ích sức khỏe của việc uống trà."
    },
    {
      date: "Thế kỷ 15",
      title: "Sự Phát Triển của Trà Đạo",
      content: "Dưới thời Muromachi, việc uống trà dần trở thành một nghệ thuật tinh tế. Các nhà quý tộc bắt đầu tổ chức những buổi tiệc trà với nhiều nghi thức phức tạp."
    },
    {
      date: "Năm 1522",
      title: "Sen no Rikyū - Cha Thánh",
      content: "Sen no Rikyū được tôn vinh là bậc thầy trà đạo vĩ đại nhất. Ông đã thiết lập các nguyên tắc cơ bản của trà đạo: \"Wa, Kei, Sei, Jaku\" (Hòa, Kính, Thanh, Tịch) và tạo ra phong cách trà đạo wabi-sabi."
    },
    {
      date: "Thế kỷ 17",
      title: "Sự Ra Đời của Sencha",
      content: "Trà sencha được phát triển như một phương pháp pha trà mới, khác biệt với matcha truyền thống. Điều này tạo ra một văn hóa trà đa dạng hơn trong xã hội Nhật Bản."
    },
    {
      date: "Năm 1738",
      title: "Phát Minh Trà Gyokuro",
      content: "Yamamoto Kahei phát minh ra phương pháp sản xuất trà gyokuro bằng cách che bóng cây trà trước khi thu hoạch, tạo ra loại trà có hương vị đậm đà và ngọt ngào đặc biệt."
    }
  ];

  const teaTypes = [
    {
      image: require('../assets/images/teas/matcha.jpg'),
      name: 'Matcha',
      description: 'Trà xanh dạng bột mịn, được sử dụng trong trà đạo truyền thống. Có vị đắng nhẹ và màu xanh đặc trưng.'
    },
    {
      image: require('../assets/images/teas/sencha.jpg'),
      name: 'Sencha',
      description: 'Loại trà xanh phổ biến nhất Nhật Bản, có hương vị tươi mát và thanh đạm.'
    },
    {
      image: require('../assets/images/teas/gyokuro.jpg'),
      name: 'Gyokuro',
      description: 'Được coi là "hạt ngọc trai lỏng", là loại trà cao cấp nhất với hương vị ngọt ngào tinh tế.'
    },
    {
      image: require('../assets/images/teas/genmaicha.jpg'),
      name: 'Genmaicha',
      description: 'Trà xanh pha trộn với gạo rang, tạo nên hương vị đặc biệt và thơm ngon.'
    },
    {
      image: require('../assets/images/teas/hojicha.jpg'),
      name: 'Hojicha',
      description: 'Trà xanh được rang tạo màu nâu đỏ, có hương vị ấm áp và ít caffeine.'
    },
    {
      image: require('../assets/images/teas/bancha.jpg'),
      name: 'Bancha',
      description: 'Trà thường ngày của người Nhật, có vị nhẹ nhàng và dễ uống.'
    }
  ];

  return (
    <>
      <GlobalStyle />
      <ScrollIndicator>
        <ScrollProgress width={scrollProgress} />
      </ScrollIndicator>

      <HeroSection>
        <Container>
          <HeroContent>
            <HeroTitle>LỊCH SỬ TRÀ NHẬT BẢN</HeroTitle>
            <HeroSubtitle>Hành trình nghìn năm của văn hóa trà đạo</HeroSubtitle>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container>
        <Timeline>
          {timelineData.map((item, index) => (
            <TimelineItem key={index} data-timeline-item data-index={index}>
              <TimelineDate>{item.date}</TimelineDate>
              <TimelineContent position={index % 2 === 0 ? 'left' : 'right'}>
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineText>{item.content}</TimelineText>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <Section>
          <SectionTitle style={{color: 'black', marginTop: '2rem'}}>Các Loại Trà Nhật Bản Nổi Tiếng</SectionTitle>
          <TeaGrid>
            {teaTypes.map((tea, index) => (
              <TeaCard key={index}>
                <TeaImage src={tea.image} alt={tea.name} />
                <TeaTitle>{tea.name}</TeaTitle>
                <TeaDescription>{tea.description}</TeaDescription>
              </TeaCard>
            ))}
          </TeaGrid>
        </Section>
      </Container>
      <PhilosophySection>
        <SectionTitle>Triết Lý Trà Đạo</SectionTitle>
        <PhilosophyTextWhite>
          Trà đạo Nhật Bản không chỉ đơn thuần là việc pha và thưởng thức trà, mà là một con đường tu luyện tinh thần,
          giúp con người tìm về sự bình an nội tâm và kết nối sâu sắc với thiên nhiên.
          Qua mỗi động tác, mỗi nghi thức, trà đạo dạy chúng ta về sự tôn trọng, khiêm nhường và trân trọng từng khoảnh khắc trong cuộc sống.
        </PhilosophyTextWhite>
      </PhilosophySection>
    </>
  );
};

export default History;