<template>
    <video ref="o_video"></video>
</template>

<script>
    import wcs from '../services/snapshot';
    export default {
        name: "WebcamSurface",
        props: ['res', 'aspect', 'width', 'height'],
        methods: {
            /**
             * Démarrage de la webcam.
             * La balise video est alimentée par le flux issue de la caméra
             */
            startVideo: async function () {
                try {
                    const oVideo = this.$refs.o_video;
                    wcs.init({
                        width: this.width,
                        height: this.height
                    });
                    await wcs.start(oVideo);
                    const m = wcs.metrics();
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