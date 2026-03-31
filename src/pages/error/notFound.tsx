import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useI18n()

    return (
        <Result
            className="min-h-81vh mt-5vh"
            style={{ width: '100%' }}
            status="404"
            title={t("notFound.title")}
            subTitle={t("notFound.subTitle")}
            extra={<Button type="primary" onClick={() => navigate('/')}>{t("notFound.backHome")}</Button>}
        />
    )
};

export default NotFoundPage;
