import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResultScreen from '../components/screens/ResultScreen';
import DeviceInfo from 'react-native-device-info';
import { jest } from '@jest/globals';
import searchReducer from '../components/redux/searchReducer';
import { State } from 'react-native-gesture-handler';

jest.mock('react-native-device-info');

const initialState = {
  search: {
    selectedResult: {
      mal_id: 1,
      title: 'Test Title',
      episodes: 12,
      score: 7.8,
      status: 'Finished',
      synopsis: 'Test synopsis',
    },
  },
};

const createTestStore = (preloadedState: any) => {
  return configureStore({
    reducer: searchReducer,
    preloadedState,
  });
};

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('ResultScreen Component', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore(initialState);
    jest.resetAllMocks();
    (DeviceInfo.isEmulator as jest.Mock<any>).mockResolvedValue(false);
  });

  it('renders the Result Screen with selected result', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <ResultScreen navigation={mockNavigation} />
      </Provider>
    );

    expect(getByText('Name: Test Title')).toBeTruthy();
    expect(getByText('Episodes: 12')).toBeTruthy();
    expect(getByText('Score: 7.8')).toBeTruthy();
    expect(getByText('Status: Finished')).toBeTruthy();
    expect(getByText('Synopsis: Test synopsis')).toBeTruthy();
  });

  it('displays emulator notice if running on an emulator', async () => {
    (DeviceInfo.isEmulator as jest.Mock<any>).mockResolvedValue(true);
    const { getByText } = render(
      <Provider store={store}>
        <ResultScreen navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => expect(getByText('Running on an Emulator')).toBeTruthy());
  });

  it('navigates back when swiped', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <ResultScreen navigation={mockNavigation} />
      </Provider>
    );

    const swipeButton = getByText('Swipe left to back');
    fireEvent(swipeButton, 'onHandlerStateChange', {
      nativeEvent: {
        state: State.END,
        translationX: -50,
      },
    });

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });
});
