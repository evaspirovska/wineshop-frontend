import axios from "../../axios/axiosInstance";
import {
    FETCH_ORDERS, FETCH_ORDERS_BY_POSTMAN,
    MAKE_ORDER, UPDATE_ORDER_STATUS
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
    fetchOrdersByPostman: (postman, callback) => dispatch => {
        axios.get(`/orders?postman=${postman}`).then(response => {
            dispatch({
                type: FETCH_ORDERS_BY_POSTMAN,
                ordersByPostman: response.data,
            });
            callback(true, response);
        }).catch(error => {
            callback(false,error)
        });
    },
    updateOrderStatus: (updateOrderStatusDto, callback) => dispatch => {
        axios.put(`/orders/update-status`, updateOrderStatusDto).then(response => {
            dispatch({
                type: UPDATE_ORDER_STATUS,
                order: response.data,
            })
        })
    }
}