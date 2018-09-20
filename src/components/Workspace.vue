<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs6 sm7 md8 lg6 offset-lg1>
                <Surfaces></Surfaces>
            </v-flex>
            <v-flex xs6 sm5 md4 lg4 pl-2
                    class="scroll-y">
                <Album @make-movie="albMakeMovie"></Album>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import Album from "./Album.vue";
    import Surfaces from "./Surfaces.vue";
    import {mapGetters, mapActions} from 'vuex';
    export default {
        name: "Workspace",
        components: {Surfaces, Album},

        computed: {
            ...mapGetters([
                'getProjectName'
            ])
        },

        methods: {
            albMakeMovie: async function() {
                // déterminer le nom
                let sProjectName = this.getProjectName();
                if (sProjectName === '') {
                    this.showAlert({type: 'warning', message: 'Enregistrement du projet requis, avant de pouvoir générer des images.'});
                }
                /*
                this.$emit('service-make-movie');
                const mm = new MovieMaker();
                await mm.setProject('.anim-workshop', 'xxx');
                const aFrames = this.getFrames();
                for (let iFrame = 0, nCount = aFrames.length; iFrame < nCount; ++iFrame) {
                    await mm.addFrame(aFrames[iFrame].src);
                    console.log('writing frame', iFrame);
                }*/
            }
        }

    }
</script>

<style scoped>

</style>