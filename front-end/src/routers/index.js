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
    }
]