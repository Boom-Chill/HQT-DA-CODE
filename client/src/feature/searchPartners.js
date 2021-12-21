import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: [],
}

export const searchPartners = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    addPartners: (state, action) => {
      state.data = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addPartners  } = searchPartners.actions

export default searchPartners.reducer