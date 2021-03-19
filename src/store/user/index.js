import { SET_USER } from '@/store/user/mutation-types';

const namespaced = true;

const state = {
    user: {},
};

const getters = {
    getUser: state => {
        return state.user;
    },
};

const mutations = {
    [SET_USER]: (state, user) => {
        state.user = user;
    },
};

const actions = {
    [SET_USER]: ({ commit }, payload) => {
        commit(SET_USER, payload);
    },
};

export default {
    namespaced,
    state,
    getters,
    mutations,
    actions,
};