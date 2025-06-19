import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ComboDetail = () => {
  const { id } = useParams(); // SỬA: Lấy id từ params
  const [combo, setCombo] = useState(null);
  const [relatedCombos, setRelatedCombos] = useState([]); // SỬA: Đổi thành relatedCombos
  const [loading, setLoading] = useState(true);
  const [selectedMatcha, setSelectedMatcha] = useState(null); // SỬA: Thay thế subCategory bằng matcha
  const [quantity, setQuantity] = useState(1);
  const [allImages, setAllImages] = useState([]);
  const [currentMainImage, setCurrentMainImage] = useState(null);

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        setLoading(true);
        // SỬA: Thay đổi API endpoint để lấy combo theo ID
        const response = await axios.get(`${BACKEND_URL}/api/combo/${id}`);

        if (response.data && response.data.data) {
          const comboData = response.data.data; // Giả sử API trả về combo trong data.combo
          setCombo(comboData);
          setRelatedCombos(response.data.data.relatedCombos || []);

          // Kết hợp hình ảnh chính và hình ảnh của các loại matcha
          const mainImages = comboData.images
            ? comboData.images.map((img) => ({
                image: img,
                isMain: true,
                matchaData: null, // Không có dữ liệu matcha cho ảnh chính
              }))
            : [];

          // SỬA: Lấy hình ảnh từ mảng matcha
          const matchaImages = [];
          if (comboData.matcha && comboData.matcha.length > 0) {
            comboData.matcha.forEach((matchaItem) => {
              if (matchaItem.image) {
                matchaImages.push({
                  image: matchaItem.image,
                  isMain: false,
                  matchaData: matchaItem, // Lưu trữ toàn bộ object matcha
                });
              }
            });
          }

          const combinedImages = [...mainImages, ...matchaImages];
          setAllImages(combinedImages);

          // Đặt ảnh chính ban đầu
          if (comboData.images && comboData.images.length > 0) {
            setCurrentMainImage(comboData.images[0]);
          } else if (matchaImages.length > 0) {
            setCurrentMainImage(matchaImages[0].image);
          }

          // Reset các lựa chọn
          setSelectedMatcha(null);
          setQuantity(1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải combo:", error);
        setLoading(false);
      }
    };
    fetchCombo();
  }, [id]); // SỬA: useEffect chạy lại khi id thay đổi

  // SỬA: Cập nhật hàm getPrice để dùng selectedMatcha
  const getPrice = () => {
    if (!combo) return 0;

    if (selectedMatcha && selectedMatcha.price) {
      return selectedMatcha.price;
    }

    return combo.price; // Trả về giá gốc của combo
  };

  // SỬA: Hàm xử lý khi chọn một loại matcha
  const handleMatchaChange = (matchaItem) => {
    setSelectedMatcha(matchaItem);

    // Cập nhật ảnh chính để hiển thị ảnh của matcha được chọn
    if (matchaItem.image) {
      setCurrentMainImage(matchaItem.image);
    }
  };

  const handleAddToCart = async ({
    id,
    quantity,
    matcha, // Gửi thông tin matcha đã chọn
  }) => {
    const userId = localStorage.getItem("userId");

    try {
      // SỬA: Gửi yêu cầu thêm combo vào giỏ hàng
      const res = await axios.post(`${BACKEND_URL}/cart/add-combo`, {
        // Endpoint có thể cần thay đổi
        userId,
        id,
        quantity,
        matcha, // Gửi lựa chọn matcha
      });

      toast.success("Đã thêm combo vào giỏ hàng!");
      console.log("Cart updated:", res.data);
    } catch (error) {
      console.error("Lỗi khi thêm combo vào giỏ hàng:", error);
      toast.error("Thêm combo vào giỏ hàng thất bại!");
    }
  };

  // SỬA: Cập nhật hàm click thumbnail
  const handleThumbnailClick = (imageData) => {
    setCurrentMainImage(imageData.image);

    if (imageData.matchaData) {
      setSelectedMatcha(imageData.matchaData);
    } else {
      setSelectedMatcha(null);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  if (loading) {
    return <Loading>Đang tải thông tin combo...</Loading>;
  }

  if (!combo) {
    return <div>Không tìm thấy combo</div>;
  }

  return (
    <Container style={{ marginTop: "160px" }}>
      <ComboSection>
        <ImageSection>
          <MainImage>
            <img
              src={getImageUrl(currentMainImage)}
              alt={combo?.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.jpg";
              }}
            />
          </MainImage>
          <ThumbnailContainer>
            {allImages.map((imageData, index) => (
              <Thumbnail
                key={index}
                onClick={() => handleThumbnailClick(imageData)}
                $isActive={currentMainImage === imageData.image}
              >
                <img
                  src={getImageUrl(imageData.image)}
                  alt={`${combo?.title} ${
                    imageData.isMain ? "main" : "variant"
                  } ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </Thumbnail>
            ))}
          </ThumbnailContainer>
          <Description>{combo?.description}</Description>
        </ImageSection>

        <ComboInfo>
          <h1>{combo?.title}</h1>
          <Price>Chỉ {getPrice().toLocaleString()}đ</Price>

          {/* SỬA: Hiển thị các lựa chọn matcha */}
          {combo?.matcha && combo.matcha.length > 0 && (
            <Options>
              <p>
                <strong>Chọn loại Matcha bạn muốn:</strong>
              </p>
              <MatchaGrid>
                {combo.matcha.map((matchaItem, index) => (
                  <MatchaItem
                    key={index}
                    onClick={() => handleMatchaChange(matchaItem)}
                    $isActive={selectedMatcha === matchaItem}
                  >
                    <MatchaInfo>
                      <span>{matchaItem.title}</span>
                      {matchaItem.price && (
                        <span style={{ fontSize: "0.8em", color: "#668d35" }}>
                          {matchaItem.price.toLocaleString()}đ
                        </span>
                      )}
                    </MatchaInfo>
                  </MatchaItem>
                ))}
              </MatchaGrid>
            </Options>
          )}

          <AddToCart
            onClick={() =>
              handleAddToCart({
                id: combo._id,
                quantity,
                matcha: selectedMatcha,
              })
            }
          >
            {"Thêm vào giỏ hàng"}
          </AddToCart>
          {combo?.note && combo.note.length > 0 && (
            <NotesSection>
              <NotesTitle>Bộ sản phẩm bao gồm:</NotesTitle>
              <NotesList>
                {combo.note.map((item, index) => (
                  <NoteItem key={index}>
                    <NoteIcon>✓</NoteIcon>
                    <NoteText>
                      <NoteItemTitle>{item.title}</NoteItemTitle>
                      <NoteItemDescription>{item.note}</NoteItemDescription>
                    </NoteText>
                  </NoteItem>
                ))}
              </NotesList>
            </NotesSection>
          )}
        </ComboInfo>
      </ComboSection>
    </Container>
  );
};

// ... (Tất cả các styled-components dưới đây được đổi tên từ Product -> Combo)
// CSS cho MatchaGrid và MatchaItem đã được thêm vào

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ComboSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div``;

const MainImage = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 1 / 1;
  }
`;

const ThumbnailContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
`;

const Thumbnail = styled.div`
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
  border-radius: 4px;
  overflow: hidden;

  ${(props) =>
    props.$isActive &&
    `
        border-color: #668d35;
    `}

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    aspect-ratio: 1 / 1;
  }
`;

const Price = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  margin-top: 2rem;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Options = styled.div`
  margin-bottom: 2rem;
`;

const NotesSection = styled.div`
  margin: 2rem 0;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
`;

const NotesTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`;

const NotesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NoteItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const NoteIcon = styled.span`
  color: #668d35;
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 1rem;
  line-height: 1.5;
`;

const NoteText = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoteItemTitle = styled.span`
  font-weight: 500;
  color: #333;
  line-height: 1.5;
`;

const NoteItemDescription = styled.span`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

// SỬA: Đổi tên và style cho lựa chọn Matcha
const MatchaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MatchaItem = styled.div`
  border: 2px solid ${(props) => (props.$isActive ? "#668d35" : "#e0e0e0")};
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;

  &:hover {
    border-color: #668d35;
    transform: translateY(-2px);
  }
`;

const MatchaInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
  text-align: center;
`;

const AddToCart = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`;

const RelatedCombos = styled.div`
  margin-top: 4rem;
`;

const RelatedTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #333;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #668d35;
    border-radius: 2px;
  }
`;

const ComboGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ComboCard = styled.div`
  background: #f6f6ee;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
  }
  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
`;

const ComboImage = styled.div`
  position: relative;
  padding-top: 100%;
  background-color: #f8f8f8;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;

const ComboInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f6f6ee;
`;

const ComboName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const ComboShortDescription = styled.h3`
  font-size: 0.6rem;
  width: 155%;
  color: #333;
`;

const ComboBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ComboPrice = styled.div`
  font-size: 0.9rem;
  color: #527328;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #537328;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  width: 60px;
  height: 60px;
  border: 1px solid rgb(82, 115, 40);
  margin-right: -10px;
  &:hover {
    background: white;
    color: rgb(82, 115, 40);
    border: 1px solid rgb(82, 115, 40);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const QuantityWrapper = styled.div`
  margin-bottom: 2rem;
`;

const QuantityLabel = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #668d35;
    color: #668d35;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #ccc;
    cursor: not-allowed;
    border-color: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 36px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #668d35;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const StockInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

export default ComboDetail;
