import {addMissingKeys} from "./others";

const convertResponseToObject = (data) => {
    const obj = data.map((item, index) => {
        return {
            '0': index+1,
            ...item
        }
    });

    // Add missing keys and convert values to string
    return addMissingKeys(obj, Object.keys(obj[0])).map((item) => {
        return Object.fromEntries(Object.entries(item).map((item) => ([item[0], item[1].toString()])));
    });
}

export default convertResponseToObject;
