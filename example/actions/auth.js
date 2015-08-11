import { AUTH_SET_TOKEN, AUTH_SET_INFO, AUTH_REMOVE_TOKEN } from '../constants/auth';

export function setToken(token) {
  return {
    type: AUTH_SET_TOKEN,
    token,
  };
}

export function removeToken() {
  return {
    type: AUTH_REMOVE_TOKEN,
  };
}

export function setInfo(id, username) {
  return {
    type: AUTH_SET_INFO,
    id,
    username,
  };
}
