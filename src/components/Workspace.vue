<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs6 sm7 md8 lg6 offset-lg1>
                <Surfaces ref="o_surfaces"></Surfaces>
            </v-flex>
            <v-flex xs6 sm5 md4 lg4 pl-2>
                <v-layout row>
                    <v-flex xs12>
                        <Album @view-frame="albViewFrame"></Album>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12>
                        <MusicUploader></MusicUploader>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Album from "./Album.vue";
    import Surfaces from "./Surfaces.vue";
    import {mapGetters, mapActions} from 'vuex';
    import MusicUploader from "./MusicUploader.vue";
    import * as types from '../store/action-types';
    export default {
        name: "Workspace",
        components: {MusicUploader, Surfaces, Album},

        computed: {
            ...mapGetters([
                'getProjectName',
                'getFrame',
                'getFrames'
            ])
        },

        methods: {
            /**
             * visualisation d'une image dans la snapshot view
             */
            albViewFrame: function({id, image}) {
                this.$refs.o_surfaces.setCanvasContent(image);
            }
        }

    }
</script>

<style scoped>

</style>