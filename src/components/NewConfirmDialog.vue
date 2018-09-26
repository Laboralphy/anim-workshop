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
                Demande de confirmation
            </v-card-title>
            <v-card-text>
                Commencer un nouveau projet ? Le projet actuel sera abandonné, toute modification non sauvegardée sera perdue.
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
        name: "NewConfirmDialog",
        data: function() {
            return {
                dialog: false
            };
        },
        methods: {
            confirmClicked: async function() {
                await this.$store.dispatch(types.SELECT_ALL_FRAMES);
                await this.$store.dispatch(types.DELETE_SELECTED_FRAMES);
                await this.$store.dispatch(types.SET_PROJECT_NAME, {name: ''});
                this.dialog = false;
            }
        }
    }
</script>

<style scoped>

</style>