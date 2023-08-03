import getNumberOfOccurrencesInArray from "./getNumberOfOccurrencesInArray";

const combineTwoSheets = (dataSheetRow, relationSheetRow) => {
    const dataSheetRowToCombine = Object.fromEntries(Object.entries(dataSheetRow).map((item) => {
        return [`${item[0]}_1`, item[1]];
    }));
    const relationSheetRowToCombine = Object.fromEntries(Object.entries(relationSheetRow).map((item) => {
        return [`${item[0]}_2`, item[1]];
    }));

    const combined = {...dataSheetRowToCombine, ...relationSheetRowToCombine};
    const combinedKeys = Object.keys(combined).map((item) => (item.slice(0, -2)));

    return Object.fromEntries(Object.entries(combined).map((item) => {
        const slicedKey = item[0].slice(0, -2);

        if(getNumberOfOccurrencesInArray(slicedKey, combinedKeys) === 2) {
            return item;
        }
        else {
            return [slicedKey, item[1]];
        }
    }));
}

export default combineTwoSheets;
