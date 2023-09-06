import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: "Home",
            items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
        },
        {
            label: "Admin",
            items: [
                {
                    label: "Appointment List",
                    icon: "pi pi-fw pi-list",
                    to: "/pages/appointment-list",
                },
                {
                    label: "Specialization Management",
                    icon: "pi pi-fw pi-briefcase",
                    to: '/pages/specialist-manage'
                },
                {
                    label: "Time Management",
                    icon: "pi pi-fw pi-clock",
                    to: '/pages/time-manage'
                },
                {
                    label: "Chamber Menagement",
                    icon: "pi pi-fw pi-globe",
                    to: "/pages/chamber-manage"
                },
                {
                    label: "Doctor Management",
                    icon: "pi pi-fw pi-user-edit",
                    to: '/pages/doctor-manage'
                },
                {
                    label: "Availability Management",
                    icon: "pi pi-fw pi-book",
                    to: "/pages/availability-manage"
                },
                // {
                //     label: "General Setting",
                //     icon: "pi pi-fw pi-bookmark",
                //     to: '/pages/general-set'
                // },
                {
                    label: "SMS Templates",
                    icon: "pi pi-fw pi-comments",
                    to: '/pages/sms-temp'
                },
                // {
                //     label: "Z-Practice",
                //     icon: "pi pi-fw pi-bookmark",
                //     to: "/pages/Z-Practice"
                // }
            ],
        },
        {
            label: "Setting",
            icon: "pi pi-fw pi-briefcase",
            to: "/pages",
            items: [
                {
                    label: "Operator",
                    icon: "pi pi-fw pi-exclamation-circle",
                    to: "/pages/operator",
                },
                // {
                //     label: "Auth",
                //     icon: "pi pi-fw pi-user",
                //     items: [
                //         {
                //             label: "Login",
                //             icon: "pi pi-fw pi-sign-in",
                //             to: "/auth/login",
                //         },
                //         {
                //             label: "Error",
                //             icon: "pi pi-fw pi-times-circle",
                //             to: "/auth/error",
                //         },
                //         {
                //             label: "Access Denied",
                //             icon: "pi pi-fw pi-lock",
                //             to: "/auth/access",
                //         },
                //     ],
                // },
                // {
                //     label: "Not Found",
                //     icon: "pi pi-fw pi-exclamation-circle",
                //     to: "/pages/notfound",
                // },
            ],
        },
        ,
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
