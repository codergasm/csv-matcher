const getSimilarityColor = (val) => {
    if(val >= 90) {
        return 'red';
    }
    else if(val >= 60) {
        return 'orange';
    }
    else if(val === -1) {
        return 'white';
    }
    else {
        return 'yellow';
    }
}

export default getSimilarityColor;
