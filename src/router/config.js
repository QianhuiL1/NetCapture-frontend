export default {
    routes: [{
            name: 'login',
            path: '/',
            component: () =>
                import ("@/views/Login/login.vue")
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
        }
    ],
    // 去掉Vue地址的#
    mode: 'history'
}