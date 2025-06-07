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

export const routes = [
    {
        path: "/",
        page: Home,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: "/login",
        page: Login,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: "/register",
        page: Register,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/profile',
        page: Profile,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/edit-profile',
        page: EditProfile,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/blogs',
        page: Blog,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/blogs/:slug',
        page: BlogDetail,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/contact',
        page: Contact,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/about-us',
        page: AboutUs,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/history',
        page: History,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '*',
        page: NotFound,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/products',
        page: AllProducts,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/products/:slug',
        page: ProductDetail,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/cart',
        page: MyCart,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/thankyou',
        page: ThankYouPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/my-orders',
        page: OrderHistory,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/my-orders/:orderId',
        page: OrderDetail,
        isShowHeader: true,
        isShowFooter: true
    },
     {
        path: '/qr-payment',
        page: QRPaymentPage,
        isShowHeader: true,
        isShowFooter: true
    },
]