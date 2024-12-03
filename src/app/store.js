import { configureStore, createSlice } from "@reduxjs/toolkit"
import { wordsApi } from "./../features/api/apiSlice"

// const counterSlice = createSlice({
//     name: 'n'
//     // ,
//     // reducer: {


//     // }
//     //  initialState: { value: 0 },
//     // reducers: {
//     // incr: state => {
//     //     state.value += 1
//     // },
//     // }

// })

export const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wordsApi.middleware)
});
