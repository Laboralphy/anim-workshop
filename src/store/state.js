export default {
    /**
     * chaque frame dispose de ce format :
     * {
     *     id: number,
     *     src: string, // contenu data-url de l'image
     *     selected: boolean // si true, alors la frame est sélectionnée
     * }
     */
    frames: [], // liste de toutes les frames
    lastFrameId: 1, // dernier identifiant de frame attribué
    musicFile: false, // nom du fichier musical
    title: 'La bonne vidéo avec un titre',
    credits: ['Jojo Lapin', 'Patanouk', 'Gersiflet', 'Glouke', 'Oumphaha'],

    uploadingVideo: {
        filename: '',
        sent: 0,
        size: 0,
    },

    /**
     * chaque alerte dispose de ce format :
     * {
     *     id: number,
     *     type: string, (warning, error, success ...)
     *     message: string // contenu du message
     * }
     */
    alerts: [], // collection d'alerte
    lastAlertId: 1,
    name: 'test1', // nom du projet
    dark: true, // version dark ou light
    projectList: [] // liste des projets précédement enregistrés
}
