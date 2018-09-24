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
            musicFile: state.musicFile
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
	}
}
