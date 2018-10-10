<template>
    <v-dialog
            v-model="dialog"
            width="50%"
    >
        <v-card>
            <v-card-title
                class="headline"
                primary-title
            >
                Nom du projet
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                Donner un nom au projet, ne serait-ce que pour pouvoir l'enregistrer sur disque,
                et ne pas le perdre.
            </v-card-text>
            <v-container>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-text-field @keypress.enter="confirmClicked" ref="o_project_name" v-model="name" label="Nom du projet" required></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
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
        name: "NameProjectDialog",
        computed: {
            ...mapGetters([
                'getProjectName'
            ])
        },

        data: function() {
            return {
                dialog: false,
                name: ''
            };
        },

        watch: {
            dialog: function(val) {
                if (val) {
                    this.$nextTick(() => this.$refs.o_project_name.focus());
                }
            }
        },

        methods: {
            confirmClicked: function() {
                this.$store.dispatch(types.SET_PROJECT_NAME, {name: this.name});
                this.dialog = false;
            }
        },

        mounted: function() {
            this.name = this.getProjectName();
        }
    }
</script>

<style scoped>

</style>
