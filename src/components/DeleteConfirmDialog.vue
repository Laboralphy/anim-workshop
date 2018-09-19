<template>
    <v-dialog
            v-model="dialog"
            width="500px"
    >
        <v-card>
            <v-card-title
                    class="headline"
                    primary-title
            >
                Confirmation de suppression
            </v-card-title>
            <v-card-text v-if="getSelectedFrames().length === 0">
                Pas de suppression : Aucune image n'a été sélectionnée.
            </v-card-text>
            <v-card-text v-else-if="getSelectedFrames().length === 1">
                Confirmer la suppression de l'image sélectionnée ?
            </v-card-text>
            <v-card-text v-else>
                Confirmer la suppression des {{ getSelectedFrames().length }} images sélectionnées ?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        flat
                        @click="dialog = false"
                >
                    Annuler
                </v-btn>
                <v-btn
                        v-if="getSelectedFrames().length > 0"
                        flat
                        @click="confirmClicked"
                >
                    Confirmer
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex';
    import * as types from '../store/types';
    export default {
        name: "DeleteConfirmDialog",
        computed: {
            ...mapGetters(['getSelectedFrames'])
        },
        data: function() {
            return {
                dialog: false
            };
        },
        methods: {
            confirmClicked: function() {
                this.$store.dispatch(types.DELETE_SELECTED_FRAMES);
                this.dialog = false;
            }
        }
    }
</script>

<style scoped>

</style>