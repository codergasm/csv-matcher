const getColumnsSortingAndSortType = (i, columnsSorting) => {
    let sortType = 0;

    const newSorting = columnsSorting.map((item, index) => {
        if(index === i) {
            if(item === 0 || item === 2) {
                sortType = 1;
            }
            else if(item === 1) {
                sortType = 2;
            }

            return sortType;
        }
        else {
            return 0;
        }
    });

    return { newSorting, sortType }
}

export default getColumnsSortingAndSortType;
