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

    [types.SHOW_ERROR]: function(state, {caption}) {
        state.error = caption;
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
        for (let i = state.frames.length - 1; i >= 0; --i) {
            if (state.frames[i].selected) {
                state.frames.splice(i, 1);
            }
        }
    },

    [types.SELECT_ALL_FRAMES]: function(state) {
        for (let i = state.frames.length - 1; i >= 0; --i) {
            let oFrame = state.frames[i];
            if (!oFrame.selected) {
                oFrame.selected = true;
                state.frames.splice(i, 1, oFrame);
            }
        }
    },

    [types.UNSELECT_ALL_FRAMES]: function(state) {
        for (let i = state.frames.length - 1; i >= 0; --i) {
            let oFrame = state.frames[i];
            if (oFrame.selected) {
                oFrame.selected = false;
                state.frames.splice(i, 1, oFrame);
            }
        }
    },

    [types.CLEAR_FRAMES]: function(state) {
        while (state.frames.length) {
            state.frames.pop();
        }
    },

    [types.SET_PROJECT_NAME]: function(state, {name}) {
        state.name = name;
    }
}