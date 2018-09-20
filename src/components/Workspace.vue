<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs6 sm7 md8 lg6 offset-lg1>
                <Surfaces ref="o_surfaces"></Surfaces>
            </v-flex>
            <v-flex xs6 sm5 md4 lg4 pl-2>
                <v-layout row>
                    <v-flex xs12>
                        <Album @make-movie="albMakeMovie" @view-frame="albViewFrame"></Album>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import MovieMaker from '../services/movie-maker';
    import Album from "./Album.vue";
    import Surfaces from "./Surfaces.vue";
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: "Workspace",
        components: {Surfaces, Album},

        computed: {
            ...mapGetters([
                'getProjectName',
                'getFrame',
                'getFrames'
            ])
        },

        methods: {
            ...mapActions(['showAlert']),
            albMakeMovie: async function() {
                // déterminer le nom
                let sProjectName = this.getProjectName();
                if (sProjectName === '') {
                    this.showAlert({
                        type: 'warning',
                        message: 'Le projet doit être nommé avant de pouvoir créer un film.'
                    });
                } else {
                    const mm = new MovieMaker();
                    await mm.setProject(sProjectName);
                    const aFrames = this.getFrames();
                    await mm.saveFrames(aFrames.map(f => f.src));
                }
            },

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