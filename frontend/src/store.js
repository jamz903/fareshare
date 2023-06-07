import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import drawerReducer from './components/SideDrawer/drawerSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        drawer: drawerReducer
    },
});