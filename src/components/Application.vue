<template>
    <v-app dark>
        <v-toolbar app>
            <v-toolbar-side-icon @click.stop="mmToggle()"><v-icon>mdi-menu</v-icon></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-toolbar>
        <MainMenu
            ref="o_main_menu"
            title="Menu"
            :items="items"></MainMenu>
        <v-content>
            <v-container fluid>
                Hello World
            </v-container>
        </v-content>
        <v-footer></v-footer>
    </v-app>
</template>

<script>
    import MainMenu from "./MainMenu.vue";
    export default {
        name: "Application",
        components: {MainMenu},

        data: function() {
            return {
                title: 'Accueil',
                items: [{
                    title: 'Nouveau film',
                    icon: 'mdi-folder-plus'
                }, {
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
            }
        }
    }
</script>

<style scoped>

</style>