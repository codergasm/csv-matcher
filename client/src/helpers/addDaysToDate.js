const addDaysToDate = (date, n) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + n);
    return currentDate;
}

export default addDaysToDate;
