const addMonthsToCurrentDate = (n) => {
    const dateToReturn = new Date();
    dateToReturn.setMonth(dateToReturn.getMonth() + n);
    return dateToReturn;
}

export default addMonthsToCurrentDate;
