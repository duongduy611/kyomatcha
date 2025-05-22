import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routers';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.page />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;