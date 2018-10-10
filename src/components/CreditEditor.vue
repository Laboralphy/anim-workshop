<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field v-model.trim="title" label="Titre"></v-text-field>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs8>
                <v-text-field v-model.trim="name" label="Crédit"></v-text-field>
            </v-flex>
            <v-flex xs4>
                <v-btn flat color="success" @click="add">Ajouter</v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-chip
                    v-for="name in getVideoCredits()"
                    :key="name"
                    close
                    @input="remove(name)"
                >{{ name }}</v-chip>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "CreditEditor",

        data: function() {
            return {
                name: ''
            };
        },

        computed: {
            ...mapGetters([
                'getVideoCredits',
                'getVideoTitle'
            ]),
            title: {
                get() {
                    return this.getVideoTitle();
                },
                set(title) {
                    this.creditTitle({title});
                }
            }
        },

        methods: {
            ...mapActions([
                'creditDeleteName',
                'creditAddName',
                'creditTitle'
            ]),
            remove: function(name) {
                this.creditDeleteName({name});
            },

            add: function() {
                this.creditAddName({name: this.name});
                this.name = '';
            },

            //setTitle: function() {
            //    this.creditTitle({title: this.title});
            //},

            feed: function() {
                this.title = this.getVideoTitle();
            }
        }
    }
</script>

<style scoped>

</style>