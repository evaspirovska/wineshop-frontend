import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../views/HomePage';
import SignInForm from '../views/auth/SignInForm';
import AdminPanel from "../views/admin/AdminPanel";
import Roles from '../enumerations/Roles';
import SignUpForm from "../views/auth/SignUpForm";
import CategoryForm from "../views/admin/category/CategoryForm";
import ChangePasswordForm from "../views/user/ChangePasswordForm";
import ForgotPasswordForm from "../views/user/ForgotPasswordForm";
import ProductForm from "../views/products/ProductForm";
import InvalidTokenView from "../views/user/InvalidTokenView";
import SentEmailView from "../views/user/SentEmailView";
import ProductView from "../views/products/ProductView";
import ShoppingCartView from "../views/shopping_cart/ShoppingCartView";
import OrderForm from "../views/orders/OrderForm";
import MyOrders from "../views/orders/MyOrders";
import ProductDetails from "../views/products/ProductDetails";
import ProductImage from "../views/products/productImage";
import PostmanForm from "../views/admin/PostmanForm";
import PostmanOrders from "../views/postman/PostmanOrders";
import AdminOrders from "../views/admin/AdminOrders";

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
    {
        component: ProductForm,
        path: '/products/add',
        title: 'Add Product',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: ProductForm,
        path: '/products/edit/:productId',
        title: 'Edit Product',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: PostmanForm,
        path: '/create-postman',
        title: 'Create Postman',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: PostmanOrders,
        path: '/postman-orders/:postman',
        title: 'Orders by postman',
        exact: true,
        permission: [
            Roles.POSTMAN
        ]
    },
    {
        component: AdminOrders,
        path: '/all',
        title: 'Orders by admin',
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
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: SignInForm,
        path: '/signin',
        title: 'Sign In',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: SignUpForm,
        path: '/signup',
        title: 'Sign Up',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: ForgotPasswordForm,
        path: '/forgot-password',
        title: 'Forgot Password',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: ChangePasswordForm,
        path: '/change-password/:authToken',
        title: 'Change Password',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: SentEmailView,
        path: '/forgot-password/sent-email',
        title: 'Successfully sent email',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: InvalidTokenView,
        path: '/forgot-password/invalid-token',
        title: 'Invalid Token',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: ProductView,
        path: '/products',
        title: 'Products',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: ProductDetails,
        path: '/products/:productId',
        title: 'Product Details',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: ProductImage,
        path: '/products/image/:productId/:imageName',
        title: 'Product Image',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: ShoppingCartView,
        path: '/shopping-cart/:username',
        title: 'Shopping Cart',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: OrderForm,
        path: '/order-form/:username',
        title: 'Order Form',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
    {
        component: MyOrders,
        path: '/my-orders/:username',
        title: 'Order Form',
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
