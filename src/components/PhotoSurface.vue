<template>
    <div>
        <canvas ref="o_canvas" :width="video.width" :height="video.height"></canvas>
        <audio loop="loop" ref="o_audio">
            <source :src="getMusicFilename()"></source>
        </audio>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import config from '../services/config'

    export default {
        name: "PhotoSurface",

        data: function() {
            return {
                oInterval: null, // identifiant de la boucle intervalaire
                pAnimationHandler: null, // handler d'animation
                iFrame: 0,
                aFrames: [], // contient les images générés à partir des frames
                video: config.video
            }
        },

        computed: {
            ...mapGetters([
                'getFrames',
                'getMusicFilename'
            ]),


            /**
             * Nombre de frames dans l'album
             */
            getFrameCount: function() {
                return this.getFrames().length;
            }
        },

        methods: {

            animationLoop: function() {
                if (this.iFrame >= this.getFrameCount) {
                    this.iFrame = 0;
                }
                let oFrame = this.aFrames[this.iFrame];
                let oCanvas = this.$refs.o_canvas;
                let oContext = oCanvas.getContext('2d');
                oContext.drawImage(oFrame, 0, 0);
                ++this.iFrame;
            },

            /**
             * Démarre l'animation
             */
            startAnimation: function() {
                if (this.oInterval !== null) {
                    return;
                }
                this.$refs.o_audio.load();
                this.$refs.o_audio.play();
                let aFrameData = this.getFrames();
                let aProm = aFrameData
                    .map(f => f.src)
                    .map(f => new Promise(resolve => {
                        let oImg = new Image();
                        oImg.addEventListener('load', event => {
                            resolve(event.target);
                        });
                        oImg.src = f;
                    }));
                Promise.all(aProm).then(aImg => {
                    this.aFrames = aImg;
                    this.pAnimationHandler = () => this.animationLoop();
                    this.oInterval = setInterval(this.pAnimationHandler, 200);
                });
            },

            /**
             * Arrête l'animation
             */
            stopAnimation: function() {
                if (this.oInterval === null) {
                    return;
                }
                this.$refs.o_audio.pause();
                clearInterval(this.oInterval);
                this.oInterval = null;
            }
        },

        mounted: function() {
            let oCanvas = this.$refs.o_canvas;
            let oContext = oCanvas.getContext('2d');
            oContext.fillStyle = 'black';
            oContext.fillRect(0, 0, oCanvas.width, oCanvas.height);
        }
    }
</script>

<style scoped>
    canvas {
        width: 100%;
    }
</style>