export default {

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


    /**
     * Renvoie le message d'erreur générale de l'application
     * @param state
     * @returns {function(): *}
     */
    getError: state => () => state.error,
}