import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit"
import { wordsApi } from "./../features/api/apiSlice"
// import counterReducer from "./../store/slices/wordsProgressSlice";
// import { increment } from "./../store/slices/wordsProgressSlice";


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

const initialState = { value: 0 }
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value++
    },
    decrement(state) {
      state.value--
    },
    incrementByAmount(state, action) {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions


// // [wordsApi.reducerPath]: wordsApi.reducer,
// // [counterReducer.reducerPath]: counterReducer,
// const rootReducer = combineReducers({
//   user: wordsApi.reducer,
// })
// // counterReducer: counterReducer,

export const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer,
    wordsProgressSlice:counterSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wordsApi.middleware)
});
