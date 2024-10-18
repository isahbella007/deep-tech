import { Link } from 'react-router-dom';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { logout } from '../store/authSlice';
import { useEffect } from 'react';
import { fetchCart,  setItemAdded } from '../store/cartSlice';


const Navbar = () => { 
    const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((state: RootStateOrAny) => state.auth)
    const {itemAdded, items} = useSelector((state: RootStateOrAny) => state.cart)
    
    // for now, when the page lands, get the cart count but later, add a state to listen to when they successfully add to cart

    useEffect(() => { 
      
        dispatch(fetchCart())
        // console.log('Navbar -> item', items)
        dispatch(setItemAdded(false))
      
    }, [itemAdded, dispatch])

    const handleLogout = () => {
        dispatch(logout());
    };
    
    return (
        <nav className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              MyShop
            </Link>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <Link to="/cart" className='hover:underline'>
                <span>Cart ({items?.length})</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  {/* <span>Cart ({items.length})</span> */}
                  {user?.isAdmin && (
                    <Link to="/products" className="hover:underline">
                      Product Listing
                    </Link>
                  )}
                  <Link to ="/profile" className='hover:underline'>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="hover:underline">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                  <Link to="/register" className="hover:underline">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      );
}

export default Navbar