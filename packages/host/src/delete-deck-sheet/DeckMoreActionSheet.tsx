import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {DeckMoreActionsSheetContent} from './DeckMoreActionsSheetContent';
import {CommonBottomSheet, CommonBottomSheetHandle} from '../common-sheet';

export interface DeckMoreActionSheetHandle {
  present: () => void;
  dismiss: () => void;
}

export type DeckMoreActionSheetProps = {
  onTypeSelected: () => void;
};

export const DeckMoreActionsSheet = forwardRef<
  DeckMoreActionSheetHandle,
  DeckMoreActionSheetProps
>(({onTypeSelected}, ref) => {
  const bottomSheetRef = useRef<CommonBottomSheetHandle>(null);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  return (
    <CommonBottomSheet ref={bottomSheetRef}>
      <DeckMoreActionsSheetContent
        onTypeSelected={type => {
          bottomSheetRef.current?.dismiss();
          onTypeSelected();
        }}
      />
    </CommonBottomSheet>
  );
});
DeckMoreActionsSheet.displayName = 'DeckMoreActionsSheet';
