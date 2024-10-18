import { useEffect, useState } from "react";
import ProductCard from "../components/Productcard";
import { IProduct } from "../pages/ProductListing";
import { allProductsNoLogin} from "../api/product";
import { useDispatch } from "react-redux";
import { setItemAdded } from "../store/cartSlice";



const ProductList = () => { 
  const dispatch = useDispatch();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await allProductsNoLogin();
      // console.log('fetchedResponse'), fetchedProducts
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      // console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onCartUpdate = async() => { 
    dispatch(setItemAdded(true))
    console.log('call the get cart function here again by triggering a cart state')
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onCartUpdate={onCartUpdate} />
      ))}
    </div>
  );
}
export default ProductList