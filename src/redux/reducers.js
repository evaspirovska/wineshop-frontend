import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from './reducers/authReducer';
import { CategoryReducer } from "./reducers/categoryReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    category: CategoryReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
