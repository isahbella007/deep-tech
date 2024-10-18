import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';

interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  quantity?:number
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  product?: Product;
}

const initialProduct: Product = {
  name: '',
  price: 0,
  quantity: 0,
  description: '',
};

export default function ProductModal({ isOpen, onClose, onSubmit, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(initialProduct);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData(initialProduct);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}