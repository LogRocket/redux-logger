export const repeat = (str, times) => (new Array(times + 1)).join(str);

export const pad = (num, maxLength) => repeat(`0`, maxLength - num.toString().length) + num;

export const formatTime = (time) => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

// Use performance API if it's available in order to get better precision
export const timer = (typeof performance !== `undefined` && performance !== null) && typeof performance.now === `function` ? performance : Date;
