import { Breadcrumb } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import menuConfig, { MenuItem } from '@/configs/menuConfig';

const Crumb = () => {
    const items=[{ title: 'system'}]
    const location = useLocation();
    let parts = location.pathname.split('/')

    if (parts.length > 1) {
        const parentKey = parts[1]
        const childKey = parts.slice(1).join('_')

        const menuItem: MenuItem|undefined = menuConfig.items.find((item: MenuItem) => {
            return item.key === parentKey
        })

        if (menuItem) {
          items.push({title: menuItem.label})
          if (childKey !== parentKey && Array.isArray(menuItem.children)) {
            const childItem: MenuItem|undefined = menuItem.children.find((item: MenuItem) => {
              return item.key === childKey
            })
            
            if (childItem) {
                items.push({title: childItem.label})
            }
          }
        }
    }

    // menuConfig.items.find()
    return <Breadcrumb style={{ margin: '16px 0' }}  separator=">" items={items}/>
}

export default Crumb