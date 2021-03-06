import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import VueShortkey from 'vue-shortkey';
import store from './store';
import Application from './components/Application.vue';

import 'vuetify/dist/vuetify.css';
import 'mdi/css/materialdesignicons.min.css';
import '../assets/styles/fonts.css';

import Workspace from './components/Workspace.vue';
import Splash from './components/Splash.vue';
import config from './services/config';

Vue.use(Vuex);
Vue.use(Vuetify, {
    iconfont: 'mdi',
    theme: {
        primary: "#EA80FC",
        secondary: "#9C27B0",
        accent: "#44FF44",
        error: "#f44336",
        warning: "#ffeb3b",
        info: "#2196f3",
        success: "#4caf50"
    }
});
Vue.use(VueRouter);
Vue.use(VueShortkey, {prevent: ['input', 'textarea']});

function createApplication() {

    const routes = [
        {path: "/", component: Splash},
        {path: "/workspace", component: Workspace},
    ];

    const app = new Vue({
        el: '#vue-application',
        store: new Vuex.Store(store),
        router: new VueRouter({routes}),
        components: {
            'application': Application
        },

        render: function (h) {
            return h(Application);
        }
    });
    return app;
}

export default {
    createApplication
};
