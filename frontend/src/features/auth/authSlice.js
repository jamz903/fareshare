/**
 * state management for authentication
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// thunk configuration for user registration. this is an asynchronous action which can be dispatched.
// this will generate three possible lifecycle action types: pending, fulfilled, and rejected
export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ username, password, re_password }, { rejectWithValue, dispatch }) => {
        console.log(Cookies.get('csrftoken'));
        // set axios config headers
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }
        try {
            // attempt to register user
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/accounts/register`,
                { username, password, re_password },
                config);
            return response.data;
        } catch (error) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    });

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        isAuthenticated: false,
        username: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(registerUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.username = payload.username;
            console.log('User registered successfully!')
        });
        builder.addCase(registerUser.rejected, (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.username = '';
            console.log('User registration failed.')
        });
    },
});

export default authSlice.reducer;