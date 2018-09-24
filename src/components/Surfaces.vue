<template>
    <v-card>
        <v-layout row>
            <v-flex xs12>
                <v-tabs
                        v-model="active"
                        slider-color="accent"
                        @input="tabChanged"
                >
                    <v-tab :key="1" ripple>Caméra</v-tab>
                    <v-tab :key="2" ripple>Snapshot</v-tab>
                    <v-tab-item :key="1">
                        <WebcamSurface @error="wcsError" :class="flash ? 'flash' : ''" ref="o_wcs" res="480" aspect="4:3"></WebcamSurface>
                    </v-tab-item>
                    <v-tab-item :key="2">
                        <PhotoSurface :class="flash ? 'flash' : ''" ref="o_photo"></PhotoSurface>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="playing" icon @click="previewPause">
                        <v-icon>mdi-pause</v-icon>
                    </v-btn>
                    <v-btn v-else icon @click="previewPlay">
                        <v-icon>mdi-play</v-icon>
                    </v-btn>
                    <v-btn icon v-shortkey="['space']" @shortkey="takePicture()" @click="takePicture()">
                        <v-icon>mdi-camera</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
    import WebcamSurface from "./WebcamSurface.vue";
    import PhotoSurface from "./PhotoSurface.vue";
    import * as types from "../store/types";
    import {mapActions} from 'vuex';

    const TAB_WEBCAM = 0;
    const TAB_SNAPSHOT = 1;

    export default {
        name: "Surfaces",
        components: {PhotoSurface, WebcamSurface},
        data: function() {
            return {
                active: 0,
                flash: '',
                playing: false
            };
        },
        methods: {

            ...mapActions([
                'addFrame',
                'showAlert'
            ]),

            /**
             * Lance un effet spécial visuel de type "flash"
             */
            triggerFlash() {
                this.flash = true;
                setTimeout(() => this.flash = false, 333);
            },

            /**
             * On dessine un truc dans le snapshoit :
             * changer l'onglet afin de voir le snapshot
             */
            setCanvasContent: function(oImage) {
                let oCanvas = this.$refs.o_photo.$refs.o_canvas;
                oCanvas.getContext('2d').drawImage(oImage, 0, 0);
                this.active = TAB_SNAPSHOT;
            },

            /**
             * Capture l'image actuelle et la stocke dans le canvas
             */
            takePicture: function() {
                let oCanvas = this.$refs.o_photo.$refs.o_canvas;
                let oWcs = this.$refs.o_wcs;
                oWcs.capture(oCanvas);
                this.triggerFlash();
                return this.addFrame({data: oCanvas.toDataURL('image/jpeg')});
            },

            /**
             * lance la lecture de l'animation
             */
            previewPlay: function() {
                this.active = 1;
                this.$refs.o_photo.startAnimation();
                this.playing = true;
            },

            /**
             * met l'animation en pause
             */
            previewPause: function() {
                this.$refs.o_photo.stopAnimation();
                this.playing = false;
            },

            /**
             * Une erreur est survenue lors de l'initialisation de la webcam
             * @param err {Error}
             */
            wcsError: function({error}) {
                let sExtraMessage = error.message || '(information non disponible)';
                let sBaseMessage = error.name;
                let sMsg = ([
                    'Erreur d\'initialisation Webcam',
                    sBaseMessage,
                    sExtraMessage
                ]).filter(s => !!s).join(' - ');
                this.showAlert({type: 'error', message: sMsg});
            },

            /**
             * on a changé de tab
             * si la tab active n'est plus TAB_SNAPSHOT alors on doit metter
             * l'animation en pause.
             */
            tabChanged: function() {
                if (this.active !== TAB_SNAPSHOT) {
                    this.previewPause();
                }
            }
        }
    }
</script>

<style scoped>
    @keyframes kf-flash {
        from {
            filter: brightness(500%);
        }
        to {
            filter: brightness(100%);
        }
    }

    .flash {
        animation-name: kf-flash;
        animation-duration: 333ms;
        animation-direction: normal;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
    }
</style>