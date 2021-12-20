import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
}

export const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    addContracts: (state, action) => {      
        state.data = action.payload
    },

    deleteContracts: (state, action) => {
        state.data = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addContracts, deleteContracts } = contractSlice.actions

export default contractSlice.reducer