import Layout from '@/layout'
export default {
    routes: [{
            path: '/redirect',
            component: Layout,
            hidden: true,
            children: [{
                path: '/redirect/:path(.*)',
                component: () =>
                    import ('@/views/redirect')
            }]
        }, {
            name: 'login',
            path: '/',
            component: () =>
                import ("@/views/Login/login.vue")
        }, {
            path: '/community',
            component: () =>
                import ("@/views/Community/community.vue")
        }, {
            path: '/communityInfect',
            component: () =>
                import ("@/views/Community/infect.vue")
        },
        {
            path: '/communityImport',
            component: () =>
                import ("@/views/Community/import.vue")
        },
        {
            name: "register",
            path: "/register",
            component: () =>
                import ("@/views/Register/register.vue")
        },
        {
            name: "home",
            path: "/home",
            component: () =>
                import ("@/views/Overview/domestic")
        },
        {
            path: "/map",
            component: () =>
                import ("@/views/Region/map")
        },
        {
            path: "/aboard",
            component: () =>
                import ("@/views/Overview/foreign")
        }, {
            path: "/home1",
            component: () =>
                import ("@/views/Tendency/domestic")
        },
        {
            path: "/aboard1",
            component: () =>
                import ("@/views/Tendency/foreign")
        },
        {
            name: "track",
            path: "/track",
            component: () =>
                import ("@/views/People/track.vue")
        },
        {
            path: "/infect",
            component: () =>
                import ("@/views/People/infect.vue")
        },
        {
            path: "/connect",
            component: () =>
                import ("@/views/People/connect.vue")
        },
        {
            path: "/ci",
            component: () =>
                import ("@/views/People/connect_ci.vue")
        },
        {
            path: "/dept",
            component: () =>
                import ("@/views/system/dept")
        }
    ],
    // 去掉Vue地址的#
    mode: 'history'
}