<template>
    <v-card>
        <v-card-title primary-title>
            <v-layout row wrap>
                <v-flex xs12 md6>
                    <v-badge color="secondary" right v-if="getFrameCount > 0">
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
                    >
                        <v-btn icon :small="needSmallViewButtons" @click.stop="viewClicked(f)">
                            <v-icon :small="needSmallViewButtons">mdi-eye</v-icon>
                        </v-btn>
                    </v-img>
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
            ...mapGetters([
                'getFrames',
                'getFrame',
                'isFrameSelected',
                'getSelectedFrames'
            ]),

            needSmallViewButtons: function() {
                let n = this.$vuetify.breakpoint.name;
                return n === 'xs' || n === 'sm' || n === 'md' || n === 'lg';
            },

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

            ...mapActions([
                types.SELECT_ALL_FRAMES,
                types.UNSELECT_ALL_FRAMES,
                types.SELECT_FRAME
            ]),

            /**
             * on efface les photo sélectionnée, avec confirmation
             */
            deleteClicked: function() {
                this.$refs.o_delete_dlg.dialog = true;
            },

            phToggleSelect: function(id) {
                this[types.SELECT_FRAME]({id});
            },

            viewClicked: function(oFrame) {
                // copier l'image dans la vue snapshot
                let oImage = new Image();
                oImage.addEventListener('load', () => {
                    this.$emit('view-frame', {id: oFrame.id, image: oImage});
                });
                oImage.src = oFrame.src;
            }
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