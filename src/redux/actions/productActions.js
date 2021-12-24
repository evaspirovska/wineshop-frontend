import axios from '../../axios/axiosInstance';
import {
    FETCH_PRODUCT,
    FETCH_PRODUCTS,
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
} from '../actionTypes';

export const ProductActions = {
    fetchProduct: id => dispatch => {
        axios.get(`/products/${id}`).then(resp => {
            dispatch({
                type: FETCH_PRODUCT,
                product: resp.data,
            });
        });
    },
    fetchAllProducts: () => dispatch => {
        axios.get("/products").then(resp => {
            dispatch({
                type: FETCH_PRODUCTS,
                products: resp.data,
            });
        });
    },
    deleteProduct: id => dispatch => {
        axios.delete(`/products/delete/${id}`).then(() => {
            dispatch({
                type: DELETE_PRODUCT,
                productId: id,
            });
        });
    },
}