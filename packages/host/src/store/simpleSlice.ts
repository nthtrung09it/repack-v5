import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface SimpleState {
    isSimple: boolean;
}

const initialState: SimpleState = {
    isSimple: false,
};

export const simplerSlice = createSlice({
    name: 'simple',
    initialState,
    reducers: {
        setSimple: (state, action: PayloadAction<boolean>) => {
            state.isSimple = action.payload;
        },
    },
});

export const { setSimple } = simplerSlice.actions;

export const selectSimple = (state: RootState) => state.simple.isSimple;

export const simpleReducer = simplerSlice.reducer;
