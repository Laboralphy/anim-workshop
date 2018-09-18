<template>
    <v-app dark>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="mmToggle()">
                <v-icon>mdi-menu</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>
        <MainMenu
                ref="o_main_menu"
                title="Menu"
                :items="items"
                @select="mmSelected"
        ></MainMenu>
        <v-content>
            <v-alert
                    :value="!!getError()"
                    type="error"
            >
                {{ getError() }}
            </v-alert>
            <v-container fluid>
                <v-layout row wrap>
                    <v-flex xs6 sm7 md8 lg6 offset-lg1>
                        <MainScreen></MainScreen>
                    </v-flex>
                    <v-flex xs6 sm5 md4 lg4 pl-2
                        class="scroll-y">
                        <Album @make-movie="albMakeMovie"></Album>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import MainMenu from "./MainMenu.vue";
    import MainScreen from "./MainScreen.vue";
    import Album from "./Album.vue";
    import {mapGetters} from 'vuex';
    import MovieMaker from '../libraries/movie-maker';

    export default {
        name: "Application",
        components: {Album, MainScreen, MainMenu},

        data: function () {
            return {
                title: 'Atelier Animation',
                items: [{
                    id: 100,
                    title: 'Nouveau film',
                    icon: 'mdi-folder-plus'
                }, {
                    id: 101,
                    title: 'Ouvrir film',
                    icon: 'mdi-folder-open'
                }]
            };
        },

        computed: {
            ...mapGetters(['getError', 'getFrames'])
        },

        methods: {
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

            albMakeMovie: async function() {
                const mm = new MovieMaker();
                await mm.setDirectory('.anim-workshop', 'xxx');
                const aFrames = this.getFrames();
                for (let iFrame = 0, nCount = aFrames.length; iFrame < nCount; ++iFrame) {
                    await mm.addFrame(aFrames[iFrame].src);
                    console.log('writing frame', iFrame);
                }
            }
        }
    }
</script>

<style scoped>

</style>