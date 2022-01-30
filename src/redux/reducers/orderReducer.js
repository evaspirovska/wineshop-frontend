import {MAKE_ORDER} from "../actionTypes";

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
        default:
            return state;
    }
}