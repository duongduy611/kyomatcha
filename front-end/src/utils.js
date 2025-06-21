// utils/image.js
export function resolveImageUrl(path) {
	if (!path) {
		// fallback nếu không có path
		return '/images/placeholder.jpg';
	}
	// nếu path đã là http:// hoặc https:// thì trả luôn
	if (/^https?:\/\//i.test(path)) {
		return path;
	}
	// ngược lại ghép với BACKEND_URL
	return `${process.env.REACT_APP_BACKEND_URL}${path}`;
}

export function getOrderItemImage(item) {
	if (item.kind === 'Product') {
		// product được enrich thành item.product.images
		return item.images?.[0] || null;
	}
	if (item.kind === 'Combo') {
		// ưu tiên ảnh variant, fallback về comboImages
		return item.variant?.image || item.comboImages?.[0] || null;
	}
	return null;
}

export function getOrderDetailItemImage(item) {
	if (item.kind === 'Product') {
		// product được enrich thành item.product.images
		return item.product?.images?.[0] || null;
	}
	if (item.kind === 'Combo') {
		// ưu tiên ảnh variant, fallback về comboImages
		return item.variant?.image || item.comboImages?.[0] || null;
	}
	return null;
}
