import { configureStore } from '@reduxjs/toolkit'
import contractSlice from '../feature/contractSlice';
import customerSlice from '../feature/customerSlice';
import invoiceSilce from '../feature/invoiceSlice';
import searchPartners from '../feature/searchPartners';
import productsSlice from './../feature/productsSlice';
import userSlice from './../feature/userSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    customer: customerSlice,
    user: userSlice,
    invoices: invoiceSilce,
    contracts: contractSlice,
    partners: searchPartners
  },
})