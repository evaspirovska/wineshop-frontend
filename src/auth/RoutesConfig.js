import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../views/HomePage';
import SignInForm from '../views/auth/SignInForm';
import AdminPanel from "../views/admin/AdminPanel";
import Roles from './Roles';
import SignUpForm from "../views/auth/SignUpForm";
import CategoryForm from "../views/admin/category/CategoryForm";

export const PrivateRoutes = [
    {
        component: AdminPanel,
        path: '/admin',
        title: 'Admin Panel',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: CategoryForm,
        path: '/categories/add',
        title: 'Add Category',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: CategoryForm,
        path: '/categories/edit/:categoryId',
        title: 'Edit Category',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
];

export const PublicRoutes = [
    {
        component: HomePage,
        path: '/',
        title: 'Home',
        exact: true,
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: SignInForm,
        path: '/signin',
        title: 'Sign In',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: SignUpForm,
        path: '/signup',
        title: 'Sign Up',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
];

const AllRoutes = [...PrivateRoutes, ...PublicRoutes];

export const filterRoutes = (roleParam) => {
    return AllRoutes.filter(route => {
            if (route.permission.includes(roleParam)) {
                return true;
            }
        return false;
    });
};

const RoutesConfig = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [role, setRole] = useState(Roles.USER);

    useEffect(() => {
        if (currentUser) {
            setRole(currentUser.role);
        }
    }, [currentUser]);

    return (
        <Switch>
            {
                filterRoutes(role).map(route =>
                    <Route key={route.path} path={route.path} exact component={route.component} />
                )
            }
        </Switch>
    );
};
export default RoutesConfig;
