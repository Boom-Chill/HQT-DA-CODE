import { createSlice } from '@reduxjs/toolkit'
import { user } from './../constants/user';

const initialState = {
    data: user,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    deleteUser: (state, action) => {
        state.data = null
        localStorage.removeItem('user')
    },

  },
})

// Action creators are generated for each case reducer function
export const { addUser, deleteUser  } = userSlice.actions

export default userSlice.reducer