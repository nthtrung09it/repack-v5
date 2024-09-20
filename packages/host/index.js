import {ScriptManager, Script, Federated} from '@callstack/repack/client';
import {AppRegistry, Platform} from 'react-native';
import {App} from './src/AppSuperSimple';
import {name as appName} from './app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {version as appVersion} from './package.json';
import getContainersURL from '../catalog-server/utils/getContainersURL';
// ScriptManager.shared.setStorage(AsyncStorage);

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  const containersURL = getContainersURL({
    // hostname: process.env.SAS_CATALOG_SERVER_URL,
    version: appVersion,
    platform: Platform.OS,
    appName,
  });

  console.log('--222----> ');
  const containersResponse = await fetch(containersURL);

  const containers = await containersResponse.json();
  console.log('*** containersResponse: ' + JSON.stringify(containers));

  console.log('---- scriptId: ' + scriptId + ' caller: ' + scriptId);

  const resolveURL = Federated.createURLResolver({
    containers,
  });

  let url;
  if (__DEV__ && caller === 'main') {
    url = Script.getDevServerURL(scriptId);
  } else {
    url = resolveURL(scriptId, caller);
  }
  console.log('**** url = ' + url);

  if (!url) {
    return undefined;
  }

  return {
    url,
    cache: !__DEV__,
    query: {
      platform: Platform.OS, // only needed in development
    },
    verifyScriptSignature: __DEV__ ? 'off' : 'strict',
  };
});

AppRegistry.registerComponent(appName, () => App);
