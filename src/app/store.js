import { configureStore, createSlice } from "@reduxjs/toolkit"
import { apiSlice } from "./../features/api/apiSlice"

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
      [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware)
  });
  
