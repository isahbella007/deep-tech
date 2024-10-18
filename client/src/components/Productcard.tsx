import { useState } from "react";
import { addToCart } from "../api/cart";
import { IProduct } from "../pages/ProductListing";
import { Plus, Minus } from 'lucide-react';

interface Props {
    product: IProduct;
    onCartUpdate(): void
  }

const ProductCard = ({product, onCartUpdate}: Props) => { 
  const [quantity, setQuantity] = useState(1)
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = async () => {
    try {
      if(product._id){ 
        await addToCart(product._id, quantity);
        onCartUpdate();
        setQuantity(1);
      }
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };
  
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden" key={product._id}>
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <div className="flex items-center mb-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 text-gray-600 px-2 py-1 rounded-l"
              >
                <Minus size={16} />
              </button>
              <span className="bg-gray-100 px-4 py-1">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 text-gray-600 px-2 py-1 rounded-r"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      );
}
export default ProductCard