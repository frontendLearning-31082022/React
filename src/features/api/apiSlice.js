import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

  export const wordsApi = createApi({
    reducerPath: "missionsApi",
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.REACT_APP_API,
      mode: "cors"
    }),
    tagTypes:["completeWord"],
    endpoints: (builder) => ({
      words: builder.query({
        // query: () =>  process.env.REACT_APP_Words_getNoLearned,
        query: ({offset}) =>  process.env.REACT_APP_Words_getNoLearned+`?offset=${offset}`,
      }),
      completeWordStatus:builder.query({
        providesTags: ['completeWord'],
        query: ({id}) =>  process.env.REACT_APP_Words_complete_word_status+`?idWord=${id}`,
      }),
    })
  });
  
  export const { useWordsQuery,useCompleteWordStatusQuery } = wordsApi;
