import axios from "../../axios/axiosInstance";
import {
    FETCH_SHOPPING_CART,
    ADD_TO_SHOPPING_CART,
    DELETE_FROM_SHOPPING_CART,
} from "../actionTypes";

export const ShoppingCartActions = {
    fetchShoppingCart: (username, callback) => dispatch => {
        axios.get(`/shoppingCart/${username}`).then(response => {
            dispatch({
                type: FETCH_SHOPPING_CART,
                shoppingCart: response.data,
            });
            callback(true, response)
        }).catch((error) => {
            callback(false, error)
        });
    },
    deleteFromShoppingCart: (deleteFromCartDto, callback) => dispatch => {
        axios.post(`/shoppingCart/deleteProduct`, deleteFromCartDto).then(response => {
            dispatch({
                type: DELETE_FROM_SHOPPING_CART,
                message: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    addToShoppingCart: (username, productInCartDto, callback) => dispatch => {
        axios.post(`/shoppingCart/${username}/addToShoppingCart`, productInCartDto).then(response => {
            dispatch({
                type: ADD_TO_SHOPPING_CART,
                shoppingCart: response.data,
            });
            callback(true, response)
        }).catch((error) => {
            callback(false, error)
        });
    },
}