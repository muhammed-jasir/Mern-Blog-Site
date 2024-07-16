import { configureStore, createSlice, current } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSucccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false,
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload;
        },
    },
});

export const { loginStart, loginSucccess, loginFailure } = userSlice.actions;

export default userSlice.reducer;