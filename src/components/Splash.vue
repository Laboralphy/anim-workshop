<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
                <v-card>
                    <v-img
                        class="yellow--text"
                        height="384px"
                        src="./assets/images/anim-nyan-cat.gif"
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
                            <span>Version : </span>
                                <span class="about-d">{{ version }}</span><br/>
                            <span>Conception : </span>
                                <span class="about-d">Raphaël Marandet</span><br/>
                            <span>Architecture : </span>
                                <v-icon>mdi-nodejs</v-icon><span class="about-d">Node.js</span>
                                <v-icon>mdi-vuejs</v-icon><span class="about-d">Vue.js</span>
                                <v-icon>mdi-atom</v-icon><span class="about-d">Electron.js</span>
                        </div>
                    </v-card-title>
                    <v-card-actions right>
                        <v-btn flat color="accent" to="/workspace">Démarrer</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import pjson from '../services/package-json';
    export default {
        name: "Splash",

        data: function() {
            return {
                visible: false
            }
        },

        computed: {
            /**
             * Renvoie le numéro de version
             * @return {string}
             */
            version: function() {
                return pjson.version;
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
