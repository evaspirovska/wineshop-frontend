import axios from '../../axios/axiosInstance';
import {AUTHENTICATE_TOKEN, SIGN_IN, SIGN_OUT, SIGN_UP, UPDATE_TOKEN} from '../actionTypes';

export const AuthActions = {
    signUp: (name, surname, username, email, password, role, callback) => dispatch => {
        axios.post('/auth/signup', {
            name,
            surname,
            username,
            email,
            password,
            role
        }).then(resp => {
            dispatch({
                type: SIGN_UP,
                user: resp.data,
            });
            callback(true);
        }).catch(() => {
            callback(false);
        });
    },
    signIn: (username, password, callback) => dispatch => {
        axios.post('/auth/signin', {
            username,
            password
        }).then((jwtResponse) => {
            const respData = jwtResponse.data;
            const token = respData.token;
            const user = {
                id: respData.id,
                username: respData.username,
                email: respData.email,
                name: respData.name,
                surname: respData.surname,
                role: respData.role
            };
            dispatch({
                type: SIGN_IN,
                payload: {
                    token,
                    user
                }
            });
            callback && callback(true);
        }).catch(() => {
            callback && callback(false);
        });
    },
    signOut: () => dispatch => {
        dispatch({
            type: SIGN_OUT
        });
    },
    updateToken: (token) => dispatch => {
        dispatch({
            type: UPDATE_TOKEN,
            payload: token
        });
    },
    authenticateToken: (token, callback) => dispatch => {
        axios.post(`/auth/authenticateToken/${token}`).then(response => {
            dispatch({
                type: AUTHENTICATE_TOKEN,
                userId: response.data
            })
            callback(true, response);
        }).catch(error => {
            callback(false, error);
        })
    }
};
