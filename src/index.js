import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import store from './store';
import Application from './components/Application.vue';

import 'vuetify/dist/vuetify.css';
import 'mdi/css/materialdesignicons.min.css';
import colors from 'vuetify/es5/util/colors';

import Workspace from './components/Workspace.vue';
import Splash from './components/Splash.vue';

Vue.use(Vuex);
Vue.use(Vuetify, {
    iconfont: 'mdi'
});
Vue.use(VueRouter);

function createApplication() {

    const routes = [
        {path: "/", component: Splash},
        {path: "/workspace", component: Workspace},
    ];

    const app = new Vue({
        el: '#vue-application',
        store: new Vuex.Store(store),
        router: new VueRouter({ routes }),
        components: {
            'application': Application
        },

        render: function(h) {
            return h(Application);
        },

        mounted: function() {
        }
    });
    return app;
}

export default {
    createApplication
};
