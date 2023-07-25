const getRelationNameById = (id) => {
    switch(id) {
        case 0:
            return 'one_to_one';
        case 1:
            return 'one_to_many';
        case 2:
            return 'many_to_one';
        default:
            return 'many_to_many';
    }
}

export default getRelationNameById;
