import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import Blog from '../pages/Blog';
import BlogDetail from '../pages/BlogDetail';
import Contact from '../pages/Contact';
import AboutUs from '../pages/AboutUs';
import History from '../pages/History';
import NotFound from '../pages/NotFound';
import AllProducts from '../pages/AllProducts';
import ProductDetail from '../pages/ProductDetail';
import MyCart from '../pages/MyCart';
import ThankYouPage from "../pages/ThankYouPage";
import OrderHistory from "../pages/OrderHistory";
import OrderDetail from "../pages/OrderDetail";
import QRPaymentPage from "../pages/QRPayment";
import PointHistory from '../pages/PointHistory';
import ExchangePoints from '../pages/ExchangePoints';

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
        path: '/blog',
        page: Blog,
        isShowHeader: true
    },
    {
        path: '/blog/:blogId',
        page: BlogDetail,
        isShowHeader: true
    },
    {
        path: '/contact',
        page: Contact,
        isShowHeader: true
    },
    {
        path: '/about-us',
        page: AboutUs,
        isShowHeader: true
    },
    {
        path: '/history',
        page: History,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFound,
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
    },
     {
        path: '/qr-payment',
        page: QRPaymentPage,
        isShowHeader: true
    },
    {
        path: '/point-history',
        page: PointHistory,
        isShowHeader: true
    },
    {
        path: '/exchange-points',
        page: ExchangePoints,
        isShowHeader: true
    }
]