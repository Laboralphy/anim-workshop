<template>
    <v-dialog
            v-model="dialog"
            width="50%"
            persistent
    >
        <v-card>
            <v-card-title
                    class="headline"
                    primary-title
            >
                Création du film
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                Le film est en cour de création à partir des images de l'album.
            </v-card-text>
            <v-container>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-progress-circular
                                ref="o_progress_circ"
                                :rotate="-90"
                                :size="100"
                                :width="15"
                                :value="x"
                                color="primary"
                        >
                            {{ x }}%
                        </v-progress-circular>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-divider></v-divider>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "FilmProgressDialog",
        data: function() {
            return {
                dialog: false,
                x: 0
            };
        },
        methods: {
            setProgress: function(x) {
                this.x = x;
            }
        }
    }
</script>

<style scoped>

</style>