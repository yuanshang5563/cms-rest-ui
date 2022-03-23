import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from './modules/app'
import iframe from './modules/iframe';
import user from './modules/user';
import menu from './modules/menu';
import dict from './modules/dict';
import tab from './modules/tab';

const store = new vuex.Store({
    modules: {
        app: app,
        tab: tab,
        iframe: iframe,
        user: user,
        menu: menu,
        dict: dict
    }
})

export default store