import Vue from 'vue';
import store from './store';
import Application from './components/Application.vue';

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
