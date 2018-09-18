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
}