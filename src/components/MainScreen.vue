<template>
    <v-card flat>
        <v-layout row wrap>
            <v-flex xs12>
                <v-tabs
                        v-model="active"
                        slider-color="#44FF44"
                >
                    <v-tab :key="1" ripple>Caméra</v-tab>
                    <v-tab :key="2" ripple>Snapshot</v-tab>
                    <v-tab-item :key="1">
                        <WebcamSurface :class="flash ? 'flash' : ''" ref="o_wcs" res="480" aspect="4:3"></WebcamSurface>
                    </v-tab-item>
                    <v-tab-item :key="2">
                        <PhotoSurface :class="flash ? 'flash' : ''" ref="o_photo"></PhotoSurface>
                    </v-tab-item>
                </v-tabs>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="takePicture()">
                        <v-icon>mdi-camera</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>mdi-undo</v-icon>
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

    export default {
        name: "MainScreen",
        components: {PhotoSurface, WebcamSurface},
        data: function() {
            return {
                active: '',
                flash: '',
            };
        },
        methods: {

            ...mapActions([
                'addFrame'
            ]),

            /**
             * Lance un effet spécial visuel de type "flash"
             */
            triggerFlash() {
                this.flash = true;
                setTimeout(() => this.flash = false, 333);
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
            }
        },
        mounted: function() {

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