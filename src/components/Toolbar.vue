<template>
    <v-toolbar app>
		<v-toolbar-items>
            <v-btn icon to="/">
                <v-icon>mdi-home</v-icon>
            </v-btn>
		</v-toolbar-items>
        <v-toolbar-title>{{ getTitle }}</v-toolbar-title>
        <v-toolbar-items>
            <v-btn icon @click="$emit('project-rename')">
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn :disabled="!canBeSaved" icon @click="$emit('project-save')">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon @click="$emit('project-load')">
                <v-icon>mdi-folder-open</v-icon>
            </v-btn>
            <v-btn :disabled="!canBeRendered" icon @click="$emit('project-render')">
                <v-icon>mdi-movie</v-icon>
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "Toolbar",

        computed: {
            ...mapGetters([
                'getFrames',
                'getProjectName'
            ]),

            /**
             * renvoie le nombre de frame dans l'album
             * @return {number}
             */
            getFrameCount: function() {
                return this.getFrames().length;
            },

            /**
             * Renvoie le titre qu'il faut afficher dans la toolbar
             * il s'agit du nom du projet,
             * si le projet n'a pas de nom, on renvoie "(sans nom)"
             * @return {string}
             */
            getTitle: function() {
                return this.getProjectName() || '(Sans nom)';
            },

            /**
             * renvoie true si le projet peut être sauvegardé
             * @return {boolean}
             */
            canBeSaved: function() {
                return this.getProjectName() !== '';
            },

            /**
             * renvoie true si le projet peut être rendu en film
             * @return {boolean}
             */
            canBeRendered: function() {
                return this.canBeSaved && this.getFrameCount > 0;
            }
        }
    }
</script>

<style scoped>

</style>
