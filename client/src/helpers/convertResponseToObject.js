import {addMissingKeys} from "./others";

const convertResponseToObject = (data, relation = false) => {
    const obj = data.map((item, index) => {
        return {
            [relation ? 'rel_0' : '0']: index+1,
            ...item
        }
    });

    if(relation) {
        console.log(obj);
    }

    // Add missing keys and convert values to string
    return addMissingKeys(obj, Object.keys(obj[0])).map((item) => {
        return Object.fromEntries(Object.entries(item).map((item) => ([item[0], item[1].toString()])));
    });
}

export default convertResponseToObject;
