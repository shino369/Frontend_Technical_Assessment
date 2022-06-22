import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { useNavigate } from 'react-router-dom'
import { AppThunk } from './index'

interface LoadingState {
    loading: boolean
}

const initialState: LoadingState = {
    loading: false
}

const loadingSlide = createSlice({
  name: 'loading',
  initialState,
  reducers: {

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    reset() {
      return initialState
    },
  },
})

export const {
    setLoading,
} = loadingSlide.actions
const { reset } = loadingSlide.actions
export default loadingSlide.reducer

export const initLoading =
  (loading: string): AppThunk =>
  async dispatch => {
    dispatch(reset())
    dispatch(setLoading(initialState.loading))
  }