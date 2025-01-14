import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserByName, getAuthRole } from '../../api/system/user'
const user = {
    state: {
        token: getToken(),
        name: '' || localStorage.getItem('name'),
        avatar: '',
        roles: '' || localStorage.getItem('roles'),
        permissions: [],
        examine: '',
        dept:'' || localStorage.getItem('dept')
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
            localStorage.setItem('name', name)
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
            localStorage.setItem('roles', roles)
        },
        SET_EXAMINE: (state, examine) => {
            state.examine = examine
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions
        },
        SET_DEPT: (state, dept) => {
            state.dept = dept
            localStorage.setItem('dept', dept)
        },
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            const code = userInfo.code
            const uuid = userInfo.uuid
                    return new Promise((resolve, reject) => {
                        login(username, password, code, uuid).then(res => {
                                setToken(res.token)
                            commit('SET_TOKEN', res.token)
                            getUserByName(userInfo.username).then((res1) => {
                getAuthRole(res1.rows[0].userId).then((response) => {
                    commit('SET_DEPT', response.user.deptId)
                    commit('SET_EXAMINE', response.user.examine)
                            commit('SET_NAME', userInfo.username + "," + response.user.nickName)
                            commit('SET_ROLES', response.user.roles[0].roleId)
                            resolve()
                        }).catch(error => {
                            reject(error)
                        })
                    })
                })
            })
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.user
                    const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
                    if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                        commit('SET_ROLES', res.roles)
                        commit('SET_PERMISSIONS', res.permissions)
                    } else {
                        commit('SET_ROLES', ['ROLE_DEFAULT'])
                    }
                    commit('SET_NAME', user.username)
                    commit('SET_AVATAR', avatar)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMISSIONS', [])
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
