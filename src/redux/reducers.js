import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from './reducers/authReducer';

const rootReducer = combineReducers({
    auth:AuthReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
