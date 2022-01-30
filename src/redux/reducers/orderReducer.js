import {FETCH_ORDERS, MAKE_ORDER} from "../actionTypes";
import {sortElementsByDateCreated} from "../../utils/utils";

const initState = {
    orders: []
};

export const OrderReducer = (state = initState, action) => {
    switch (action.type) {
        case MAKE_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.order]
            };
        case FETCH_ORDERS:
            return {
                ...state,
                orders: sortElementsByDateCreated(action.orders),
            }
        default:
            return state;
    }
}