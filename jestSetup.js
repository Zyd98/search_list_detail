import 'react-native-gesture-handler/jestSetup';

const { jest } = require('@jest/globals');

jest.mock('react-native-gesture-handler', () => {
  const GestureHandlerModule = jest.requireActual('react-native-gesture-handler');
  return {
    ...GestureHandlerModule,
    GestureHandlerRootView: jest.fn(({ children }) => children),
  };
});

jest.mock('react-native-device-info', () => {
  return {
    getUniqueId: jest.fn(() => 'unique-id'),
    isEmulator: jest.fn(() => Promise.resolve(false)),
  };
});
