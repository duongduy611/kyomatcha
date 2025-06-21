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
import OrderDetail from "../pages/OrderDetail";
import QRPaymentPage from "../pages/QRPayment";
import ComboDetail from "../pages/ComboDetail";

export const routes = [
    {
        path: "/",
        page: Home,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: "/login",
        page: Login,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: "/register",
        page: Register,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/profile',
        page: Profile,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/edit-profile',
        page: EditProfile,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/blogs',
        page: Blog,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/blogs/:slug',
        page: BlogDetail,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/contact',
        page: Contact,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/about-us',
        page: AboutUs,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/history',
        page: History,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '*',
        page: NotFound,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/products',
        page: AllProducts,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/products/:slug',
        page: ProductDetail,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/cart',
        page: MyCart,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/thankyou',
        page: ThankYouPage,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/my-orders/:orderId',
        page: OrderDetail,
        isShowHeader: true,
        isShowFooter: false
    },
     {
        path: '/qr-payment',
        page: QRPaymentPage,
        isShowHeader: true,
        isShowFooter: false
    },
    {
        path: '/combo-detail/:comboId',
        page: ComboDetail,
        isShowHeader: true,
        isShowFooter: false
    }
]
