import * as types from './types';


/**
 * le predicat doit renvoyer une instance différente de l'objet spécifié afinde valider le remplacement
 * ou bien renvouer null, pour commander la suppression de l'objet
 * ou bien renvoyer le même objet, dans ce cas aucun changement n'est effectué
 * @param aArray
 * @param pPredicate
 */
function mutationFilter(aArray, pPredicate) {
    for (let i = aArray.length - 1; i >= 0; --i) {
        let item = aArray[i];
        let newItem = pPredicate(item);
        if (newItem !== item) {
            aArray.splice(i, 1, item);
        }
        if (!newItem) {
            aArray.splice(i, 1);
        }
    }
}


export default {
    /**
     * Ajoute une nouvelle frame à l'album
     * @param state
     * @param data
     */
    [types.ADD_FRAME]: function(state, {data}) {
        const oPacket = {
            id: state.lastFrameId++,
            src: data
        };
        state.frames.push(oPacket);
    },

    [types.SHOW_ALERT]: function(state, {message, type}) {
        let sa = state.alerts;
        while (sa.length > 4) {
            sa.shift();
        }
        sa.push({
            type: type,
            message,
            id: state.lastAlertId++
        });
    },


    [types.SELECT_FRAME]: function(state, {id}) {
        let iFrame = state.frames.findIndex(f => f.id === id);
        if (iFrame >= 0) {
            let oFrame = state.frames[iFrame];
            oFrame.selected = !oFrame.selected;
            state.frames.splice(iFrame, 1, oFrame);
        } else {
            throw new Error('could not locate frame #' + id);
        }
    },

    [types.DELETE_SELECTED_FRAMES]: function(state) {
        mutationFilter(state.frames, f => f.selected ? null : f);
    },

    [types.SELECT_ALL_FRAMES]: function(state) {
        mutationFilter(state.frames, f => !f.selected ? { ...f, selected: true } : f);
    },

    [types.UNSELECT_ALL_FRAMES]: function(state) {
        mutationFilter(state.frames, f => f.selected ? { ...f, selected: false } : f);
    },

    [types.CLEAR_FRAMES]: function(state) {
        let sa = state.frames;
        sa.splice(0);
    },

    [types.SET_PROJECT_NAME]: function(state, {name}) {
        state.name = name;
    }
}