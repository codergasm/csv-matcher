import {addTrailingZero} from "./others";

const printDate = (date) => {
    return `${addTrailingZero(date.getDate())}.${addTrailingZero(date.getMonth()+1)}.${date.getFullYear()}`;
}

export default printDate;
