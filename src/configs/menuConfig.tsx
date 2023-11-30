import React from 'react'
import { LaptopOutlined, FileOutlined, UserOutlined, BorderOuterOutlined , 
    SolutionOutlined, ScheduleOutlined, DeploymentUnitOutlined, BlockOutlined, CrownOutlined} from '@ant-design/icons';

import { AdminType, NoticeType } from "@/configs/constant"

export interface MenuItem {
    key: string,
    link: string,
    label: string,
    secret?: number,
    notice?: number,
    icon?: React.FunctionComponentElement<any>
    group?: string,
    children?: Array<MenuItem>
} 

interface MenuConfig {
    title: string,
    rightNav: {
        label: string,
        link: string,
    },
    leftNav: {
        label: string,
        link: string,
    },
    items: MenuItems,
    defaultKey: string,
}

export type MenuItems = MenuItem[]

export default {
    title: `游戏管理平台`,
    rightNav: {
        label: `常见问题`,
        link: ``,
    },
    leftNav: {
        label: `文档详情`,
        link: ``,
    },
    items: [
        {
            key: `user`,
            link: `/user`,
            label: `账号信息`,
            group: `基本信息`,
            icon: React.createElement(UserOutlined),
        },
        {
            key: `game`,
            link: `/game`,
            label: `我的游戏`,
            group: `基本信息`,
            icon: React.createElement(LaptopOutlined),
        },
        {
            key: `project`,
            link: ``,
            label: `我的项目`,
            group: `基本信息`,
            icon: React.createElement(FileOutlined),
            children: [
                {
                    key: `project_joined`,
                    label: `已加入项目`,
                    link: `/project/joined`,
                },
                {
                    key: `project_expired`,
                    label: `已过期项目`,
                    link: `/project/expired`,
                }
            ]
        },
        {
            key: `applying`,
            link: `/applying`,
            label: `角色申请`,
            group: `权限申请`,
            icon: React.createElement(BorderOuterOutlined),
        },
        {
            key: `applied`,
            link: `/applied`,
            label: `申请记录`,
            group: `权限申请`,
            icon: React.createElement(SolutionOutlined ),
        },
        {
            key: `approve`,
            link: `/approve`,
            label: `由我审批`,
            group: `权限申请`,
            notice: NoticeType.appAuth | NoticeType.projectAuth | NoticeType.dataAuth | NoticeType.roleAuth,
            icon: React.createElement(ScheduleOutlined ),
            children: [
                {
                    key: `approve_approving`,
                    label: `待审批`,
                    link: `/approve/approving`,
                    notice: NoticeType.appAuth | NoticeType.projectAuth,

                },
                {
                    key: `approve_approved`,
                    label: `已审批`,
                    link: `/approve/approved`,
                    notice:  NoticeType.dataAuth | NoticeType.roleAuth,
                }
            ]
        },
        {
            key: `power`,
            link: `/power`,
            label: `接口管理`,
            group: `平台管理`,
            secret: AdminType.plat | AdminType.super,
            icon: React.createElement(DeploymentUnitOutlined ),
        },
        {
            key: `function`,
            link: `/function`,
            label: `功能管理`,
            group: `平台管理`,
            secret: AdminType.plat | AdminType.super,
            icon: React.createElement(BlockOutlined ),
        },
        {
            key: `admin`,
            link: `/admin`,
            label: `平台管理员`,
            group: `平台管理`,
            secret: AdminType.plat | AdminType.super,
            icon: React.createElement(CrownOutlined ),
        },

    ],
    defaultKey: 'user',
} as MenuConfig