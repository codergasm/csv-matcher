const convertRelationTypeStringToNumber = (str) => {
    switch(str) {
        case 'one_to_one':
            return 0;
        case 'one_to_many':
            return 1;
        case 'many_to_one':
            return 2;
        default:
            return 3;
    }
}

export default convertRelationTypeStringToNumber;
