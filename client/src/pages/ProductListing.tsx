import { Link } from 'react-router-dom';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import ProductModal from '../components/ProductModal';
import { addProduct, deleteProduct, getAllProducts, updateProduct } from '../api/product';

// This is a mock product type, update it according to your actual product structure
export interface IProduct {
  _id?: number;
  name: string;
  price: number;
  description?: string;
  quantity?:number;
  image?:string
}

const ProductListing  = () => {

  const [products, setProducts] = useState<IProduct[]>([]); // Assume this is populated from an API
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await getAllProducts();
      // console.log('fetchedResponse'), fetchedProducts
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleSubmitProduct = async (product: IProduct): Promise<void> => {
    try {
      if (selectedProduct) {
        // console.log('our chaanngeeeee', product)
        // Editing existing product
        if(product?._id){ 
          const response = await updateProduct(product._id, product);
          if (response.status === 'success') {
            fetchProducts();
          }
        }
        
      } else {
        // Adding new product
        const response = await addProduct(product);
        if (response.status === 'success') {
          fetchProducts();
        }
      }
    } catch (err) {
      console.error('Error submitting product:', err);
      setError('Failed to submit product. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (product:IProduct): Promise<void> =>{ 
    try{ 
      if(product._id){ 
        const response = await deleteProduct(product._id)
        if (response.status === 'success') {
          fetchProducts();
        }
      }
    }catch(err){ 
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Listing</h1>
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Product
          </button>
        </div>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">S/N</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Quantity</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map((product, index) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-left">${product.price.toFixed(2)}</td>
                <td className="py-3 px-6 text-left">{product.quantity}</td>
                <td className="py-3 px-6 text-left">{product.description}</td>
                <td className="py-3 px-6 text-center">
                <button 
                    className="text-blue-500 hover:underline mr-4"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDelete(product)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
      />
    </Layout>
  );
};

export default ProductListing;