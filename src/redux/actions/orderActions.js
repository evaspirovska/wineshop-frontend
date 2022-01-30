import axios from "../../axios/axiosInstance";
import {
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
}