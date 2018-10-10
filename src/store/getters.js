export default {

	isDark: state => () => state.dark,

    /**
     * Renvoie un etat simplifiée pour exportation
     * @param state
     * @return {function(): {frames: (Array|args.data.frames|{frame, url, name}|Window), lastFrameId: (Array|args.data.frames|{frame, url, name}|Window)}}
     */
    getProjectExport: state => () => {
        return {
            frames: state.frames,
            lastFrameId: state.lastFrameId,
            musicFile: state.musicFile,
            title: state.title,
            credits: state.credits
        };
    },

    getProjectName: state => () => state.name,

    getMusicFilename: state => () => state.musicFile,

    /**
     * Renvoie la liste des frames enregistrées dans le store
     * @param state
     * @returns {function(): *}
     */
    getFrames: state => () => state.frames,


    getUploadingVideo: state => () => state.uploadingVideo,

    getUploadingVideoStatus: state => () => {
        let suv = state.uploadingVideo;
        if (suv.filename === '') {
            return 0; // pas d'upload en cours, upload impossible car pas de fichier spécifié
        } else if (suv.filename !== '' && suv.size === 0) {
            return 1; // pas d'upload en cours, upload possible, prêt à etre déclenché
        } else  {
            return 2; // upload en cours
        }
    },

    /**
     * Renvoie true si la frame spécifée est selectionnée
     * @param state
     * @returns {function(*): (T | *)}
     */
    isFrameSelected: state => (id) => {
        let frame = state.frames.find(f => f.id === id);
        return frame && frame.selected;
    },

    /**
     * Renvoie la liste des frames selectionnées
     * @param state
     * @returns {function(): *}
     */
    getSelectedFrames: state => () => state.frames.filter(f => f.selected),

    /**
     * Renvoie la frame spécifiée par son identifiant
     * @param state
     * @returns {Function}
     */
    getFrame: state => (id) => {
        let frame = state.frames.find(f => f.id === id);
        if (frame && frame.selected) {
            return frame;
        } else {
            return null;
        }
    },

    getAlerts: state => () => {
        return state.alerts;
    },
    
    getProjectList: state => () => {
		return  state.projectList;
	},

    getVideoTitle: state => () => state.title,
    getVideoCredits: state => () => state.credits
}
