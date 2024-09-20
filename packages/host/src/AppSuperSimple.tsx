import {Federated} from '@callstack/repack/client';
import React, {useCallback, useRef, useState} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import RNFS from 'react-native-fs';
import axios, {isCancel, AxiosError} from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RealmProvider} from '@realm/react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {
  getDecks,
  openRealm,
  REALM_SCHEMA_VERSION,
  realmSchema,
} from './RealmDB';
import {Provider} from 'react-redux';
import SplashScreen from './SplashScreen';
import {store} from './store/store';
import {useAppDispatch, useAppSelector} from './store/hook';
import {selectSimple, setSimple} from './store/simpleSlice';

const MiniAppScreen = React.lazy(() =>
  Federated.importModule('miniapp', './MiniAppScreen'),
);

export const AppSuperSimple: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSimple = useAppSelector(selectSimple);

  const [showMiniApp, setShowMiniApp] = useState(false);

  const path = `${RNFS.DocumentDirectoryPath}`;
  console.log('*** render splash simple RNFS: ' + path);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getData = () => {
    // Make a request for a user with a given ID
    axios
      .get('https://api.restful-api.dev/objects')
      .then(function (response) {
        // handle success
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  const handleShowMiniApp = async () => {
    getData();
    dispatch(setSimple(true));
    // const decks = await getDecks();
    // console.log('**** deck length: ' + decks.length);
    setShowMiniApp(true);
  };

  const simple = () => {
    if (isSimple) {
      return 'is Simple true';
    } else {
      return 'is Simple false';
    }
  };

  const showBottomSheet = useCallback(() => {}, []);
  return (
    <RealmProvider schema={realmSchema} schemaVersion={REALM_SCHEMA_VERSION}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'yellow',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="rocket" size={30} color="#900" />
        <Text>Is simple: [{simple()}]</Text>
        <Button title="Show Bottom Sheet" onPress={showBottomSheet} />
        {/* <Text>This is my SplashSimple with RNFS path {path}</Text> */}
        {!showMiniApp ? (
          <Button title="Show Mini App" onPress={handleShowMiniApp} />
        ) : (
          <View style={{width: 300, height: 250}}>
            <React.Suspense fallback={<SplashScreen />}>
              <MiniAppScreen />
            </React.Suspense>
          </View>
        )}
        <View>
          <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges}>
            <View></View>
            <BottomSheetView style={styles.contentContainer}>
              <Text>Awesome 🎉</Text>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </View>
    </RealmProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export const App = () => {
  return (
    <Provider store={store}>
      <AppSuperSimple />
    </Provider>
  );
};
