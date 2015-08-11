import { handleActions } from 'redux-actions';
import { AUTH_SET_TOKEN, AUTH_SET_INFO, AUTH_REMOVE_TOKEN } from '../constants/auth';

const initialState = {};

const auth = handleActions({
  [AUTH_SET_TOKEN]: (state, action) => {
    const { token } = action;

    return {
      ...state,
      token,
    };
  },

  [AUTH_SET_INFO]: (state, action) => {
    const { id, username } = action;

    return {
      ...state,
      id,
      username,
    };
  },

  [AUTH_REMOVE_TOKEN]: (state) => {
    const { token, ...rest } = state;

    return {
      ...rest,
    };
  },
}, initialState);

export default auth;
