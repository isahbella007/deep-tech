import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteProduct, getCart, updateCart } from "../api/cart";

interface CartState {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    itemAdded: boolean;
  }
  
  const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
    itemAdded: false,
  };

const cartSlice = createSlice({ 
    name: 'cart', 
    initialState: initialState ,
    reducers: {
        setItems: (state, action) => { 
            state.items = action.payload
        },
        setItemAdded: (state, action) => {
            state.itemAdded = action.payload;
          },
        resetItemAdded: (state) => {
            state.itemAdded = state.itemAdded;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(deleteProductFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items
            })
    }
})

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
      const response = await getCart();
      // console.log('we called you via dispatch', response);
      return response.items;
    }
  );

  export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({ productId, quantityChange }: { productId: string, quantityChange: number }) => {
    const response = await updateCart(productId, quantityChange);
    // console.log('we are updating the quantity', response)
    return response;
  });

  export const deleteProductFromCart = createAsyncThunk('cart/deleteProductFromCart', async({productId} : {productId: string}) => { 
    const response = await deleteProduct(productId)
    // console.log('Our response', response)
    return response
  })
export const { resetItemAdded, setItemAdded , setItems} = cartSlice.actions;

export default cartSlice.reducer;