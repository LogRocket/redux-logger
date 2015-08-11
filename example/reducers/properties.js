import { handleActions } from 'redux-actions';
import { PROPERTIES_UPDATE } from '../constants/properties';

const initialState = {
  list: [],
};

const properties = handleActions({
  [PROPERTIES_UPDATE]: (state, action) => {
    const { list } = action;

    return {
      ...state,
      list,
    };
  },
}, initialState);

export default properties;
