import {
    createHashRouter,
    RouteObject,
} from "react-router-dom";
import { lazy, Suspense } from 'react';
import routes from "@/configs/routeConfig"
import stores from "@/stores"
import { t } from "@/i18n"

function LazyElement(props: any) {
    const { importFunc } = props;
    const LazyComponent = lazy(importFunc);
    return (
        <Suspense fallback={<div style={{ paddingTop: 200, textAlign: 'center' }}>{t(stores.globalStore.localeKey, "common.loading")}</div>}>
            <LazyComponent />
        </Suspense>
    );
}

function dealRoutes(routesArr: RouteObject[]) {
    if (routesArr && Array.isArray(routesArr) && routesArr.length > 0) {
        routesArr.forEach((route) => {
            if (route.element && typeof route.element === 'function') {
                const importFunc = route.element;
                // eslint-disable-next-line no-param-reassign
                route.element = <LazyElement importFunc={importFunc} />;
            }
            if (route.children) {
                dealRoutes(route.children);
            }
        });
    }
}

dealRoutes(routes);
export { routes }
const router = createHashRouter(routes)
export default router
