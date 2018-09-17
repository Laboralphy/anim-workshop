import Vue from 'vue';
import Vuetify from 'vuetify';
import store from './store';
import Application from './components/Application.vue';

import 'vuetify/dist/vuetify.css';
import 'mdi/css/materialdesignicons.min.css';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

function createApplication() {
    const app = new Vue({
        el: '#vue-application',
        store,
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
