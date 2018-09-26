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
            <v-container class="text-xs-center">
                <v-layout row>
                    <v-flex xs6>
                        Veuillez patienter, Le film est en cours de création.
                    </v-flex>
                    <v-flex xs6>
                        <div class="text-xs-center">
                            <v-progress-circular
                                ref="o_progress_circ"
                                :rotate="-90"
                                :size="100"
                                :width="15"
                                :value="x"
                                color="accent"
                            >
                                {{ x }}%
                            </v-progress-circular>
                        </div>
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