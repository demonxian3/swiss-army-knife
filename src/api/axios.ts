import axios from "axios"
import { API } from "@/configs/requestMap"
import { message } from "antd";
import cookies from "js-cookie";

interface IResponse {
    code: number;
    data: any;
    msg: string;
}

axios.defaults.baseURL = '//xxxdemonxian3.com/account/';
axios.defaults.withCredentials = true;
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.patch["Content-Type"] = "application/json";

axios.defaults.transformRequest = [function (data, headers) {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        return JSON.stringify(data);
    } if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
        return data;
    }
    headers['Content-Type'] = 'application/json';
    return JSON.stringify(data);
}];

axios.interceptors.request.use(
    (config) => {
        const token = cookies.get("token") || "";
        config.headers.Authorization = `Bearer ${token}`;

        // requestCount为0，才创建loading, 避免重复创建
        // if (config.headers.isLoading !== false) {
            // showLoading();
        // }
        // const token = getCookie("PANDORA_OPEN_TOKEN") ? getCookie("PANDORA_OPEN_TOKEN") : getParam.token;
        // if (token) {
        //     
        // }
        // config.headers.Authorization = `Bearer 10003`;
        // const defaultLg = getDefaultLng() || "zh";
        // config.params = {
        //     lng: defaultLg,
        //     ...config.params,
        // };
        // console.log(config)
        return config;
    },
    (error) => {
        // 判断当前请求是否设置了不显示Loading
        // if (error.config.headers.isLoading !== false) {
        //     hideLoading();
        // }
        return Promise.reject(error);
    },
);


axios.interceptors.response.use(
    (response) => {
        return response.data;
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        // 判断当前请求是否设置了不显示Loading
        // if (response.config.headers.isLoading !== false) {
        //     hideLoading();
        // }
        // if (response.status === 200) {
        //     const { data } = response;
        //     const originUrl = window.location.href;
        //     const redUrl = encodeURIComponent(originUrl);
        //     const loginUrl = `${GetUrl(process.env.INFO.FUNK, 'LoginPageUrl')}?redirect=${redUrl}`;
        //     const applyUrl = GetUrl(process.env.INFO.FUNK, 'ApplyPageUrl');
        //     if (Object.prototype.hasOwnProperty.call(data, 'code')) {
        //         switch (true) {
        //             case data.code === -21108: {
        //                 const modal = confirm({
        //                     // icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        //                     title: "提示",
        //                     content: "您的创建项目申请已提交游戏管理员审批，审批通过后可查看项目",
        //                     okText: "查看申请记录",
        //                     cancelText: "确认",
        //                     onOk () {
        //                         location.href = "/acc/applyRecord"
        //                     },
        //                     onCancel () {
        //                         modal.destroy()
        //                     },
        //                 });
        //                 data.code = 0;
        //                 return data;
        //             }
        //             case data.code <= -20301 && data.code >= -20312:
        //                 {
        //                     console.log("code:", data.code);
        //                     // window.location.href = loginUrl;
        //                 }
        //                 break;
        //             // 短信校验失败错误码-20502
        //             case data.code <= -20503 && data.code >= -20511:
        //             {
        //                 confirm({
        //                     title: "对不起，您还未申请当前访问接口的权限",
        //                     content: "权限校验",
        //                     okText: "申请权限",
        //                     cancelText: "取消",
        //                     onOk () {
        //                         return (window.location.href = applyUrl);
        //                     },
        //                     onCancel () {
        //                         return window.open(originUrl);
        //                     },
        //                 });
        //             }
        //             default: {
        //                 return data;
        //             }
        //         }
        //     } else {
        //         message.error(response);
        //         return;
        //     }
        // } else {
        //     message.error(response);
        //     return;
        // }
    },
    (error) => {
        console.log(error); // for debug
        
        switch (error.code) {
            case "ECONNABORTED":
                message.error("网络异常：connection timeout");
                break;
            case "ERR_CANCELED":
                console.log("request canceled")
                break;
            // case "ERR_BAD_RESPONSE":
            //     message.error("网络异常：bad response");
            //     break;
            case "ERR_NETWORK":
                message.error("网络异常：network error");
                break;
        }

        

        if (error.response?.status === 401) {
            // window.location.href = "/acc/login";
        }

        if (error.response?.data?.code) {
            const code = error.response?.data?.code
            const msg = error.response?.data?.msg

            if (code > 40000 && code < 50000) {
                console.error(msg)
                message.error("系统异常");
            }

            else if (code > 50000 && code < 60000) {
                console.error(msg)
                message.error("服务器异常");
            }
        }

        return Promise.reject(error);
    },
);

// const controller = new AbortController();
// const request = {
//     get(url: string, params?: any) {
//         return axios<IResponse, IResponse>({
//             signal: controller.signal,
//             url,
//             method: "get",
//             params
//         });
//     },
//     post(url: string, data: any) {
//         return axios<IResponse, IResponse>({
//             signal: controller.signal,
//             url,
//             method: "post",
//             data
//         });
//     },
//     put(url: string, data: any) {
//         return axios<IResponse, IResponse>({
//             signal: controller.signal,
//             url,
//             method: "put",
//             data
//         });
//     },
//     delete(url: string, data: any) {
//         return axios<IResponse, IResponse>({
//             signal: controller.signal,
//             url,
//             method: "delete",
//             data
//         });
//     },
//     patch(url: string, data: any) {
//         return axios<IResponse, IResponse>({
//             signal: controller.signal,
//             url,
//             method: "patch",
//             data
//         });
//     },
//     abort() {
//         controller.abort();
//     }
// }

export default axios;
export {API}