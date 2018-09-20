<template>
    <v-card>
        <v-card-title primary-title>
            <v-layout row wrap>
                <v-flex xs12 md6>
                    <v-badge right v-if="getFrameCount > 0">
                        <span slot="badge">{{ getFrameCount }}</span>
                        <span class="text-uppercase">{{ title }}</span>
                    </v-badge>
                    <span v-else class="text-uppercase">{{ title }}</span>
                </v-flex>
                <v-flex xs12 md6>
                    <v-badge color="#0A0" right v-if="getSelectedFrameCount > 0">
                        <span slot="badge">{{ getSelectedFrameCount }}</span>
                        <span>Sélectionnées</span>
                    </v-badge>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-container
            grid-list-md fluid
            style="height: 20em"
            scroll-y
        >
            <v-layout row wrap>
                <v-flex xs6 md4 lg3
                    v-for="f in getFrames()"
                    :key="f.id"
                >
                    <v-img
                        :src="f.src"
                        height="7em"
                        @click="phToggleSelect(f.id)"
                        :class="'photo ' + (f.selected ? 'selected' : '')"
                    ></v-img>
                </v-flex>
            </v-layout>
        </v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="getSelectedFrameCount === 0" icon @click="unselectAllFrames">
                        <v-icon>mdi-select-off</v-icon>
                    </v-btn>
                    <v-btn :disabled="getFrameCount === 0" icon @click="selectAllFrames">
                        <v-icon>mdi-select-all</v-icon>
                    </v-btn>
                    <v-btn :disabled="getSelectedFrameCount === 0" icon @click="deleteClicked">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn :disabled="getFrameCount === 0" icon @click="movieClicked">
                        <v-icon>mdi-movie</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-flex>
        </v-layout>
        <DeleteConfirmDialog ref="o_delete_dlg"></DeleteConfirmDialog>
    </v-card>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import * as types from '../store/types';
    import DeleteConfirmDialog from "./DeleteConfirmDialog.vue";

    export default {
        name: "Album",
        components: {DeleteConfirmDialog},
        data: function() {
            return {
                title: 'Album'
            };
        },
        computed: {
            ...mapGetters(['getFrames', 'getFrame', 'isFrameSelected', 'getSelectedFrames']),

            /**
             * Nombre de frames dans l'album
             */
            getFrameCount: function() {
                return this.getFrames().length;
            },

            /**
             * Nombre de frame sélectionnée
             */
            getSelectedFrameCount: function() {
                return this.getSelectedFrames().length;
            }
        },
        methods: {

            ...mapActions([types.SELECT_ALL_FRAMES, types.UNSELECT_ALL_FRAMES]),

            /**
             * On a cliqué sur le bouton de génération de film
             */
            movieClicked: function() {
                this.$emit('make-movie');
            },

            /**
             * on efface les photo sélectionnée, avec confirmation
             */
            deleteClicked: function() {
                this.$refs.o_delete_dlg.dialog = true;
            },

            phToggleSelect: function(id) {
                this.$store.dispatch(types.SELECT_FRAME, {id});
            },
        }
    }
</script>

<style scoped>

    .photo {
        cursor: pointer;
        border: solid 2px transparent;
    }

    .photo.selected {
        filter: brightness(133%);
        border: solid 2px #4F4;
    }

</style>