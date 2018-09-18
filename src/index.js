import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import store from './store';
import Application from './components/Application.vue';

import 'vuetify/dist/vuetify.css';
import 'mdi/css/materialdesignicons.min.css';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuex);
Vue.use(Vuetify);

function createApplication() {
    const app = new Vue({
        el: '#vue-application',
        store: new Vuex.Store(store),
        components: {
            'application': Application
        },

        render: function(h) {
            return h(Application);
        },

        mounted: function() {
            console.log('mounted');
        }
    });
    return app;
}

export default {
    createApplication
};
