import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [currentMainImage, setCurrentMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Reset loading state for new product
        const response = await axios.get(`${BACKEND_URL}/api/products/${slug}`);
        if (response.data && response.data.data) {
          const productData = response.data.data.product;
          setProduct(productData);
          setRelatedProducts(response.data.data.relatedProducts || []);

          // Combine all images
          const mainImages = productData.images
            ? productData.images.map((img) => ({
                image: img,
                isMain: true,
                subCategory: null,
              }))
            : [];

          const subImages = [];
          if (productData.subCategory && productData.subCategory.length > 0) {
            productData.subCategory.forEach((sub) => {
              if (sub.images) {
                // Assuming sub.images is a single image URL string
                subImages.push({
                  image: sub.images,
                  isMain: false,
                  subCategory: sub,
                });
              }
            });
          }

          const combinedImages = [...mainImages, ...subImages];
          setAllImages(combinedImages);

          // Set initial main image
          if (productData.images && productData.images.length > 0) {
            setCurrentMainImage(productData.images[0]);
          } else if (subImages.length > 0) {
            setCurrentMainImage(subImages[0].image);
          }

          // Reset selections
          setSelectedSubCategory(null);
          setSelectedSize("");
          setSelectedColor("");
          setQuantity(1);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const getPrice = () => {
    if (!product) return 0;

    if (selectedSubCategory && selectedSubCategory.price) {
      return selectedSubCategory.price;
    }

    if (selectedSize && product.subPrice) {
      const sizePrice = product.subPrice.find((p) => p.size === selectedSize);
      if (sizePrice) return sizePrice.price;
    }

    if (selectedColor && product.subPrice) {
      const colorPrice = product.subPrice.find(
        (p) => p.color === selectedColor
      );
      if (colorPrice) return colorPrice.price;
    }

    return product.price;
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleSubCategoryChange = (subCat) => {
    setSelectedSubCategory(subCat);
    if (subCat.size) setSelectedSize(subCat.size);
    if (subCat.color) setSelectedColor(subCat.color);

    // Update main image to show subcategory image
    if (subCat.images) {
      setCurrentMainImage(subCat.images);
    }
  };

  const handleAddToCart = async ({
    productId,
    quantity,
    color,
    size,
    stock,
  }) => {
    const userId = localStorage.getItem("userId");

    if (stock <= 0) {
      toast.info("Sản phẩm đã hết hàng!");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/cart/add`, {
        userId,
        productId,
        quantity,
        color,
        size,
      });

      toast.success("Đã thêm vào giỏ hàng!");
      console.log("Cart updated:", res.data);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleThumbnailClick = (imageData) => {
    setCurrentMainImage(imageData.image);

    if (imageData.subCategory) {
      setSelectedSubCategory(imageData.subCategory);
      if (imageData.subCategory.size)
        setSelectedSize(imageData.subCategory.size);
      if (imageData.subCategory.color)
        setSelectedColor(imageData.subCategory.color);
    } else {
      // If clicking a main product thumbnail, deselect subcategory
      setSelectedSubCategory(null);
      setSelectedSize("");
      setSelectedColor("");
    }
  };

  // Helper function to get the correct image URL
  const getImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) {
      return path;
    }
    return `${BACKEND_URL}${path}`;
  };

  if (loading) {
    return <Loading>Đang tải thông tin sản phẩm...</Loading>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <Container style={{ marginTop: "160px" }}>
      <ProductSection>
        <ImageSection>
          {/* SỬA LỖI 1: SỬ DỤNG currentMainImage VÀ getImageUrl */}
          <MainImage>
            <img
              src={getImageUrl(currentMainImage)}
              alt={product?.name}
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
                {/* SỬA LỖI 2: SỬ DỤNG getImageUrl CHO THUMBNAIL */}
                <img
                  src={getImageUrl(imageData.image)}
                  alt={`${product?.name} ${
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
        </ImageSection>

        <ProductInfo>
          <h1>{product?.name}</h1>
          <Price>Chỉ {getPrice().toLocaleString()}đ</Price>
          <Description>{product?.description}</Description>

          {product?.subCategory && product.subCategory.length > 0 && (
            <Options>
              <SubCategoryGrid>
                {product.subCategory.map((sub, index) => (
                  <SubCategoryItem
                    key={index}
                    onClick={() => handleSubCategoryChange(sub)}
                    $isActive={selectedSubCategory === sub}
                  >
                    <SubCategoryInfo>
                      {sub.size && <span>{sub.size}</span>}
                      {sub.color && <span>{sub.color}</span>}
                    </SubCategoryInfo>
                  </SubCategoryItem>
                ))}
              </SubCategoryGrid>
            </Options>
          )}

          <QuantityWrapper>
            <QuantityLabel>Số lượng:</QuantityLabel>
            <QuantityControls>
              <QuantityButton
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <FaMinus />
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={handleQuantityInput}
                min="1"
                max={product.stock}
                style={{ width: "80px", marginLeft: "-12px" }}
              />
              <QuantityButton
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                style={{ marginLeft: "-12px" }}
              >
                <FaPlus />
              </QuantityButton>
            </QuantityControls>
            <StockInfo>Còn lại: {product.stock} sản phẩm</StockInfo>
          </QuantityWrapper>

          <AddToCart
            onClick={() =>
              handleAddToCart({
                productId: product._id,
                quantity,
                color: selectedColor,
                size: selectedSize,
                stock: product.stock,
              })
            }
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </AddToCart>
        </ProductInfo>
      </ProductSection>

      {relatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts>
          <RelatedTitle>Có thể bạn cũng thích</RelatedTitle>
          <ProductGrid>
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard key={relatedProduct.slug}>
                <Link to={`/products/${relatedProduct.slug}`}>
                  <ProductImage>
                    <img
                      src={getImageUrl(
                        relatedProduct.images && relatedProduct.images[0]
                      )}
                      alt={relatedProduct.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </ProductImage>
                  <ProductInfo>
                    <ProductBottom>
                      <div style={{ width: "50%" }}>
                        <ProductName>{relatedProduct.name}</ProductName>
                        <ProductShortDescription>
                          {relatedProduct.shortDescription}
                        </ProductShortDescription>
                        <ProductPrice>
                          {relatedProduct.price.toLocaleString("vi-VN")}₫
                        </ProductPrice>
                      </div>
                      <Button>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                        </svg>
                      </Button>
                    </ProductBottom>
                  </ProductInfo>
                </Link>
              </ProductCard>
            ))}
          </ProductGrid>
        </RelatedProducts>
      )}
    </Container>
  );
};

// ... (Phần styled-components giữ nguyên không đổi)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductSection = styled.div`
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
        border-color: #2ecc40;
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
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Options = styled.div`
  margin-bottom: 2rem;
`;

const SubCategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SubCategoryItem = styled.div`
  border: 2px solid ${(props) => (props.$isActive ? "#2ecc40" : "#e0e0e0")};
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;

  &:hover {
    border-color: #2ecc40;
    transform: translateY(-2px);
  }
`;

const SubCategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
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

const RelatedProducts = styled.div`
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
    background-color: #2ecc40;
    border-radius: 2px;
  }
`;

const ProductGrid = styled.div`
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

const ProductCard = styled.div`
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

const ProductImage = styled.div`
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

const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f6f6ee;
`;

const ProductName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const ProductShortDescription = styled.h3`
  font-size: 0.6rem;
  width: 155%;
  color: #333;
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ProductPrice = styled.div`
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
    border-color: #2ecc40;
    color: #2ecc40;
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
    border-color: #2ecc40;
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

export default ProductDetail;
