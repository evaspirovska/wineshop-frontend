import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {AuthActions} from '../redux/actions/authActions';

export const AuthButton = ({path}) => {
    const auth = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();

    const signOut = () => {
        dispatch(AuthActions.signOut());
        window.location = '/';
    };

    return (
        <React.Fragment>
            {
                !Boolean(auth) ? <Link
                        to="/signin"
                        replace={false}
                        className={`nav-link shadow-outer 
                        ${path === 'signin' ? 'header-active' : null}`}
                    >
                        SIGN IN
                    </Link>
                    :
                    <Link
                        onClick={signOut}
                        className={`nav-link shadow-outer`}
                    >
                        SIGN OUT
                    </Link>
            }
        </React.Fragment>
    );
};
