<template>
    <canvas ref="o_canvas" width="640" height="480"></canvas>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "PhotoSurface",

        data: function() {
            return {
                oInterval: null, // identifiant de la boucle intervalaire
                pAnimationHandler: null, // handler d'animation
                iFrame: 0,
                aFrames: [] // contient les images générés à partir des frames
            }
        },

        computed: {
            ...mapGetters([
                'getFrames'
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