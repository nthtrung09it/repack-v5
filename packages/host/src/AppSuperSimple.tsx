import {Federated} from '@callstack/repack/client';
import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import SplashScreen from './SplashScreen';

const MiniAppScreen = React.lazy(() =>
  Federated.importModule('miniapp', './MiniAppScreen'),
);

export const AppSuperSimple: React.FC = () => {
  const [showMiniApp, setShowMiniApp] = useState(false);

  console.log('*** render splash simple');

  const handleShowMiniApp = () => {
    setShowMiniApp(true);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>This is my SplashSimple</Text>
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
  );
};
