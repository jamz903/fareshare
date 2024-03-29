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
            return await axios.post(
                `/accounts/register`,
                { username, password, re_password },
                config).then(response => {
                    return response.data;
                }).catch(error => {
                    throw error;
                })
        } catch (error) {
            if (error.response) {
                return rejectWithValue({
                    status: error.response.status,
                    message: error.response.data.error
                });
            } else {
                return rejectWithValue(error);
            }
        }
    });

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue, dispatch }) => {
        // set axios config headers
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }
        try {
            // attempt to login user
            return await axios.post(
                `/accounts/login`,
                { username, password },
                config).then(response => {
                    return response.data;
                }).catch(error => {
                    throw error;
                })
        } catch (error) {
            if (error.response) {
                return rejectWithValue({
                    status: error.response.status,
                    message: error.response.data.error
                });
            } else {
                return rejectWithValue(error);
            }
        }
    });

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async ({ rejectWithValue, dispatch }) => {
        // set axios config headers
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }
        try {
            // attempt to logout user
            const response = await axios.post(
                `/accounts/logout`,
                {},
                config);
            if (response.data.success) {
                return response.data
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                return rejectWithValue({
                    status: error.response.status,
                    message: error.response.data.error
                });
            } else {
                return rejectWithValue(error);
            }
        }
    });

export const checkAuthenticated = createAsyncThunk(
    'auth/checkAuthenticated',
    async ({ rejectWithValue, dispatch }) => {
        // set axios config headers
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            }
        }
        try {
            const promises = []
            const response = axios.get(
                `/accounts/authenticated`,
                config);
            promises.push(response);
            const results = await Promise.all(promises);
            return results[0].data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue({
                    status: error.response.status,
                    message: error.response.data.error
                });
            } else {
                return rejectWithValue(error);
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
            console.log('User registered and logged in successfully!')
        });
        builder.addCase(registerUser.rejected, (state, { payload, error }) => {
            state.loading = false;
            console.log('User registration failed.')
        });
        builder.addCase(loginUser.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(loginUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.username = payload.username;
            console.log('User logged in successfully!')
        });
        builder.addCase(loginUser.rejected, (state, { payload }) => {
            state.loading = false;
            console.log('User login failed.')
        });
        builder.addCase(logoutUser.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(logoutUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.username = '';
            console.log('User logged out successfully!')
        });
        builder.addCase(logoutUser.rejected, (state, { payload }) => {
            state.loading = false;
            console.log('User logout failed.')
        });
        builder.addCase(checkAuthenticated.pending, (state, { payload }) => {
            state.loading = true;
        });
        builder.addCase(checkAuthenticated.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = payload.is_authenticated;
            state.username = payload.username ? payload.username : '';
        });
        builder.addCase(checkAuthenticated.rejected, (state, { payload }) => {
            state.loading = false;
            console.log('User authentication check failed.')
        });
    },
});

export default authSlice.reducer;