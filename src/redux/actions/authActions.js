import axios from '../../axios/axiosInstance';
import {AUTHENTICATE_TOKEN, SIGN_IN, SIGN_OUT, UPDATE_TOKEN} from '../actionTypes';

export const AuthActions = {
    signUp: (name, surname, username, email, password, role) => dispatch => {
        axios.post('/auth/register', {
            name,
            surname,
            username,
            email,
            password,
            role
        }).then(() => {
            dispatch(AuthActions.signIn(username, password));
        }).catch((resp) => {
            alert(resp.message);
        });
    },
    signIn: (username, password, callback) => dispatch => {
        axios.post('/auth/login', {
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
