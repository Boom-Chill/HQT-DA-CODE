import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
    partnerData: [],
    search: ''
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.data = action.payload
    },
    addPartnerProducts: (state, action) => {
      state.partnerData = action.payload
    },
    addSearch: (state, action) => {
        state.search = action.payload
    },
    deletePartnerProducts: (state, action) => {
      state.partnerData = []
    },
    addSearchProducts: (state, action) => {
        state.data = action.payload
    },

    updateProducts: (state, action) => {
      state.data = [...state.data, action.payload]
      state.partnerData = [...state.partnerData, action.payload]
    },

  },
})

// Action creators are generated for each case reducer function
export const { addProducts, addSearch, addSearchProducts, addPartnerProducts, deletePartnerProducts, updateProducts  } = productsSlice.actions

export default productsSlice.reducer