import React, { Fragment } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Default from "./components/Default";
import { routes } from "./routers/index";
import GlobalStyle from './components/GlobalStyle';
import { AppProvider } from './context/AppContext';
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="App">
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
                      {route.isShowFooter && <Footer />}
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </AppProvider>
      </Router>
    </div>
  );
}

export default App;