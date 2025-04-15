import axios from "axios";

export const axiosInstance = axios.create({});
//
// function isTokenExpired(token) {
//     try {
//         const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
//         return payload.exp * 1000 < Date.now(); // Compare `exp` to current time
//     } catch (error) {
//         return true; // Treat invalid tokens as expired
//     }
// }
// //we used the interceptor to intercept the request in between and check whether the token is expired or not
// //it prevent unusual behaviour when u are not logged out and your token is expired
// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token && isTokenExpired(token)) {
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//     }
//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// });



export const apiConnector=(method,url,bodyData,headers,params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData? bodyData : null,
        headers: headers? headers : null,
        params: params? params : null,
    })
}