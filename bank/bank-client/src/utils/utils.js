/**
 * Utils: General utilities to make life easier
 */

export default {
    isEmptyObject(obj) {
        if (typeof obj === "undefined")
            return true;
        return (Object.keys(obj).length === 0);
    },
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}