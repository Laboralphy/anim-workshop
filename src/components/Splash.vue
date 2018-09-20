<template>
    <v-layout row wrap>
        <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
            <v-card transition="fade-transition">
                <v-img
                    class="yellow--text"
                    height="384px"
                    src="./static/images/anim-rotating-tiles.gif"
                >
                    <v-container fill-height fluid>
                        <v-layout fill-height>
                            <v-flex xs12 align-end flexbox>
                                <span class="headline anim-ws-title">Animation Workshop</span>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-img>
                <v-card-title>
                    <div class="grey--text">
                        <span>Conception & Design : </span>
                            <span class="about-d">Laboralphy</span><br/>
                        <span>Architecture : </span>
                            <span class="about-d">Vue.js</span>
                            <span>&amp;</span>
                            <span class="about-d">Electron</span>
                    </div>
                </v-card-title>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "Splash",

        data: function() {
            return {
                visible: false
            }
        },

        mounted: function() {
            this.visible = true;
        }
    }
</script>

<style scoped>
    .about-d {
        font-weight: bold;
        color: #ccc;
    }

    .anim-ws-title {
        text-shadow: 0 0 0.5em rgb(0, 0, 0);
    }
</style>