import * as types from './types';

export default {
    [types.ADD_FRAME]: function({commit}, {data}) {
        commit(types.ADD_FRAME, {data});
    }
};