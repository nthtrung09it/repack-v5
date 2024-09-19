import Realm from 'realm';

export class DeckRealm extends Realm.Object<DeckRealm> {
    public static schema: Realm.ObjectSchema = {
        name: 'Deck',
        primaryKey: 'id',
        properties: {
            id: 'string',
            name: 'string',
        },
    };

    id!: string;

    name!: string;
}
