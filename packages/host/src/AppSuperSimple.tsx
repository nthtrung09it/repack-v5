import {Federated} from '@callstack/repack/client';
import React from 'react';
import {Text, View} from 'react-native';
import SplashScreen from './SplashScreen';

const MiniAppScreen = React.lazy(() =>
  Federated.importModule('miniapp', './MiniAppScreen'),
);

export const AppSuperSimple: React.FC = () => {
  console.log('*** render splash simple');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>This is my SplashSimple 2</Text>
      <View style={{width: 300, height: 250}}>
        <React.Suspense fallback={<SplashScreen />}>
          <MiniAppScreen />
        </React.Suspense>
      </View>
    </View>
  );
};
