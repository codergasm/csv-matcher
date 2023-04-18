import Cookies from "universal-cookie";

const sortByColumn = (sheet, column, type) => {
    const sortSheet = [...sheet];

    const isColumnWithNumbers = sheet
        .slice(0, 10)
        .findIndex((item) => (isNaN(parseInt(item[column])))) === -1;

    if(isColumnWithNumbers) {
        if(type === 1) {
            return sortSheet.sort((a, b) => {
                return parseFloat(a[column]) < parseFloat(b[column]) ? -1 : 1;
            });
        }
        else {
            return sortSheet.sort((a, b) => {
                return parseFloat(a[column]) > parseFloat(b[column]) ? -1 : 1;
            });
        }
    }
    else {
        if(type === 1) {
            return sortSheet.sort((a, b) => {
                return a[column] < b[column] ? -1 : 1;
            });
        }
        else {
            return sortSheet.sort((a, b) => {
                return a[column] > b[column] ? -1 : 1;
            });
        }
    }
}

const sortRelationColumn = (sheet, indexesOfCorrelatedRows, type) => {
    if(type === 1) {
        // Matched rows first
        const sortedSheet = [...sheet];

        return sortedSheet.sort((a, b) => {
            const aIndex = sortedSheet.indexOf(a);
            const bIndex = sortedSheet.indexOf(b);

            if(indexesOfCorrelatedRows[aIndex] !== -1 && indexesOfCorrelatedRows[bIndex] === -1) {
                return 1;
            }
            else if(indexesOfCorrelatedRows[bIndex] !== -1 && indexesOfCorrelatedRows[aIndex] === -1) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    else if(type === 2) {
        // Unmatched rows first
        const sortedSheet = [...sheet];

        return sortedSheet.sort((a, b) => {
            const aIndex = sortedSheet.indexOf(a);
            const bIndex = sortedSheet.indexOf(b);

            if(indexesOfCorrelatedRows[aIndex] !== -1 && indexesOfCorrelatedRows[bIndex] === -1) {
                return -1;
            }
            else if(indexesOfCorrelatedRows[bIndex] !== -1 && indexesOfCorrelatedRows[aIndex] === -1) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }
    else {
        return [...sheet];
    }
}

function addMissingKeys(arrayOfObjects, arrayOfKeys) {
    arrayOfObjects.forEach(obj => {
        arrayOfKeys.forEach(key => {
            if(!obj.hasOwnProperty(key)) {
                obj[key] = '';
            }
        });
    });
    return arrayOfObjects;
}

const findSubstrings = (A, B) => {
    if(A && B) {
        const result = [];
        const a = A.toLowerCase();
        const b = B.toLowerCase();

        for (let i = 0; i < b.length - 2; i++) {
            const substring = b.substring(i, i + 3);
            if (a.includes(substring)) {
                for (let j = 0; j < substring.length; j++) {
                    result.push(i + j);
                }
            }
        }

        return [...new Set(result)];
    }
    return [];
}

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function checkCommonElement(arr1, arr2) {
    for (let i = 0; i < arr1?.length || 0; i++) {
        if (arr2.includes(arr1[i])) {
            return true;
        }
    }
    return false;
}

const isEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const getAuthHeader = () => {
    const cookies = new Cookies();
    const jwt = cookies.get('access_token');
    return `Bearer ${jwt}`;
}

const isPasswordStrength = (password) => {
    if(!password) return false;
    if(password.length < 8) return false; // min. 8 characters
    if(!(/\d/.test(password))) return false; // number
    if(password.toLowerCase() === password) return false; // uppercase

    return true;
}

const isObjectEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const addTrailingZero = (n) => {
    if(n < 10) return `0${n}`;
    return n;
}

const getDateFromString = (str) => {
    const dateObject = new Date(str);
    return `${addTrailingZero(dateObject.getDate())}.${addTrailingZero(dateObject.getMonth()+1)}.${dateObject.getFullYear()}
            <br/>${addTrailingZero(dateObject.getHours())}:${addTrailingZero(dateObject.getMinutes())}:${addTrailingZero(dateObject.getSeconds())}`;
}

const getStringWithFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1000 && unitIndex < units.length - 1) {
        size /= 1000;
        unitIndex++;
    }

    return `${(size).toFixed(2)} ${units[unitIndex]}`;
}

const createRowShortcut = (row) => {
    return Object.entries(row).map((item) => (item[1].substring(0, 50))).join(';');
}

export { sortByColumn, sortRelationColumn, addMissingKeys, findSubstrings, getAuthHeader, addTrailingZero, createRowShortcut,
    checkCommonElement, makeId, isEmail, isPasswordStrength, isObjectEmpty, getDateFromString, getStringWithFileSize }
