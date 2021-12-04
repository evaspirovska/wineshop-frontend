import {
    ADD_CATEGORY,
    DELETE_CATEGORY,
    FETCH_CATEGORIES,
    FETCH_CATEGORY,
    UPDATE_CATEGORY
} from "../actionTypes";

const initialState = {
    categories: []
}

export const CategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORIES:
            return {
                ...state,
                categories: action.categories
            };
        case FETCH_CATEGORY:
            const prevCategories = state.categories.filter(category => category.id !== action.category.id);
            return {
                ...state,
                clients: [...prevCategories, action.category],
            };
        case UPDATE_CATEGORY:
            const categories = state.categories.filter(category=>category.id !== action.category.id)
            return {
                ...state,
                categories: [...categories,action.category]
            };
        case ADD_CATEGORY:
            return {
                ...state,
                categories: [...state.categories, action.category]
            };
        case DELETE_CATEGORY:
            return {
                ...state,
                categories: state.categories.filter(category => category.id !== action.id)
            };
        default:
            return state;
    }
};
