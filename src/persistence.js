import debounce from 'debounce';

function persistBuffer(buffer, { persister }) {
  persister(buffer)
    .then(() => {
      // clear the buffer - explicit side-effect
      buffer.length = 0; // eslint-disable-line no-param-reassign
    })
    .catch(() => {
      console.error(`failed to persist buffer`, buffer); // eslint-disable-line no-console
    });
}

function createDebouncedPersister({ persistenceDelay = 300 }) {
  return debounce(persistBuffer, persistenceDelay);
}

export default createDebouncedPersister;
