export default {
    /**
     * chaque frame dispose de ce format :
     * {
     *     id: number,
     *     src: string,
     *     selected: boolean
     * }
     */
    frames: [], // liste de toutes les frames
    lastFrameId: 1, // dernier identifiant de frame attribué
    error: '', // message d'erreur à afficher
    name: '', // nom du projet
}