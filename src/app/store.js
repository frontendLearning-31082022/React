import { combineReducers, configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
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
    increment(state, { payload }) {
      state.value++
      console.log(payload);
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

export const postWordCheckResult = createAsyncThunk(
  'wordLearnResult',
  async (params, thunkAPI) => {
    const response = fetch(process.env.REACT_APP_API + process.env.REACT_APP_URL_patchWordLearnStatus + `?idWord=${params.id}&wrong=${params.wrong}`,{
      mode: "cors",
      method: "PATCH"
    });
    return response.data;
  }

)


// // [wordsApi.reducerPath]: wordsApi.reducer,
// // [counterReducer.reducerPath]: counterReducer,
// const rootReducer = combineReducers({
//   user: wordsApi.reducer,
// })
// // counterReducer: counterReducer,

export const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer,
    wordsProgressSlice: counterSlice
  },

  // extraReducers: (builder) => {
  //   // Add reducers for additional action types here, and handle loading state as needed
  //   builder.addCase(postWordCheckResult.fulfilled, (state, action) => {
  //     // Add user to the state array
  //     state.entities.push(action.payload)
  //   })
  // },


  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wordsApi.middleware)
});
