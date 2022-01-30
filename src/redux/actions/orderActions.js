import axios from "../../axios/axiosInstance";
import {
    FETCH_ORDERS,
    MAKE_ORDER
} from "../actionTypes";

export const OrderActions = {
    makeOrder: (order, callback) => dispatch => {
        axios.post(`/orders/makeOrder`, order).then(response => {
            dispatch({
                type: MAKE_ORDER,
                order: response.data,
            });
            callback(true, response)
        }).catch((error) => {
            callback(false, error)
        });
    },
    fetchOrders: (username, callback) => dispatch => {
        axios.get(`/orders?username=${username}`).then(response => {
            dispatch({
                type: FETCH_ORDERS,
                orders: response.data,
            });
            callback(true, response);
        }).catch(error => {
            callback(false,error)
        });
    },
}