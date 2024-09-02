import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../components/screens/HomeScreen';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import animeReducer from '../components/redux/searchReducer';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createTestStore = (preloadedState: any) => {
  return configureStore({
    reducer: animeReducer,
    preloadedState,
  });
};

const mockNavigation: any = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore({
      anime: {
        searchResults: [],
        loading: false,
        error: null,
      },
    });
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: { data: [] } });
  });

  it('renders correctly and handles search', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check initial render
    expect(getByPlaceholderText('Search anime by title')).toBeTruthy();
    expect(getByText('No results found')).toBeTruthy();

    // Mock API response before simulating search
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [{ mal_id: 1, title: 'query', synopsis: '', episodes: 1, score: 0, status: ''}],
      },
    });

    // Simulate search
    const searchInput = getByPlaceholderText('Search anime by title');
    fireEvent.changeText(searchInput, 'query');

    // Push the state change through
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledWith('https://api.jikan.moe/v4/anime?q=query&limit=10&order_by=popularity&sort=asc&page=1'));

    // Check if the result is rendered
    await waitFor(() => {
      expect(queryByText('No results found')).toBeNull();
      expect(getByText('query')).toBeTruthy();
    });

    // Simulate pressing the result
    const resultItem = getByText('query');
    fireEvent.press(resultItem);

    // Check if navigation is called
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Result');
  });
});
