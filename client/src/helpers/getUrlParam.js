const getUrlParam = (param) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

export default getUrlParam;
