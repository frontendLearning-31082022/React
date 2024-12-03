import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
//, fetchFn: fetch

// queryFn: (arg, _api, _extraOptions, fetchWithBQ) => {
//     // debugger;
//     return {data: {} };
// }
  export const wordsApi = createApi({
    reducerPath: "missionsApi",
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.REACT_APP_API,
      mode: "cors"
    }),
    endpoints: (builder) => ({
      words: builder.query({
        // query: () =>  process.env.REACT_APP_Words_getNoLearned,
        query: ({offset}) =>  process.env.REACT_APP_Words_getNoLearned+`?offset=${offset}`,
      }),
    })
  });
  
  export const { useWordsQuery } = wordsApi;
