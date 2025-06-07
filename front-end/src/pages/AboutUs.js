import React from "react";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import banner1 from "../assets/images/about-us/about-us-banner-1.png";
import plantImg from "../assets/images/about-us/green-matcha.jpg"; // Thay bằng ảnh thật nếu có
import avatarImg from "../assets/images/ceo/ceo-ntpthao.jpg"; // Thay bằng ảnh thật nếu có
import missionImg from "../assets/images/about-us/matcha-green.jpg"; // Thay bằng ảnh thật nếu có
import banner2 from "../assets/images/about-us/about-us-banner-2.jpg"; // Thay bằng ảnh thật nếu có
import { FaCheckCircle } from "react-icons/fa";
import { FaCube } from "react-icons/fa";

const Banner = styled.section`
  margin-top: 100px;
  width: 100%;
  min-height: 500px;
  background: linear-gradient(rgba(30, 40, 30, 0.5), rgba(30, 40, 30, 0.1)),
    url("${banner1}") center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  position: relative;
`;

const BannerLabel = styled.div`
  letter-spacing: 2px;
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
  opacity: 0.8;
`;

const BannerTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.1;
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const ContentSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0 80px 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  max-width: 1100px;
  width: 100%;
  gap: 60px;
  align-items: flex-start;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
`;

const LeftImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 320px;
  img {
    width: 300px;
    max-width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background: #eee;
  }
`;

const RightContent = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 320px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #222;
`;

const SectionDesc = styled.p`
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 1.2rem;
  line-height: 1.7;
`;

const Quote = styled.blockquote`
  font-style: italic;
  color: #666;
  border-left: 3px solid #4a7c59;
  margin: 1.5rem 0 1rem 0;
  padding-left: 1rem;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.2rem;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-weight: 600;
    color: #222;
    font-size: 1rem;
  }
  small {
    color: #888;
    font-size: 0.95rem;
  }
`;

const ValuesSection = styled.section`
  background: #f2f7db;
  padding: 60px 0 80px 0;
  width: 100%;
`;

const ValuesTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  color: #222;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem 2rem;
  max-width: 1100px;
  margin: 0 auto;
`;

const ValueItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
`;

const ValueIcon = styled.div`
  background: #222;
  color: #fff;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ValueContent = styled.div`
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
    color: #222;
  }
  p {
    font-size: 0.98rem;
    color: #444;
    margin: 0;
    line-height: 1.5;
  }
`;

const coreValues = [
  {
    title: "Đam mê với công việc",
    desc: "Đam mê với công việc là sự hào hứng và thú vị với những gì bạn làm.",
  },
  {
    title: "Đội ngũ thiết kế sáng tạo",
    desc: "Đội ngũ thiết kế sáng tạo là đội ngũ thiết kế và thực hiện chiến dịch và khuyến khích.",
  },
  {
    title: "Giải pháp sáng tạo",
    desc: "Giải pháp sáng tạo là sử dụng các ý tưởng hoàn toàn mới hoặc tìm cách sử dụng lại các ý tưởng hiện có.",
  },
  {
    title: "Chất lượng sản phẩm",
    desc: "Chất lượng sản phẩm là chất lượng của sản phẩm đáp ứng nhu cầu của khách hàng.",
  },
  {
    title: "Sự hài lòng của khách hàng",
    desc: "Khách hàng hài lòng là khách hàng được phục vụ tốt.",
  },
  {
    title: "Đơn giản hóa giao diện",
    desc: "Đơn giản hóa giao diện là cần thiết để giảm thiểu quá trình.",
  },
];

const MissionSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 60px 0 80px 0;
`;

const MissionWrapper = styled.div`
  display: flex;
  max-width: 1300px;
  width: 100%;
  gap: 60px;
  align-items: center;
  @media (max-width: 900px) {
    flex-direction: column-reverse;
    gap: 30px;
    align-items: center;
  }
`;

const MissionLeft = styled.div`
  flex: 2;
  min-width: 320px;
`;

const MissionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: #222;
`;

const MissionDesc = styled.p`
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 2.2rem;
  line-height: 1.7;
`;

const MissionBullets = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem 2.5rem;
  max-width: 500px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MissionBullet = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #222;
  gap: 0.6rem;
  margin-bottom: 0.2rem;
  svg {
    color: #6bbf4e;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

const MissionRight = styled.div`
  flex: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 600px;
  img {
    width: 600px;
    max-width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background: #eee;
  }
`;

const CTASection = styled.section`
  width: 100%;
  min-height: 400px;
  background: linear-gradient(rgba(30, 40, 30, 0.6), rgba(30, 40, 30, 0.6)),
    url("${banner2}") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  position: relative;
`;

const CTATitle = styled.h2`
  font-size: 2.3rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
`;

const CTADesc = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const CTAButton = styled.a`
  background: #4a7c59;
  color: #fff;
  border: 2px solid #4a7c59;
  padding: 14px 38px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  font-family: "Montserrat", sans-serif;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: transparent;
    color: #fff;
    border: 2px solid #fff;
  }
`;

const AboutUs = () => (
  <>
    <GlobalStyle />
    <Banner>
      <BannerTitle>
        VỀ KYOMATCHA
      </BannerTitle>
    </Banner>
    <ContentSection>
      <ContentWrapper>
        <LeftImage>
          <img src={plantImg} alt="" />
        </LeftImage>
        <RightContent>
          <SectionTitle>
            Chúng tôi nỗ lực cung cấp cho khách hàng chất lượng cao nhất
          </SectionTitle>
          <SectionDesc>
            KyoMatcha được thành lập vào năm 2025 bởi những tâm hồn yêu trà và
            tin vào giá trị sâu sắc mà matcha mang lại cho cuộc sống hiện đại.
            Với khả năng thanh lọc, giảm căng thẳng và nuôi dưỡng sự tĩnh tại,
            matcha không chỉ là một thức uống – mà là một lối sống, một nghi
            thức chăm sóc bản thân đầy ý nghĩa.
          </SectionDesc>
          <Quote>
            "Chúng tôi yêu những gì mình làm – và luôn đồng hành cùng khách hàng
            trong hành trình trải nghiệm matcha, để tạo nên những thay đổi bền
            vững cho sức khỏe, tinh thần và phong cách sống."
          </Quote>
          <Author>
            <Avatar src={avatarImg} alt="Nguyen Thi Phuong Thao" />
            <AuthorInfo>
              <span>Nguyen Thi Phuong Thao</span>
              <small>CEO & Co-founder @ KyoMatcha</small>
            </AuthorInfo>
          </Author>
        </RightContent>
      </ContentWrapper>
    </ContentSection>
    <ValuesSection>
      <ValuesTitle>
        Giá trị cốt lõi mà chúng tôi tin tưởng
        <br />
        Mọi điều chúng tôi làm
      </ValuesTitle>
      <ValuesGrid>
        {coreValues.map((item, idx) => (
          <ValueItem key={idx}>
            <ValueIcon>
              <FaCube />
            </ValueIcon>
            <ValueContent>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </ValueContent>
          </ValueItem>
        ))}
      </ValuesGrid>
    </ValuesSection>

    {/* SECTION: Our Mission */}
    <MissionSection>
      <MissionWrapper>
        <MissionLeft>
          <MissionTitle>Sứ mệnh của chúng tôi</MissionTitle>
          <MissionDesc>
            Sứ mệnh của KyoMatcha là lan tỏa lối sống xanh và lành mạnh – bắt
            đầu từ một tách matcha mỗi ngày. Chúng tôi cam kết mang đến cho
            khách hàng những sản phẩm matcha chất lượng cao nhất, đi cùng kiến
            thức, cảm hứng và sự đồng hành tận tâm, để mỗi người đều có thể tìm
            thấy sự an yên và năng lượng tích cực trong từng khoảnh khắc thưởng
            trà.
          </MissionDesc>
          <MissionBullets>
            <MissionBullet>
              <FaCheckCircle /> Chất lượng và Đa dạng
            </MissionBullet>
            <MissionBullet>
              <FaCheckCircle /> Hướng dẫn chuyên sâu
            </MissionBullet>
            <MissionBullet>
              <FaCheckCircle /> Phát triển bền vững
            </MissionBullet>
            <MissionBullet>
              <FaCheckCircle /> Đội ngũ chuyên nghiệp
            </MissionBullet>
          </MissionBullets>
        </MissionLeft>
        <MissionRight>
          <img src={missionImg} alt="Mission plant" />
        </MissionRight>
      </MissionWrapper>
    </MissionSection>

    {/* SECTION: CTA Banner */}
    <CTASection>
      <div>
        <CTATitle>Sẵn sàng tìm kiếm tách Matcha hoàn hảo của bạn?</CTATitle>
        <CTADesc>
          Khám phá cửa hàng trực tuyến của chúng tôi hoặc ghé thăm trực tiếp để
          cảm nhận trọn vẹn vẻ đẹp tinh túy mà thiên nhiên ban tặng qua từng
          tách matcha.
        </CTADesc>
        <CTAButton href="/products">Mua hàng</CTAButton>
      </div>
    </CTASection>
  </>
);

export default AboutUs;
