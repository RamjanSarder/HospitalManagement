import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
       
        {
            label: "Home",
            items: [
                {
                    label: "Appointment List",
                    icon: "pi pi-fw pi-server",
                    to: "/pages/appointment-list",
                },
                {
                    label: "Doctor Schedule",
                    icon: "pi pi-fw pi-bookmark",
                    to: '/pages/time-manage'
                },
                {
                    // label: "Test",
                    // icon: "pi pi-fw pi-bookmark",
                    to: '/pages/test'
                },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
