declare const __IS_BUILD__: boolean;
export const isBuild = typeof __IS_BUILD__ !== 'undefined' ? __IS_BUILD__ : process.env.IS_BUILD === 'true';