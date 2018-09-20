import * as types from './types';

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
        while (sa.length > 2) {
            sa.shift();
        }
        sa.push({
            type,
            message,
            id: state.lastAlertId++
        });
    },


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

    [types.DELETE_SELECTED_FRAMES]: function(state) {
        let sf = state.frames;
        for (let i = sf.length - 1; i >= 0; --i) {
            let f = sf[i];
            if (f.selected) {
                sf.splice(i, 1);
            }
        }
    },

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

    [types.CLEAR_FRAMES]: function(state) {
        let sa = state.frames;
        sa.splice(0);
    },

    [types.SET_PROJECT_NAME]: function(state, {name}) {
        state.name = name;
    }
}