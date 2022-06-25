export default {
    routes: [{
            path: "/home",
            component: () =>
                import ("@/views/Overview/domestic")
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