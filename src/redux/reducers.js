import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from './reducers/authReducer';
import { AttributeReducer } from './reducers/attributeReducer';
import { CategoryReducer } from "./reducers/categoryReducer";
import { UserReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    attribute: AttributeReducer,
    category: CategoryReducer,
    user: UserReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
