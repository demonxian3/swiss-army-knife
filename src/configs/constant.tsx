import  OriginPng  from "@/assets/icon/origin.png"
import  WegamePng  from "@/assets/icon/wegame.png"
import  XboxPng  from "@/assets/icon/xbox.png"
import  SteamPng  from "@/assets/icon/steam.png"


export const AdminType = {
    guest: 0b00000001,
    common: 0b00000010,
    project: 0b00000100,
    game: 0b00001000,
    plat: 0b00010000,
    super: 0b00100000,
    any: 0b11111111,
}

export const NoticeType = {
    roleAuth: 0b00000001,
    dataAuth: 0b00000010,
    projectAuth: 0b00000100,
    appAuth: 0b00001000,
}

export const WorkflowConfType = {
    joinProject: 0,
    createProject: 1,
    joinProjectEnd: 2,
}

export const adminTypeMap = {
    0: "普通成员",
    1: "项目管理员",
    2: "游戏管理员",
    3: "平台管理员",
    4: "超级管理员",
}

export const adminTypeMapBrev = {
    0: "普通",
    1: "项管",
    2: "游管",
    3: "平管",
    4: "超管",
}

export const adminTypeColorMap = {
    0: "#fdab03",
    1: "#44b4ae",
    2: "#1890ff",
    3: "#2a3297",
    4: "#f25757",
}


export const moduleMap = {
    1: "XBOX",
    2: "Origin",
    3: "STEAM",
    4: "WeGame",
}

export const moduleIconMap = {
    1: XboxPng,
    2: OriginPng,
    3: SteamPng,
    4: WegamePng,
}

export const powerTypeMap = {
    1: "后端接口",
    2: "页面元素",
}

export const powerStatusMap = {
    0: "可用",
    1: "禁用",
}

export const roleTypeMap = {
    1: "项目级",
    2: "游戏级",
}

export const platMap = {
    1: "主干版本",
    2: "虎牙专版",
}

export const envMap = {
    1: "沙箱环境",
    2: "正式环境",
}

export const JoinEndTip =
    "加入项目终审：未配置表示不开启终审。当前游戏下创建的所有项目，最终需要经过该流程的审批，才能加入项目。"
