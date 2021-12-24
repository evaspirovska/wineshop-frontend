import {
    FETCH_PRODUCT,
    FETCH_PRODUCTS,
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
        case FETCH_PRODUCT:
            const oldProducts = state.products.filter(product => product.id !== action.product.id);
            return {
                ...state,
                products: sortElementsByDateCreated([...oldProducts, action.product]),
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                products: sortElementsByDateCreated(state.products.filter(product => product.id !== action.productId)),
            };
        default:
            return state;
    }
}