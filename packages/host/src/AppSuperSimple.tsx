import {Federated} from '@callstack/repack/client';
import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import SplashScreen from './SplashScreen';
import RNFS from 'react-native-fs';

import Icon from 'react-native-vector-icons/FontAwesome';
import {RealmProvider} from '@realm/react';
import {
  getDecks,
  openRealm,
  REALM_SCHEMA_VERSION,
  realmSchema,
} from './RealmDB';
import {Provider} from 'react-redux';
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

  const handleShowMiniApp = async () => {
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
      </View>
    </RealmProvider>
  );
};

export const App = () => {
  return (
    <Provider store={store}>
      <AppSuperSimple />
    </Provider>
  );
};
