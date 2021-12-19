import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
}

export const invoiceSilce = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoices: (state, action) => {
      state.data = action.payload
    },
    deleteInvoices: (state, action) => {
        state.data = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addInvoices, deleteInvoices  } = invoiceSilce.actions

export default invoiceSilce.reducer