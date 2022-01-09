import axios from '../../axios/axiosInstance';
import {
    FETCH_PRODUCT,
    FETCH_PRODUCTS,
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,
} from '../actionTypes';

export const ProductActions = {
    fetchProduct: (id, callback) => dispatch => {
        axios.get(`/products/${id}`).then(resp => {
            dispatch({
                type: FETCH_PRODUCT,
                product: resp.data,
            });
            callback(true, resp);
        }).catch((error) => {
            callback(false, error);
        })
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
    addProduct: (product, callback) => dispatch => {
        axios.post(`/products/create`, product).then((response) => {
            dispatch({
                type: ADD_PRODUCT,
                product: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    updateProduct: (product, callback) => dispatch => {
        axios.put(`/products/update`, product).then((response) => {
            dispatch({
                type: UPDATE_PRODUCT,
                product: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
}