export const API = {
    Auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        register: "/auth/register",
        protocol: "/auth/protocol",
        sendSMS: "/auth/sendSMS",
    },
    User: {
        getInfo: "/user/getInfo",
        getUserList: "/user/getUserList",
        updateInfo: "/user/updateInfo",
    },
    Game: {
        getGameList: "/game/getGameList",
        getGameDetail: "/game/getGameDetail",
        getGameWorkflow: "/game/getGameWorkflow",
        putGameWorkflow: "/game/putGameWorkflow",
    },
    Power: {
        getPowerList: "/power/getPowerList",
        putPowerData: "/power/putPowerData",
        patchPowerData: "/power/modPowerData",
        getFuncList: "/power/getFuncList",
        getFuncDetail: "/power/getFuncDetail",
        putFuncData: "/power/putFuncData",
        patchFuncData: "/power/modFuncData",
        delFuncRecord: "/power/delFuncRecord",
    },
    Role: {
        getRoleList: "/role/getRoleList",
        getRoleDetail: "/role/getRoleDetail",
        putRoleData: "/role/putRoleData",
        patchRoleFunc: "/role/patchRoleFunc",
        delRoleRecord: "/role/delRoleRecord",
    }
}
