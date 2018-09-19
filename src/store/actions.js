import * as types from './types';

export default {
    [types.ADD_FRAME]: function({commit}, {data}) {
        commit(types.ADD_FRAME, {data});
    },

    [types.SHOW_ERROR]: function({commit}, {caption}) {
        commit(types.SHOW_ERROR, {caption});
    },

    [types.SELECT_FRAME]: function({commit}, {id}) {
        commit(types.SELECT_FRAME, {id});
    },

    [types.DELETE_SELECTED_FRAMES]: function({commit}) {
        commit(types.DELETE_SELECTED_FRAMES);
    },

    [types.CLEAR_FRAMES]: function({commit}) {
        commit(types.CLEAR_FRAMES);
    },

    [types.SELECT_ALL_FRAMES]: function({commit}) {
        commit(types.SELECT_ALL_FRAMES);
    },

    [types.UNSELECT_ALL_FRAMES]: function({commit}) {
        commit(types.UNSELECT_ALL_FRAMES);
    },

    [types.SET_PROJECT_NAME]: function({commit}, {name}) {
        commit(types.SET_PROJECT_NAME, {name});
    }
};