<template>
    <v-app :dark="isDark()">
        <v-content>
            <Toolbar
                    @project-rename="tbProjectRename"
                    @project-save="tbProjectSave"
                    @project-render="tbProjectRender"
                    @project-load="tbProjectLoad"
                    @video-upload="tbVideoUpload"
            ></Toolbar>
            <Alerts></Alerts>
            <FlashText ref="o_flash_text"></FlashText>
            <router-view></router-view>
        </v-content>
        <NameProjectDialog ref="o_rename_dlg"></NameProjectDialog>
        <OpenProjectDialog ref="o_open_dlg" :projects="projectPreviews"
                           @load="tbProjectLoadConfirm"></OpenProjectDialog>
        <FilmProgressDialog ref="o_progress_dlg"></FilmProgressDialog>
        <VideoUploaderDialog ref="o_videoup_dlg" @uploaded="vuUploaded" @error="vuError"></VideoUploaderDialog>
    </v-app>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import projectManager from '../services/project-manager';

    import Surfaces from "./Surfaces.vue";
    import Album from "./Album.vue";
    import NameProjectDialog from "./NameProjectDialog.vue";
    import OpenProjectDialog from "./OpenProjectDialog.vue";
    import Alerts from './Alerts.vue';
    import Toolbar from "./Toolbar.vue";
    import FilmProgressDialog from "./FilmProgressDialog.vue";
    import FlashText from "./FlashText.vue";
    import VideoUploaderDialog from "./VideoUploaderDialog.vue";


    export default {
        name: "Application",
        components: {
            VideoUploaderDialog,
            FlashText,
            FilmProgressDialog,
            Toolbar,
            OpenProjectDialog,
            NameProjectDialog,
            Album,
            Surfaces,
            Alerts
        },

        computed: {
            ...mapGetters([
                'getFrames',
                'getProjectName',
                'getProjectExport',
                'isDark',
                'getMusicFilename'
            ]),
        },

        data: function () {
            return {
                projectPreviews: []
            }
        },


        methods: {

            ...mapActions([
                'showAlert',
                'importProject',
                'uploadVideo'
            ]),

            /**
             * Affiche un snackbar, généralement pour indiquer qu'une opération
             * s'est bien déroulée...
             * préférer showAlert pour afficher un message d'erreur important
             */
            showSnackbar: function(sMessage, sType) {
                this.$refs.o_flash_text.display(sMessage, sType);
            },

            /**
             * Vérification automatique et mise à jour du nom de projet
             */
            checkProjectName() {
                let sProjectName = this.getProjectName();
                if (sProjectName === '') {
                    this.showAlert({
                        type: 'warning',
                        message: 'Le projet doit être nommé avant d\'effectuer cette opération.'
                    });
                    return false;
                } else {
                    projectManager.setName(sProjectName);
                    return true;
                }
            },

            /**
             * click sur le changement du nom du projet :
             * activer le dialogue de saisie d'un nouveau nom
             */
            tbProjectRename: function () {
                let oDlg = this.$refs.o_rename_dlg;
                oDlg.name = this.getProjectName();
                oDlg.dialog = true;
            },

            /**
             * Sauvegarde du projet sous le nom donné
             * (voir évènement name-changed)
             */
            tbProjectSave: async function () {
                if (this.checkProjectName()) {
                    try {
                        await projectManager.saveProject(this.getProjectExport());
                        this.showSnackbar('Sauvegarde effectuée', 'success');
                    } catch (e) {
                        this.showAlert({
                            type: 'error',
                            message: 'Erreur durant la sauvegarde : ' + e.message
                        });
                    }
                }
            },

            /**
             * Création du film à partir des images de l'album
             * @return {Promise<void>}
             */
            tbProjectRender: async function () {
                const UPLOAD_AFTER_CREATION = true;
                let progressDlg = this.$refs.o_progress_dlg;
                try {
                    if (this.checkProjectName()) {
                        progressDlg.dialog = true;
                        let nCount = this.getFrames().length;
                        await projectManager.saveProject(this.getProjectExport());
                        await projectManager.saveFrames(this.getFrames().map(f => f.src));
                        await projectManager.makeFilm(this.getMusicFilename(), progress => {
                            progressDlg.setProgress(100 * progress / nCount | 0);
                        });
                        progressDlg.dialog = false;
                        progressDlg.setProgress(0);
                        this.showSnackbar('Création du film réussie', 'success');
                    }
                } catch (e) {
                    progressDlg.dialog = false;
                    this.showAlert({message: 'Erreur durant la phase de création de film. ' + e, type: 'error'});
                }
            },

            tbProjectLoad: async function () {
                let aProjects = await projectManager.getProjectList();
                this.projectPreviews.splice(0);
                aProjects.forEach(p => this.projectPreviews.push(p));
                let oDlg = this.$refs.o_open_dlg;
                oDlg.dialog = true;
            },

            /**
             * Chargement d'un projet
             * @param name {string}
             */
            tbProjectLoadConfirm: async function ({name}) {
                let data = await projectManager.loadProject(name);
                this.importProject({data, name});
            },

            tbVideoUpload: function() {
                let filename = projectManager.computeVideoFilename();
                projectManager.projectVideoExists().then(bExists => {
                    if (bExists) {
                        this.uploadVideo({filename});
                    } else {
                        this.uploadVideo({filename: ''});
                    }
                    this.$refs.o_videoup_dlg.dialog = true;
                });
            },

            vuError: function(e) {
                this.showSnackbar(e, 'error');
            },

            vuUploaded: function() {
                this.showSnackbar('Transmission video terminée', 'success');
            }
        },
    }
</script>

<style scoped>

</style>
