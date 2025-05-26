import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import GlobalStyle from '../components/GlobalStyle';

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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%234a7c59;stop-opacity:0.8"/><stop offset="100%" style="stop-color:%232c5530;stop-opacity:0.9"/></linearGradient></defs><rect width="1200" height="600" fill="url(%23bg)"/><path d="M0,300 Q300,200 600,300 T1200,250 L1200,600 L0,600 Z" fill="rgba(255,255,255,0.1)"/></svg>') center/cover;
  padding: 200px 0 4rem;
  text-align: center;
  color: white;
  margin-bottom: 2rem;
`;

const HeroContent = styled.div`
  background: rgba(0,0,0,0.3);
  padding: 3rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  max-width: 700px;
  margin: 0 auto;
  animation: ${fadeInUp} 1s ease forwards;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 400;
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.8;
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
  opacity: ${props => props.visible ? 1 : 0};
  animation: ${props => props.visible ? fadeInUp : 'none'} 0.8s ease forwards;
  animation-delay: ${props => props.index * 0.2}s;
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
  background: white;
  margin: 3rem 0;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #2c5530;
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
    background: linear-gradient(to right, #4a7c59, #2c5530);
  }
`;

const TeaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

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

const TeaIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #4a7c59;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
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

const PhilosophyText = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
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
      date: "1191",
      title: "Eisai và Trà Matcha",
      content: "Thiền sư Eisai được coi là người đã mang trà matcha từ Trung Quốc về Nhật Bản. Ông viết cuốn sách \"Kissa Yōjōki\" (Uống trà để dưỡng sinh), khẳng định lợi ích sức khỏe của việc uống trà."
    },
    {
      date: "Thế kỷ 15",
      title: "Sự Phát Triển của Trà Đạo",
      content: "Dưới thời Muromachi, việc uống trà dần trở thành một nghệ thuật tinh tế. Các nhà quý tộc bắt đầu tổ chức những buổi tiệc trà với nhiều nghi thức phức tạp."
    },
    {
      date: "1522-1591",
      title: "Sen no Rikyū - Cha Thánh",
      content: "Sen no Rikyū được tôn vinh là bậc thầy trà đạo vĩ đại nhất. Ông đã thiết lập các nguyên tắc cơ bản của trà đạo: \"Wa, Kei, Sei, Jaku\" (Hòa, Kính, Thanh, Tịch) và tạo ra phong cách trà đạo wabi-sabi."
    },
    {
      date: "Thế kỷ 17",
      title: "Sự Ra Đời của Sencha",
      content: "Trà sencha được phát triển như một phương pháp pha trà mới, khác biệt với matcha truyền thống. Điều này tạo ra một văn hóa trà đa dạng hơn trong xã hội Nhật Bản."
    },
    {
      date: "1738",
      title: "Phát Minh Trà Gyokuro",
      content: "Yamamoto Kahei phát minh ra phương pháp sản xuất trà gyokuro bằng cách che bóng cây trà trước khi thu hoạch, tạo ra loại trà có hương vị đậm đà và ngọt ngào đặc biệt."
    }
  ];

  const teaTypes = [
    {
      icon: "🍵",
      name: "Matcha",
      description: "Trà xanh dạng bột mịn, được sử dụng trong trà đạo truyền thống. Có vị đắng nhẹ và màu xanh đặc trưng."
    },
    {
      icon: "🌿",
      name: "Sencha",
      description: "Loại trà xanh phổ biến nhất Nhật Bản, có hương vị tươi mát và thanh đạm."
    },
    {
      icon: "✨",
      name: "Gyokuro",
      description: "Được coi là \"hạt ngọc trai lỏng\", là loại trà cao cấp nhất với hương vị ngọt ngào tinh tế."
    },
    {
      icon: "🍃",
      name: "Genmaicha",
      description: "Trà xanh pha trộn với gạo rang, tạo nên hương vị đặc biệt và thơm ngon."
    },
    {
      icon: "🌸",
      name: "Hojicha",
      description: "Trà xanh được rang tạo màu nâu đỏ, có hương vị ấm áp và ít caffeine."
    },
    {
      icon: "🫖",
      name: "Bancha",
      description: "Trà thường ngày của người Nhật, có vị nhẹ nhàng và dễ uống."
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
            <HeroTitle>Lịch Sử Trà Nhật Bản</HeroTitle>
            <HeroSubtitle>Hành trình nghìn năm của văn hóa trà đạo</HeroSubtitle>
            <HeroDescription>
              Từ những chiếc lá trà đầu tiên được du nhập từ Trung Quốc đến việc hình thành nên một nền văn hóa độc đáo,
              trà Nhật Bản đã trải qua một hành trình lịch sử đầy thú vị.
            </HeroDescription>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container>
        <Timeline>
          {timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              data-timeline-item
              data-index={index}
              visible={visibleItems.includes(index)}
              index={index}
            >
              <TimelineDate>{item.date}</TimelineDate>
              <TimelineContent position={index % 2 === 0 ? 'left' : 'right'}>
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineText>{item.content}</TimelineText>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <Section>
          <SectionTitle>Các Loại Trà Nhật Bản Nổi Tiếng</SectionTitle>
          <TeaGrid>
            {teaTypes.map((tea, index) => (
              <TeaCard key={index}>
                <TeaIcon>{tea.icon}</TeaIcon>
                <TeaTitle>{tea.name}</TeaTitle>
                <TeaDescription>{tea.description}</TeaDescription>
              </TeaCard>
            ))}
          </TeaGrid>
        </Section>

        <Section>
          <SectionTitle>Triết Lý Trà Đạo</SectionTitle>
          <PhilosophyText>
            Trà đạo Nhật Bản không chỉ đơn thuần là việc pha và thưởng thức trà, mà là một con đường tu luyện tinh thần,
            giúp con người tìm về sự bình an nội tâm và kết nối sâu sắc với thiên nhiên.
            Qua mỗi động tác, mỗi nghi thức, trà đạo dạy chúng ta về sự tôn trọng, khiêm nhường và trân trọng từng khoảnh khắc trong cuộc sống.
          </PhilosophyText>
        </Section>
      </Container>
    </>
  );
};

export default History;