import * as types from './types';

export default {
    [types.ADD_FRAME]: function({commit}, {data}) {
        commit(types.ADD_FRAME, {data});
    },

    [types.SHOW_ALERT]: function({commit}, {message, type}) {
        commit(types.SHOW_ALERT, {message, type});
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
    },

    [types.IMPORT_PROJECT]: function({commit}, {data, name}) {
        commit(types.IMPORT_PROJECT, {data});
        commit(types. SET_PROJECT_NAME, {name});
    },

    [types.SET_PROJECT_LIST]: function({commit}, {projects}) {
        commit(types.SET_PROJECT_LIST, {projects});
    },

    [types.SET_MUSIC]: function({commit}, {file}) {
        commit(types.SET_MUSIC, {file});
    },

    [types.CLEAR_MUSIC]: function({commit}) {
        commit(types.CLEAR_MUSIC);
    },

    [types.UPLOAD_VIDEO]: function({commit}, payload) {
        commit(types.UPLOAD_VIDEO, payload);
    }

};
