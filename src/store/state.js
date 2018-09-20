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
    alerts: [], // collection d'alerte
    lastAlertId: 1,
    name: '', // nom du projet
}