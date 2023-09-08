const downloadFile = (blob, filename) => {
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export default downloadFile;
