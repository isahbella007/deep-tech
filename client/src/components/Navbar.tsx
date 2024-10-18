import { Link } from 'react-router-dom';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { logout } from '../store/authSlice';
import { useEffect, useState } from 'react';
import { fetchCart,  setItemAdded } from '../store/cartSlice';
import Cookies from 'js-cookie';
import { userLogout } from '../api/auth';
import { Menu } from 'lucide-react';

const Navbar = () => { 
    const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((state: RootStateOrAny) => state.auth)
    const {itemAdded, items} = useSelector((state: RootStateOrAny) => state.cart)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    // for now, when the page lands, get the cart count but later, add a state to listen to when they successfully add to cart

    useEffect(() => { 
      
        dispatch(fetchCart())
        // console.log('Navbar -> item', items)
        dispatch(setItemAdded(false))
      
    }, [itemAdded, dispatch])

    const handleLogout = async() => {
        await userLogout()
        Cookies.remove('visitorCartId')
        Cookies.remove('sessionId')
        dispatch(logout());
    };
    
    const NavLinks = () => (
      <>
        <Link to="/" className="block py-2 hover:underline">
          Home
        </Link>
        <Link to="/cart" className='block py-2 hover:underline'>
          <span>Cart ({items?.length})</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            {user?.isAdmin && (
              <Link to="/products" className="block py-2 hover:underline">
                Product Listing
              </Link>
            )}
            <Link to="/profile" className='block py-2 hover:underline'>
              My Profile
            </Link>
            <button onClick={handleLogout} className="block py-2 hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="block py-2 hover:underline">
              Login
            </Link>
            <Link to="/register" className="block py-2 hover:underline">
              Register
            </Link>
          </>
        )}
      </>
    );
  
    return (
      <nav className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              MyShop
            </Link>
            <div className="hidden md:flex space-x-4">
              <NavLinks />
            </div>
            <button 
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
          {isMenuOpen && (
            <div className="mt-4 md:hidden">
              <NavLinks />
            </div>
          )}
        </div>
      </nav>
    );
}

export default Navbar