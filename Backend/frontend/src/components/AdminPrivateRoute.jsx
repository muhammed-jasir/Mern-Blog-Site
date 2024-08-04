import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);

    if (!currentUser || !currentUser.isAdmin) {
        return <Navigate to='/login' />;
    }

    return <Outlet />;
}

export default AdminPrivateRoute