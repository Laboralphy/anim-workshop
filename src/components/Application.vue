<template>
    <v-app :dark="isDark()">
        <v-content>
            <Toolbar
                @project-new="tbProjectNew"
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
        <NewConfirmDialog ref="o_new_confirm"></NewConfirmDialog>
    </v-app>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import projectManager from '../services/project-manager';
    import VideoMaker from '../services/video-maker';
    import CreditsGenerator from '../services/credits-generator';

    import Surfaces from "./Surfaces.vue";
    import Album from "./Album.vue";
    import NameProjectDialog from "./NameProjectDialog.vue";
    import OpenProjectDialog from "./OpenProjectDialog.vue";
    import Alerts from './Alerts.vue';
    import Toolbar from "./Toolbar.vue";
    import FilmProgressDialog from "./FilmProgressDialog.vue";
    import FlashText from "./FlashText.vue";
    import VideoUploaderDialog from "./VideoUploaderDialog.vue";
    import projectTree from "../services/project-tree";
    import NewConfirmDialog from "./NewConfirmDialog.vue";
    import config from '../services/config';
    import * as types from '../store/action-types';


    export default {
        name: "Application",
        components: {
            NewConfirmDialog,
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
                'getMusicFilename',
                'getVideoTitle',
                'getVideoCredits'
            ]),
        },

        data: function () {
            return {
                projectPreviews: []
            }
        },


        methods: {

            ...mapActions({
                'showAlert': types.SHOW_ALERT,
                'importProject': types.IMPORT_PROJECT,
                'uploadVideo': types.UPLOAD_VIDEO
            }),

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
                    projectTree.setName(sProjectName);
                    return true;
                }
            },

            /**
             * Remise a zero du projet
             */
            tbProjectNew: function() {
                this.$refs.o_new_confirm.dialog = true;
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


            _createImage(w, h) {
                let canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                let image = new Image();
                let commit = () => this._commitImage(canvas, image);
                return Object.create({
                    canvas, image, commit
                });
            },

            _commitImage(canvas, image) {
                return new Promise(resolve => {
                    let data = canvas.toDataURL('image/jpeg');
                    image.addEventListener('load', event => resolve(image));
                    image.src = data;
                });
            },

            /**
             * Création du film à partir des images de l'album
             * @return {Promise<void>}
             */
            tbProjectRender: async function () {
                let progressDlg = this.$refs.o_progress_dlg;
                try {
                    if (this.checkProjectName()) {
                        const WIDTH = config.video.width;
                        const HEIGHT = config.video.height;
                        progressDlg.dialog = true;
                        let vm = new VideoMaker();
                        await projectManager.saveProject(this.getProjectExport());
                        let aFrames = this.getFrames().map(f => f.src);
                        // ajouter : titre, et crédits de fin
                        // titre
                        const cg = new CreditsGenerator();

                        if (!!this.getVideoTitle()) {
                            let oFrameTitle = this._createImage(WIDTH, HEIGHT);
                            await cg.composeStartScreen(oFrameTitle.canvas, this.getVideoTitle());
                            oFrameTitle.commit();
                            let sTitleSrc = oFrameTitle.image.src;
                            for (let iTime = 0; iTime < 5 * 3; ++iTime) {
                                aFrames.unshift(sTitleSrc);
                            }
                        }

                        if (this.getVideoCredits().length) {
                            let oFrameTitle = this._createImage(WIDTH, HEIGHT);
                            await cg.composeEndCredits(oFrameTitle.canvas, 'FIN', this.getVideoCredits());
                            oFrameTitle.commit();
                            let sTitleSrc = oFrameTitle.image.src;
                            for (let iTime = 0; iTime < 5 * 3; ++iTime) {
                                aFrames.push(sTitleSrc);
                            }
                        }

                        let nCount = aFrames.length;

                        await projectManager.saveFrames(aFrames);
                        vm.on('progress', progress => {
                            progressDlg.setProgress(100 * progress / nCount | 0);
                        });
                        await vm.render(
                            projectTree.getFramesPath(),
                            this.getMusicFilename(),
                            projectTree.getOutputFilename()
                        );
                        progressDlg.dialog = false;
                        progressDlg.setProgress(0);
                        this.showSnackbar('Création du film réussie', 'success');
                    }
                } catch (e) {
                    progressDlg.dialog = false;
                    console.error(e);
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
                let filename = projectTree.getOutputFilename();
                projectTree.isOutputFileExists().then(bExists => {
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
