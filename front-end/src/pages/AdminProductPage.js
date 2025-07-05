import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaPlus, FaPencilAlt, FaTrash, FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Các hằng số và Styled Components không thay đổi ---
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:9999"; 
const API_URL = `${BACKEND_URL}/admin/products`;
const FETCH_PRODUCTS_URL = `${BACKEND_URL}/api/products`;



const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled.div`
  background: white; padding: 2rem 3rem; border-radius: 12px;
  width: 100%; max-width: 800px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-height: 90vh; overflow-y: auto;
`;
const ModalTitle = styled.h2`
  margin-top: 0; margin-bottom: 2rem; color: #2d3748; text-align: center;
`;
const Form = styled.form`
  display: flex; flex-direction: column; gap: 1rem;
`;
const SectionTitle = styled.h3`
  color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;
  margin-top: 1.5rem; margin-bottom: 1rem;
`;
const FormGroup = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FormItem = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
  label { font-weight: 600; color: #4a5568; }
  input, select, textarea {
    width: 100%; padding: 0.75rem; border: 1px solid #cbd5e0;
    border-radius: 8px; font-size: 1rem;
    &:focus {
      outline: none; border-color: #6C8821; box-shadow: 0 0 0 2px rgba(108, 136, 33, 0.2);
    }
  }
  textarea { resize: vertical; min-height: 100px; }
`;
const ItemList = styled.div`
  display: flex; flex-direction: column; gap: 0.5rem;
`;
const ItemRow = styled.div`
  display: flex; align-items: center; gap: 1rem;
  input { flex: 1; }
`;
const SubCategoryRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 0.1fr;
    gap: 1rem;
    align-items: center;
    padding: 0.5rem;
    border-radius: 6px;
    &:nth-child(odd) {
        background-color: #f7fafc;
    }
`;
const AddItemForm = styled.div`
  display: flex; gap: 1rem; margin-top: 1rem;
  input { flex: 1; }
`;
const SmallButton = styled.button`
  padding: 0.5rem 1rem; border-radius: 6px; border: none;
  font-weight: 600; cursor: pointer; transition: background-color 0.2s;
`;
const AddButtonStyled = styled(SmallButton)`
  background-color: #38a169; color: white;
  &:hover { background-color: #2f855a; }
`;
const DeleteButtonStyled = styled(SmallButton)`
  background-color: transparent; color: #e53e3e; font-size: 1.2rem; padding: 0.25rem;
  &:hover { background-color: #fed7d7; }
`;
const ModalActions = styled.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;
`;
const SaveButton = styled(SmallButton)`
  background-color: #6C8821; color: white; padding: 0.75rem 1.5rem; font-size: 1rem;
  &:hover { background-color: #5a721b; }
`;
const CancelButton = styled(SmallButton)`
  background-color: #e2e8f0; color: #4a5568; padding: 0.75rem 1.5rem; font-size: 1rem;
  &:hover { background-color: #cbd5e0; }
`;

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
    const [formData, setFormData] = useState({});
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newSubCategory, setNewSubCategory] = useState({ color: '', size: '', images: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: product?.name || '',
                category: product?.category || 'Matcha',
                price: product?.price || '',
                stock: product?.stock || '',
                shortDescription: product?.shortDescription || '',
                description: product?.description || '',
                images: product?.images || [],
                subCategory: product?.subCategory || [],
            });
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleFormItemChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Handlers for Main Images ---
    const handleAddImage = () => {
        if (newImageUrl && !formData.images.includes(newImageUrl)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl] }));
            setNewImageUrl("");
        }
    };
    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
    };

    // --- Handlers for SubCategories ---
    const handleSubCategoryChange = (indexToUpdate, field, value) => {
        const updatedSubCategories = formData.subCategory.map((item, index) => 
            index === indexToUpdate ? { ...item, [field]: value } : item
        );
        setFormData(prev => ({ ...prev, subCategory: updatedSubCategories }));
    };
    const handleAddSubCategory = () => {
        if (newSubCategory.color || newSubCategory.size || newSubCategory.images) {
            setFormData(prev => ({ ...prev, subCategory: [...prev.subCategory, newSubCategory] }));
            setNewSubCategory({ color: '', size: '', images: '' });
        }
    };
    const handleRemoveSubCategory = (indexToRemove) => {
        setFormData(prev => ({ ...prev, subCategory: prev.subCategory.filter((_, index) => index !== indexToRemove) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalTitle>{product ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}</ModalTitle>
                <Form onSubmit={handleSubmit}>
                    <SectionTitle>Thông tin cơ bản</SectionTitle>
                    <FormGroup>
                        <FormItem>
                            <label>Tên sản phẩm</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleFormItemChange} required />
                        </FormItem>
                        <FormItem>
                            <label>Danh mục</label>
                            <select name="category" value={formData.category || 'Matcha'} onChange={handleFormItemChange}>
                                <option value="Matcha">Matcha</option>
                                <option value="tea_tools">Dụng cụ trà đạo</option>
                                <option value="barista_tools">Dụng cụ pha chế</option>
                            </select>
                        </FormItem>
                        <FormItem>
                            <label>Giá (VNĐ)</label>
                            <input type="number" name="price" value={formData.price || ''} onChange={handleFormItemChange} required />
                        </FormItem>
                        <FormItem>
                            <label>Số lượng trong kho</label>
                            <input type="number" name="stock" value={formData.stock || ''} onChange={handleFormItemChange} />
                        </FormItem>
                    </FormGroup>
                    <FormGroup>
                         <FormItem>
                            <label>Mô tả ngắn</label>
                            <input type="text" name="shortDescription" value={formData.shortDescription || ''} onChange={handleFormItemChange} />
                        </FormItem>
                        <FormItem>
                            <label>Mô tả chi tiết</label>
                            <textarea name="description" value={formData.description || ''} onChange={handleFormItemChange}></textarea>
                        </FormItem>
                    </FormGroup>

                    <SectionTitle>Ảnh chính</SectionTitle>
                    <ItemList>
                        {formData.images?.map((img, index) => (
                            <ItemRow key={index}>
                                <input type="text" value={img} readOnly />
                                <DeleteButtonStyled type="button" onClick={() => handleRemoveImage(index)}>&times;</DeleteButtonStyled>
                            </ItemRow>
                        ))}
                    </ItemList>
                    <AddItemForm>
                        <input type="text" placeholder="Thêm link ảnh mới..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                        <AddButtonStyled type="button" onClick={handleAddImage}>Thêm ảnh</AddButtonStyled>
                    </AddItemForm>

                    <SectionTitle>Biến thể sản phẩm (SubCategory)</SectionTitle>
                    <ItemList>
                        {formData.subCategory?.map((sub, index) => (
                            <SubCategoryRow key={index}>
                                <input type="text" placeholder="Màu sắc" value={sub.color || ''} onChange={(e) => handleSubCategoryChange(index, 'color', e.target.value)} />
                                <input type="text" placeholder="Kích thước" value={sub.size || ''} onChange={(e) => handleSubCategoryChange(index, 'size', e.target.value)} />
                                <input type="text" placeholder="Link ảnh của biến thể" value={sub.images || ''} onChange={(e) => handleSubCategoryChange(index, 'images', e.target.value)} />
                                <DeleteButtonStyled type="button" onClick={() => handleRemoveSubCategory(index)}>&times;</DeleteButtonStyled>
                            </SubCategoryRow>
                        ))}
                    </ItemList>
                    <AddItemForm>
                        <SubCategoryRow>
                            <input type="text" placeholder="Màu sắc mới" value={newSubCategory.color} onChange={(e) => setNewSubCategory(p => ({...p, color: e.target.value}))} />
                            <input type="text" placeholder="Kích thước mới" value={newSubCategory.size} onChange={(e) => setNewSubCategory(p => ({...p, size: e.target.value}))} />
                            <input type="text" placeholder="Link ảnh mới" value={newSubCategory.images} onChange={(e) => setNewSubCategory(p => ({...p, images: e.target.value}))} />
                            <AddButtonStyled type="button" onClick={handleAddSubCategory} style={{gridColumn: "span 4"}} >Thêm biến thể</AddButtonStyled>
                        </SubCategoryRow>
                    </AddItemForm>

                    <ModalActions>
                        <CancelButton type="button" onClick={onClose}>Hủy bỏ</CancelButton>
                        <SaveButton type="submit">Lưu thay đổi</SaveButton>
                    </ModalActions>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
};

// --- END: NÂNG CẤP MODAL ---


// --- COMPONENT CHÍNH VÀ CÁC STYLED COMPONENTS CÒN LẠI (GIỮ NGUYÊN) ---
const AdminPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FBF9F2;
  font-family: 'Poppins', sans-serif;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #1a202c;
  color: #a0aec0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  flex-shrink: 0;
`;

const SidebarLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #2d3748;
  text-align: center;
`;

const NavMenu = styled.nav`
  margin-top: 1.5rem;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #a0aec0;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
  background-color: ${props => props.active ? '#4a5568' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#a0aec0'};

  &:hover {
    background-color: #2d3748;
    color: #ffffff;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  height: 80px;
`;

const HeaderSearch = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  input {
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    width: 300px;
    font-size: 0.9rem;
    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 1px #4299e1;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    color: #718096;
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #4a5568;

  svg {
    cursor: pointer;
    font-size: 1.25rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #2d3748;
`;

const AddProductButton = styled.button`
  background-color: #6C8821;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgb(119, 139, 65);;
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #edf2f7;
  
  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.8rem;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: #2d3748;
  vertical-align: middle;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ActionButtonStyled = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #edf2f7;
  }
`;

const EditButton = styled(ActionButtonStyled)`
  color: #6C8821; 
  &:hover {
    color:rgb(147, 191, 27);
  }
`;

const DeleteButtonStyledIcon = styled(ActionButtonStyled)`
  color: #f56565;
  &:hover {
    color: #c53030;
  }
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: #718096;
`;

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      try {
        const response = await axios.get(FETCH_PRODUCTS_URL);
        setProducts(response.data.data || []);
      } catch (err) {
        toast.error("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
        if (editingProduct) {
            const response = await axios.put(`${API_URL}/${editingProduct._id}`, productData);
            setProducts(products.map(p => p._id === editingProduct._id ? response.data.product : p));
            toast.success('Cập nhật sản phẩm thành công!');
        } else {
            const response = await axios.post(API_URL, productData);
            setProducts(prevProducts => [...prevProducts, response.data.product]);
            toast.success('Thêm sản phẩm thành công!');
        }
        handleCloseModal();
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Đã có lỗi xảy ra.";
        toast.error(errorMessage);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
        try {
            await axios.delete(`${API_URL}/${productId}`);
            setProducts(products.filter(p => p._id !== productId));
            toast.success('Xóa sản phẩm thành công!');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Lỗi khi xóa sản phẩm.";
            toast.error(errorMessage);
        }
    }
  };

  const filteredProducts = products.filter(product =>
    !product.isDeleted && (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderContent = () => {
    if (loading) return <LoadingContainer>Đang tải danh sách sản phẩm...</LoadingContainer>;
    
    return (
        <ProductTable>
            <TableHead>
              <tr>
                <th>Ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th>
                <th>Giá</th><th>Tồn kho</th><th>Hành động</th>
              </tr>
            </TableHead>
            <tbody>
              {filteredProducts.map(product => (
                <TableRow key={product._id}>
                  <TableCell>
                    <ProductImage src={product.images?.[0]?.startsWith("http") ? product.images[0] : `${BACKEND_URL}${product.images?.[0] || "/placeholder.jpg"}`}
                      alt={product.name} onError={(e) => e.target.src = "/placeholder.jpg"}/>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category === "tea_tools" ? "Dụng cụ trà đạo" : product.category === "barista_tools" ? "Dụng cụ pha chế" : "Matcha"}</TableCell>
                  <TableCell>{product.price.toLocaleString('vi-VN')} đ</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <ActionCell>
                    <EditButton onClick={() => handleOpenEditModal(product)}><FaPencilAlt /></EditButton>
                    <DeleteButtonStyledIcon onClick={() => handleDeleteProduct(product._id)}><FaTrash /></DeleteButtonStyledIcon>
                  </ActionCell>
                </TableRow>
              ))}
            </tbody>
        </ProductTable>
    );
  }

  return (
    <>
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProduct} product={editingProduct} />
      <AdminPageContainer>
        <Sidebar>
          <SidebarLogo>ADMIN</SidebarLogo>
          <NavMenu>
            <NavLink href="/admin/products" active>Sản phẩm</NavLink>
            <NavLink href="/admin/orders">Đơn Hàng</NavLink>
            <NavLink href="/admin/users">Khách Hàng</NavLink>
          </NavMenu>
        </Sidebar>

        <MainContent>
          <Header>
            <HeaderSearch>
              <FaSearch /><input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </HeaderSearch>
            <HeaderIcons><FaBell /><FaUserCircle /></HeaderIcons>
          </Header>

          <ContentWrapper>
            <PageHeader>
              <PageTitle>Quản lý Sản phẩm</PageTitle>
              <AddProductButton onClick={handleOpenAddModal}><FaPlus />Thêm sản phẩm</AddProductButton>
            </PageHeader>
            {renderContent()}
          </ContentWrapper>
        </MainContent>
      </AdminPageContainer>
    </>
  );
};

export default AdminProductPage;