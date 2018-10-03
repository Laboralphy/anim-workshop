import * as types from './types';

export default {
    /**
     * Ajoute une nouvelle frame à l'album
     * @param state
     * @param data {string} donnée de l'image (encodage base 64)
     */
    [types.ADD_FRAME]: function(state, {data}) {
        const oPacket = {
            id: state.lastFrameId++,
            src: data
        };
        state.frames.push(oPacket);
    },

    /**
     * ajoute une nouvelle alert box à la collection
     * @param state
     * @param message {string} message de l'alert box
     * @param type {string} type d'alert box (warning, error etc...)
     */
    [types.SHOW_ALERT]: function(state, {message, type}) {
        let sa = state.alerts;
        while (sa.length > 0) {
            sa.shift();
        }
        sa.push({
            type,
            message,
            id: state.lastAlertId++
        });
    },


    /**
     * selection d'une image de l'album
     * @param state
     * @param id {number} identifiant de la frame selectionnée
     */
    [types.SELECT_FRAME]: function(state, {id}) {
        let sf = state.frames;
        let iFrame = sf.findIndex(f => f.id === id);
        if (iFrame >= 0) {
            let oFrame = sf[iFrame];
            oFrame.selected = !oFrame.selected;
            sf.splice(iFrame, 1, oFrame);
        } else {
            throw new Error('could not locate frame #' + id);
        }
    },

    /**
     * suppression de la frame sélectionnée
     * @param state
     */
    [types.DELETE_SELECTED_FRAMES]: function(state) {
        let sf = state.frames;
        for (let i = sf.length - 1; i >= 0; --i) {
            let f = sf[i];
            if (f.selected) {
                sf.splice(i, 1);
            }
        }
    },

    /**
     * sélection de toutes les frames de l'album
     * @param state
     */
    [types.SELECT_ALL_FRAMES]: function(state) {
        let sf = state.frames;
        for (let i = sf.length - 1; i >= 0; --i) {
            let f = sf[i];
            if (!f.selected) {
                f.selected = true;
                sf.splice(i, 1, f);
            }
        }
    },

    /**
     * désélection de toutes les frames de l'album
     * @param state
     */
    [types.UNSELECT_ALL_FRAMES]: function(state) {
        let sf = state.frames;
        for (let i = sf.length - 1; i >= 0; --i) {
            let f = sf[i];
            if (f.selected) {
                f.selected = false;
                sf.splice(i, 1, f);
            }
        }
    },

    /**
     * suppression de toutes les frames de l'album
     * @param state
     */
    [types.CLEAR_FRAMES]: function(state) {
        let sa = state.frames;
        sa.splice(0);
    },

    [types.SET_PROJECT_NAME]: function(state, {name}) {
        state.name = name;
    },

    [types.IMPORT_PROJECT]: function(state, {data}) {
        let sf = state.frames;
        sf.splice(0);
        data.frames.forEach(f => sf.push(f));
        state.lastFrameId = data.lastFrameId;
        state.name = data.name;
        state.musicFile = data.musicFile;
        state.title = data.title;
        state.credits = 'credits' in data ? data.credits : [];
    },
    
    /**
     * Remplacement de la liste des projets enregistré
     */
    [types.SET_PROJECT_LIST]: function(state, {projects}) {
		let n = state.projectList.length;
		state.projectList.splice(0, n, projects);
	},

    [types.SET_MUSIC]: function(state, {file}) {
        state.musicFile = file;
    },

    [types.CLEAR_MUSIC]: function(state) {
        state.musicFile = false;
    },

    [types.UPLOAD_VIDEO]: function(state, payload) {
        if ('filename' in payload) {
            state.uploadingVideo.filename = payload.filename;
        }
        if ('sent' in payload) {
            state.uploadingVideo.sent = payload.sent;
        }
        if ('size' in payload) {
            state.uploadingVideo.size = payload.size;
        }
    },

    [types.CREDIT_TITLE]: function(state, {title}) {
        state.title = title;
    },

    [types.CREDIT_SET_NAMES]: function(state, {names}) {
        state.credits.splice(0, state.credits.length, names.slice(0, 6));
    },

    [types.CREDIT_ADD_NAME]: function(state, {name}) {
        if (state.credits.length < 6) {
            state.credits.push(name);
        }
    },

    [types.CREDIT_DELETE_NAME]: function(state, {name}) {
        let id = state.credits.indexOf(name);
        if (id >= 0) {
            state.credits.splice(id, 1);
        }
    },

    [types.CREDIT_CLEAR_NAMES]: function(state) {
        state.credits.splice(0);
    },

    [types.SET_CONFIG]: function(state, payload) {
        state.dark = payload.dark;
    }
}
