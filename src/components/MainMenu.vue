<template>
    <v-navigation-drawer app temporary v-model="bVisible">
        <v-toolbar flat>
            <v-list>
                <v-list-tile>
                    <v-list-tile-title class="title">
                        {{ title }}
                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list dense class="pt-0">
            <v-list-tile
                    v-for="item in items"
                    :key="item.id"
                    @click="optionClicked(item.id)"
            >
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    import * as types from '../store/types';
    export default {
        name: "MainMenu",

        props: ['title'],

        data: function() {
            return {
                bVisible: false,
                items: [{
                    id: 'new',
                    title: 'Nouveau',
                    icon: 'mdi-folder-plus'
                }, {
                    id: 'load',
                    title: 'Ouvrir',
                    icon: 'mdi-folder-open'
                }, {
                    id: 'save',
                    title: 'Enregistrer',
                    icon: 'mdi-content-save'
                }]
            };
        },

        methods: {

            /**
             * Réinitialisation du projet
             * @private
             */
            _new: function() {
                this.$store.dispatch(types.CLEAR_FRAMES);
            },

            /**
             * Sauvegarder le projet dans un dossier
             * @private
             */
            _save: function() {

            },

            optionClicked: function(id) {
                let sMeth = '_' + id;
                if (sMeth in this) {
                    this[sMeth]();
                }
            }
        }
    }
</script>

<style scoped>

</style>