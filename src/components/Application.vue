<template>
    <v-app dark>
        <v-toolbar app>
            <v-toolbar-title>{{ getTitle }}</v-toolbar-title>
            <v-toolbar-items>
                <v-btn icon @click="tbNameProject">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <Alerts></Alerts>
            <router-view></router-view>
        </v-content>
        <NameProjectDialog ref="o_rename_dlg"></NameProjectDialog>
    </v-app>
</template>

<script>
    import MainMenu from "./MainMenu.vue";
    import Surfaces from "./Surfaces.vue";
    import Album from "./Album.vue";
    import NameProjectDialog from "./NameProjectDialog.vue";
    import Alerts from './Alerts.vue';
    import {mapGetters, mapActions} from 'vuex';
    import MovieMaker from '../services/movie-maker';
    import * as types from '../store/types';

    export default {
        name: "Application",
        components: {NameProjectDialog, Album, Surfaces, MainMenu, Alerts},

        computed: {
            ...mapGetters([
                'getFrames',
                'getProjectName'
            ]),

            getTitle: function() {
                return this.getProjectName() || '(Sans nom)';
            }
        },

        methods: {
            tbNameProject: function() {
                this.$refs.o_rename_dlg.dialog = true;
            }
        },
    }
</script>

<style scoped>

</style>