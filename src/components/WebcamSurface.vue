<template>
    <video ref="o_video"></video>
</template>

<script>
    import wcs from '../services/snapshot';
    export default {
        name: "WebcamSurface",
        props: ['res', 'aspect'],
        data: function() {
            return {
                width: 0,
                height: 0
            }
        },
        methods: {
            /**
             * Convertit l'aspect en ratio
             * @param sAspect {string} vaut "4:3" ou "16:9"
             * @return {number} le ratio calculé
             */
            getRatio: function(sAspect) {
                switch (sAspect) {
                    case '4:3':
                        return 4 / 3;


                    case '16:9':
                        return 16 / 9;

                    default:
                        throw new Error('this aspect is not supported - ' + sAspect);
                }
            },
            /**
             * Démarrage de la webcam.
             * La balise video est alimentée par le flux issue de la caméra
             */
            startVideo: async function () {
                try {
                    const oVideo = this.$refs.o_video;
                    let ratio = this.getRatio(this.aspect);
                    wcs.init({
                        width: Math.round(this.res * ratio),
                        height: this.res
                    });
                    await wcs.start(oVideo);
                    const m = wcs.metrics();
                    this.width = m.width;
                    this.height = m.height;
                } catch (e) {
                    this.$emit('error', {error: e});
                }
            },

            /**
             * proxy vers wcs.capture
             * @param oCanvas {HTMLCanvasElement}
             */
            capture(oCanvas) {
                const oVideo = this.$refs.o_video;
                wcs.capture(oVideo, oCanvas);
            }
        },
        mounted: async function() {
            await this.startVideo();
        }
    }
</script>

<style scoped>
    video {
        width: 100%;
        height: 100%;
    }
    
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