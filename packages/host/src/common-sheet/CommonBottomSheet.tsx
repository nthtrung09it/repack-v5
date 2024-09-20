import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

export interface CommonBottomSheetHandle {
  present: () => void;
  dismiss: () => void;
}

export type CommonBottomSheetProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
};

export const calculateBottomInset = (insets: EdgeInsets) => {
  return insets.bottom > 0 ? insets.bottom : 16;
};

export const CommonBottomSheet = forwardRef<
  CommonBottomSheetHandle,
  CommonBottomSheetProps
>(({children, onDismiss}, ref) => {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetModalRef.current?.present(),
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <View style={StyleSheet.absoluteFill}>
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior={'close'}
        />
      </View>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      bottomInset={calculateBottomInset(insets)}
      enablePanDownToClose={true}
      style={styles.sheetContainer}
      backdropComponent={renderBackdrop}
      detached={true}
      onDismiss={onDismiss}>
      <BottomSheetView
        style={styles.sheetContainerStyle}
        enableFooterMarginAdjustment={true}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CommonBottomSheet.displayName = 'CommonBottomSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: 'rgba(0,0,0,0.25)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16.0,
    elevation: 24,
    overflow: 'hidden',
    zIndex: 10,
  },
  sheetContainerStyle: {
    // Add any common styles for the content container
  },
});
