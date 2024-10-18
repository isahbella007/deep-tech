import { useEffect } from 'react';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { deleteProductFromCart, fetchCart, updateCartItemQuantity } from '../store/cartSlice';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Layout from '../components/layout';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state:RootStateOrAny) => state.cart);
//   console.log('our item is s', items)

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

 
  const handleUpdateQuantity = (productId: string, quantityChange: number) => {
    dispatch(updateCartItemQuantity({ productId, quantityChange }));
  };

  const handleRemoveItem = (productId:string) => { 
    dispatch(deleteProductFromCart({productId}))
  }

  const calculateTotal = () => {
    return items.reduce((total: number, item: { product: { price: number; }; quantity: number; }) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Layout>
<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <ShoppingCart className="mr-2" /> Your Cart
      </h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item:any) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg mb-4 p-4">
              <div className="font-bold text-lg mb-2">{item.product.name}</div>
              <div className="flex justify-between items-center mb-2">
                <p>Price: ${item.product.price.toFixed(2)}</p>
                <div className="flex items-center">
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-l"
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="bg-gray-200 text-gray-800 font-bold py-1 px-4">{item.quantity}</span>
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-r"
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
                <button 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" /> Proceed to Checkout
          </button>
        </>
      )}
    </div>
    </Layout>
    
  );
};

export default CartPage;