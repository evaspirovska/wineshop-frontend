import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from './reducers/authReducer';
import { CategoryReducer } from "./reducers/categoryReducer";
import { UserReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    category: CategoryReducer,
    user: UserReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
