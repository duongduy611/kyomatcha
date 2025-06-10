import React, { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Default from "./components/Default";
import { routes } from "./routers/index";
import GlobalStyle from './components/GlobalStyle';
import { AppProvider } from './context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import FloatingContactButton from "./components/FloatingContactButton";
// import { SpeedInsights } from '@vercel/speed-insights/react';

const App = () => {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <ScrollToTop />
        <AppProvider>
          <GlobalStyle />
          <Routes>
            {routes.map((route) => {
              const Layout = route.isShowHeader ? Default : Fragment;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <route.page />
                      {route.isShowHeader && <FloatingContactButton />}
                      {route.isShowFooter && <Footer />}
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </AppProvider>
      </Router>
      </GoogleOAuthProvider>
      {/* <SpeedInsights /> */}
    </div>
  );
};

export default App;
