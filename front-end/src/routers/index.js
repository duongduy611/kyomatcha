import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import AllProducts from '../pages/AllProducts';
import ProductDetail from '../pages/ProductDetail';
import MyCart from '../pages/MyCart';
import ThankYouPage from "../pages/ThankYouPage";
import OrderHistory from "../pages/OrderHistory";
import OrderDetail from "../pages/OrderDetail";

export const routes = [
    {
        path: "/",
        page: Home,
        isShowHeader: true
    },
    {
        path: "/login",
        page: Login,
        isShowHeader: true
    },
    {
        path: "/register",
        page: Register,
        isShowHeader: true
    },
    {
        path: '/profile',
        page: Profile,
        isShowHeader: true
    },
    {
        path: '/edit-profile',
        page: EditProfile,
        isShowHeader: true
    },
    {
        path: '/products',
        page: AllProducts,
        isShowHeader: true
    },
    {
        path: '/products/:slug',
        page: ProductDetail,
        isShowHeader: true
    },
    {
        path: '/cart',
        page: MyCart,
        isShowHeader: true
    },
    {
        path: '/thankyou',
        page: ThankYouPage,
        isShowHeader: true
    },
    {
        path: '/my-orders',
        page: OrderHistory,
        isShowHeader: true
    },
    {
        path: '/my-orders/:orderId',
        page: OrderDetail,
        isShowHeader: true
    }

]