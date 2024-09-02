import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { StackNavigationProp } from '@react-navigation/stack';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { RootState } from '../redux/store';

type RootStackParamList = {
  Home: undefined;
};

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ResultScreenNavigationProp;
};

const ResultScreen: React.FC<Props> = ({ navigation }) => {
  const selectedResult = useSelector((state: RootState) => state.search.selectedResult);
  const [isEmulator, setIsEmulator] = useState(false);

  useEffect(() => {
    const checkEmulator = async () => {
      const emulatorStatus = await DeviceInfo.isEmulator();
      setIsEmulator(emulatorStatus);
    };

    checkEmulator();
  }, []);

  const handleGesture = (event: PanGestureHandlerGestureEvent) => {
    const { nativeEvent } = event;

    if (nativeEvent.state === State.END && nativeEvent.translationX < 50) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.viewScreen}>
      {selectedResult && (
        <>
          <Text>Name: {selectedResult.title}</Text>
          <Text>Episodes: {selectedResult.episodes || 1}</Text>
          <Text>Score: {selectedResult.score  || 0}</Text>
          <Text>Status: {selectedResult.status}</Text>
          <Text>Synopsis: {selectedResult.synopsis}</Text>
        </>
      )}
      <PanGestureHandler onHandlerStateChange={handleGesture}>
        <View style={styles.swipeButton}>
          <Text style={styles.buttonText}>Swipe left to back</Text>
        </View>
      </PanGestureHandler>
      {isEmulator && <Text>Running on an Emulator</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  viewScreen: {
    flex: 1,
    padding: 10,
    borderColor: 'lightblue',
    borderWidth: 1,
  },
  swipeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResultScreen;
