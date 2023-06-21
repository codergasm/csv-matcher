const getScrollParams = (e) => {
    const visibleHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;
    const scrolled = e.target.scrollTop;

    return { visibleHeight, scrollHeight, scrolled };
}

export default getScrollParams;
