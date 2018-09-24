<template>
    <v-card>
        <v-card-title primary-title>
            <v-layout row wrap>
                <v-flex xs12>
                    <span class="text-uppercase">Bande sonore</span>
                </v-flex>
            </v-layout>
        </v-card-title>
        <v-container>
            <v-layout row>
                <v-flex xs12 v-if="getMusicFilename()" class="text-xs-center">
                    <v-btn icon @click="clearFile">
                        <v-icon>mdi-music-off</v-icon>
                    </v-btn><span>{{ getMusicFilename().split('/').pop() }}</span>
                </v-flex>
                <v-flex xs12 v-else>
                    <label class="file-select">
                        <div class="select-button">
                            <span><v-icon>mdi-music</v-icon> Sélectionner un fichier...</span>
                        </div>
                        <input type="file" @change="handleFileChange"/>
                    </label>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import * as types from '../store/types';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "MusicUploader",

        data: function() {
            return {
                value: ''
            }
        },

        computed: {
            ...mapGetters([
                'getMusicFilename'
            ])
        },

        methods: {
            ...mapActions([types.SET_MUSIC, types.CLEAR_MUSIC]),
            handleFileChange: function(event) {
                let aFiles = event.target.files;
                if (aFiles.length > 0) {
                    this[types.SET_MUSIC]({file: aFiles[0].path});
                }
            },

            clearFile: function(event) {
                this[types.CLEAR_MUSIC]();
            }
        }
    }
</script>

<style scoped>
    .file-select > .select-button {
        padding: 0.5rem;
        color: white;
        background-color: #666;
        border-radius: .3rem;
        text-align: center;
        cursor: pointer;
    }

    /* Don't forget to hide the original file input! */
    .file-select > input[type="file"] {
        display: none;
    }
</style>