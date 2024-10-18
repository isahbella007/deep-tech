import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css'
import Register from './pages/Register';
import Login from './pages/Login';
import ProductListing from './pages/ProductListing';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/Profile';
import CartPage from './pages/Cart';

function App() {

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/products" element={<ProductListing />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/cart" element={<CartPage/>}></Route>
        </Routes>
      </Router>
    </Provider>
    
  ) 
}

export default App
