import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {DeckMoreActions} from './DeckMoreActionsSheetContent';

export type DeckMoreActionSheetItemProps = {
  type: DeckMoreActions;
  name: string;
  onPress: () => void;
};

export const DeckMoreActionSheetItem: React.FC<
  DeckMoreActionSheetItemProps
> = ({name, onPress}: DeckMoreActionSheetItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          height: 44,
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}>
        <Text
          style={{
            fontSize: 16,
          }}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
