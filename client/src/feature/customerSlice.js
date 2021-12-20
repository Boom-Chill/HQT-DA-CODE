import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: null,
}

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, action) => {      
        state.data = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addCustomer } = customerSlice.actions

export default customerSlice.reducer