<template>
    <v-app dark>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="mmToggle()">
                <v-icon>mdi-menu</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-toolbar-items>
            </v-toolbar-items>
        </v-toolbar>
        <MainMenu
                ref="o_main_menu"
                title="Menu"
                :items="items"
                @select="mmSelected"
        ></MainMenu>
        <v-content>
            <div>
                <v-alert
                        v-for="a in getAlerts()"
                        :type="a.type"
                        dismissible
                        :key="a.id"
                >
                    {{ a.message }}
                </v-alert>
            </div>
            <router-view></router-view>
        </v-content>
        <NameProjectDialog ref="o_rename_dlg"></NameProjectDialog>
    </v-app>
</template>

<script>
    import MainMenu from "./MainMenu.vue";
    import Surfaces from "./Surfaces.vue";
    import Album from "./Album.vue";
    import {mapGetters, mapActions} from 'vuex';
    import MovieMaker from '../services/movie-maker';
    import * as types from '../store/types';
    import NameProjectDialog from "./NameProjectDialog.vue";

    export default {
        name: "Application",
        components: {NameProjectDialog, Album, Surfaces, MainMenu},

        data: function () {
            return {
                alert: false,
                projectName: '',
                title: 'Atelier Animation',
                items: [{
                    id: 100,
                    title: 'Nouveau',
                    icon: 'mdi-folder-plus'
                }, {
                    id: 101,
                    title: 'Ouvrir',
                    icon: 'mdi-folder-open'
                }, {
                    id: 102,
                    title: 'Enregistrer',
                    icon: 'mdi-content-save'
                }]
            };
        },

        computed: {
            ...mapGetters([
                'getErrorMessage',
                'getFrames',
                'getProjectName',
                'getAlerts'
            ])
        },

        methods: {
            ...mapActions([
                'showAlert'
            ]),

            /**
             * Affiche/Cache le menu principal
             */
            mmToggle: function () {
                this.$refs.o_main_menu.bVisible = !this.$refs.o_main_menu.bVisible;
            },

            /**
             * une option du menu principal à été selectionnée
             * @param id {number|string} identifiant de l'option
             */
            mmSelected: function ({id}) {
                this.mmToggle();
            },

        },
    }
</script>

<style scoped>

</style>