const addDaysToCurrentDate = (n) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + n);
    return currentDate;
}

export default addDaysToCurrentDate;
