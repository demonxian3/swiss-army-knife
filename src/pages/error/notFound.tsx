import { Button, Result } from 'antd';
import { useNavigate, useRoutes } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Result
            className="min-h-81vh mt-5vh"
            style={{ width: '100%' }}
            status="404"
            title="404，找不到页面"
            subTitle="如果您是访问者，请检查url路径是否正确。如果您是网站管理员，请检查路由配置是否正确。"
            extra={<Button type="primary" onClick={() => navigate('/')}>返回首页</Button>}
        />
    )
};

export default NotFoundPage;