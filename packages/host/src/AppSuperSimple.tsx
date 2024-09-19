import {Federated} from '@callstack/repack/client';
import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import SplashScreen from './SplashScreen';
import RNFS from 'react-native-fs';

import Icon from 'react-native-vector-icons/FontAwesome';
import {RealmProvider} from '@realm/react';
import {REALM_SCHEMA_VERSION, realmSchema} from './RealmDB';

const MiniAppScreen = React.lazy(() =>
  Federated.importModule('miniapp', './MiniAppScreen'),
);

export const AppSuperSimple: React.FC = () => {
  const [showMiniApp, setShowMiniApp] = useState(false);

  const path = `${RNFS.DocumentDirectoryPath}`;
  console.log('*** render splash simple');

  const handleShowMiniApp = () => {
    setShowMiniApp(true);
  };

  return (
    <RealmProvider schema={realmSchema} schemaVersion={REALM_SCHEMA_VERSION}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="rocket" size={30} color="#900" />
        <Text>This is my SplashSimple with RNFS path {path}</Text>
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
