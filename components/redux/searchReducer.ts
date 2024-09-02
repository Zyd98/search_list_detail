import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ItemDetail {
  mal_id: number;
  title: string;
  synopsis: string;
  episodes: number;
  score: number;
  status: string;
}

interface SearchState {
  results: ItemDetail[];
  selectedResult: ItemDetail | null;
}

const initialState: SearchState = {
  results: [],
  selectedResult: null,
};

export const searchReducer = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSelectedResult: (state, action: PayloadAction<ItemDetail>) => {
      state.selectedResult = action.payload;
    },
  },
});

export const { setSelectedResult } = searchReducer.actions;
export default searchReducer.reducer;
