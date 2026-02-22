import axios from 'axios';

// 基本配置
const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // Mock 或者真实域名
    timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 从 localStorage 或 zustand store 取 token 进行拦截处理
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        const res = response.data;
        // 假设约定 code 为 200 时表示成功
        if (res.code === 200) {
            return res;
        }

        // 如果返回 401，一般表示未授权或 token 失效
        if (res.code === 401) {
            localStorage.removeItem('token');
            // 可以派发一个全局事件跳回登录
            window.location.href = '/login';
        }

        return Promise.reject(new Error(res.message || 'Error'));
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default request;
