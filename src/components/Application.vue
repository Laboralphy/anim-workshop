<template>
    <v-app dark>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="mmToggle()"><v-icon>mdi-menu</v-icon></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>
        <MainMenu
            ref="o_main_menu"
            title="Menu"
            :items="items"
            @select="mmSelected"
        ></MainMenu>
        <v-content>
            <v-container fluid>
                <v-layout row wrap>
                    <v-flex xs6 sm7 md8 lg8>
                        <MainScreen></MainScreen>
                    </v-flex>
                    <v-flex xs6 sm5 md4 lg4>
                        XXX
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer></v-footer>
    </v-app>
</template>

<script>
    import MainMenu from "./MainMenu.vue";
    import MainScreen from "./MainScreen.vue";
    export default {
        name: "Application",
        components: {MainScreen, MainMenu},

        data: function() {
            return {
                title: 'Accueil',
                items: [{
                    id: 100,
                    title: 'Nouveau film',
                    icon: 'mdi-folder-plus'
                }, {
                    id: 101,
                    title: 'Ouvrir film',
                    icon: 'mdi-folder-open'
                }]
            };
        },

        methods: {
            /**
             * Affiche/Cache le menu principal
             */
            mmToggle: function() {
                this.$refs.o_main_menu.bVisible = !this.$refs.o_main_menu.bVisible;
            },

            /**
             * une option du menu principal à été selectionnée
             * @param id {number|string} identifiant de l'option
             */
            mmSelected: function({id}) {
                console.log('option selected', id);
                this.mmToggle();
            }
        }
    }
</script>

<style scoped>

</style>