import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
//, fetchFn: fetch

// queryFn: (arg, _api, _extraOptions, fetchWithBQ) => {
//     // debugger;
//     return {data: {} };
// }

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
      baseUrl: "http://192.168.1.45:8079/english/words/getNotLearned"
    }),
    endpoints: (builder) => ({
        popo: builder.query({
        query: () => "/"
      })
    })
  });
  
  export const { usePopoQuery } = apiSlice;
  


// http://192.168.1.45:8079/english/words/getNotLearned