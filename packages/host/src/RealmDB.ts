import Realm from 'realm';
import {DeckRealm} from './DeckRealm';

let realmInstance: Realm | null = null;

export const realmSchema = [DeckRealm];
export const REALM_SCHEMA_VERSION = 4;

const openRealm = async (): Promise<Realm> => {
  if (realmInstance && !realmInstance.isClosed) {
    return realmInstance;
  }
  realmInstance = await Realm.open({
    schema: realmSchema,
    schemaVersion: REALM_SCHEMA_VERSION,
  });
  return realmInstance;
};
