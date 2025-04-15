import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../features/counter/authSlice";
import profileReducer from "../features/counter/profileSlice";
import cartReducer from "../features/counter/cartSlice";
import courseReducer from "../features/counter/courseSlice";
import viewCourseReducer from "../features/counter/viewCourseSlice";

const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
});
export default rootReducer;