import {
    FETCH_PRODUCT,
    FETCH_PRODUCTS,
    FILTER_PRODUCTS,
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
} from '../actionTypes';
import {sortElementsByDateCreated} from "../../utils/utils";

const initState = {
    products: []
};

export const ProductReducer = (state = initState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS:
            return {
                ...state,
                products: sortElementsByDateCreated(action.products),
            };
        case FILTER_PRODUCTS:
            return {
                ...state,
                products: sortElementsByDateCreated(action.products),
            };
        case FETCH_PRODUCT:
            return {
                ...state,
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                products: sortElementsByDateCreated(state.products.filter(product => product.id !== action.productId)),
            };
        case ADD_PRODUCT:
            return {
                ...state,
                products: sortElementsByDateCreated([...state.products, action.product]),
            }
        case UPDATE_PRODUCT:
            let products = state.products.filter(product => product.id !== action.product.id);
            return {
                ...state,
                products: sortElementsByDateCreated([action.product, ...products]),
            };
        default:
            return state;
    }
}