<template>
    <canvas ref="o_canvas" width="640" height="480"></canvas>
</template>

<script>
    export default {
        name: "PhotoSurface",

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