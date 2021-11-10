import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../views/HomePage';
import Roles from './Roles';

export const PrivateRoutes = [

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
];

const AllRoutes = [...PrivateRoutes, ...PublicRoutes];

export const filterRoutes = (roles) => {
    return AllRoutes.filter(route => {
        for (let role of roles) {
            if (route.permission.includes(role)) {
                return true;
            }
        }
        return false;
    });
};

const RoutesConfig = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [roles, setRoles] = useState([Roles.USER]);

    useEffect(() => {
        if (currentUser) {
            setRoles(currentUser.roles);
        }
    }, [currentUser]);

    return (
        <Switch>
            {
                filterRoutes(roles).map(route =>
                    <Route key={route.path} path={route.path} exact component={route.component} />
                )
            }
        </Switch>
    );
};
export default RoutesConfig;
