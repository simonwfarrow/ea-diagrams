/**
 * @param {string} plantStr The plantuml string to convert to an SVG
 * @param {string} path The absolute path to write the svg to
 */
export declare function getPlantSVG(plantStr: string, path: string)

/**
 * @param {string} s The plantuml string to compress
 * @return {string} The compressed string
 */
export declare function compress(s: string)

/**
 * @param {string} plantStr The plantuml string to compress
 * @return {string} The compressed string
 */
export declare function getPlantUrl(plantStr: string)

declare module '@electronic-architect/ea-diagrams/src/index.js';
