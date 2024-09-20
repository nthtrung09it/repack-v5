import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {DeckMoreActionSheetItem} from './DeckMoreActionSheetItem';

export enum DeckMoreActions {
  ViewDetail = 'ViewDetail',
  DeleteDeck = 'DeleteDeck',
  EditDeck = 'EditDeck',
}

export type DeckMoreActionsSheetContentProps = {
  onTypeSelected: (type: DeckMoreActions) => void;
};

export const strings = {
  deck_more_action_sheet__view_detail: 'View detail',
  deck_more_action_sheet__edit_deck: 'Edit Deck',
  deck_more_action_sheet__delete_deck: 'Delete Deck',
};

export const DeckMoreActionsSheetContent: React.FC<
  DeckMoreActionsSheetContentProps
> = ({onTypeSelected: onItemSelected}: DeckMoreActionsSheetContentProps) => {
  const items = useMemo(() => {
    const data = [
      {
        type: DeckMoreActions.ViewDetail,
        name: strings.deck_more_action_sheet__view_detail,
      },
      {
        type: DeckMoreActions.EditDeck,
        name: strings.deck_more_action_sheet__edit_deck,
      },
      {
        type: DeckMoreActions.DeleteDeck,
        name: strings.deck_more_action_sheet__delete_deck,
      },
    ];
    return data;
  }, []);

  const renderItems = useCallback(() => {
    return items.map(item => {
      return (
        <DeckMoreActionSheetItem
          key={item.type}
          type={item.type}
          name={item.name}
          onPress={() => onItemSelected(item.type)}
        />
      );
    });
  }, [items, onItemSelected]);

  return <View style={{paddingTop: 12}}>{renderItems()}</View>;
};
