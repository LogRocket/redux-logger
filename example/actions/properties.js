import { PROPERTIES_UPDATE } from '../constants/properties';

export function updateProperties(list) {
  return {
    type: PROPERTIES_UPDATE,
    list,
  };
}
