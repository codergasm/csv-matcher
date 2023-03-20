import axios from "axios";
import io from 'socket.io-client';

const convertCsvToArray = (file, separator) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    formData.append('file', file);
    formData.append('separator', separator);

    return axios.post('/convertToArray', formData, config);
}

const getSelectList = (priorities, dataFile, relationFile, dataDelimiter, relationDelimiter,
                       isCorrelationMatrixEmpty, showInSelectMenuColumns, dataSheetLength, relationSheetLength) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
            // console.log(progressEvent);
        }
    }

    formData.append('priorities', JSON.stringify(priorities));
    formData.append('files', dataFile);
    formData.append('files', relationFile);
    formData.append('dataDelimiter', dataDelimiter);
    formData.append('relationDelimiter', relationDelimiter);
    formData.append('isCorrelationMatrixEmpty', isCorrelationMatrixEmpty);
    formData.append('showInSelectMenuColumns', JSON.stringify(showInSelectMenuColumns));
    formData.append('dataSheetLength', dataSheetLength);
    formData.append('relationSheetLength', relationSheetLength);

    return axios.post('/getSelectList', formData, config);
}

const matching = (priorities, correlationMatrix,
                  dataFile, relationFile, dataDelimiter, relationDelimiter,
                  indexesOfCorrelatedRows, overrideAllRows,
                  avoidOverrideForManuallyCorrelatedRows,
                  manuallyCorrelatedRows, matchThreshold) => {
    // WebSocket
    const socket = io('http://localhost:5000');

    const dataFileReader = new FileReader();
    const relationFileReader = new FileReader();

    dataFileReader.onload = () => {
        relationFileReader.onload = () => {
            const dataFileResult = dataFileReader.result;
            const relationFileResult = relationFileReader.result;

            socket.emit('correlate', {
                formData: {
                    dataFile: dataFileResult,
                    relationFile: relationFileResult,
                    dataDelimiter,
                    relationDelimiter,
                    correlationMatrix,
                    priorities: JSON.stringify(priorities),
                    indexesOfCorrelatedRows: JSON.stringify(indexesOfCorrelatedRows),
                    overrideAllRows,
                    avoidOverrideForManuallyCorrelatedRows,
                    manuallyCorrelatedRows,
                    matchThreshold
                }
            }, (response) => {
                console.log(response);
            });

            // Listen for progress
            socket.on('correlate', (d) => {
                console.log(d);
            });
        }

        relationFileReader.readAsArrayBuffer(relationFile);
    }

    dataFileReader.readAsArrayBuffer(dataFile);
}

export { getSelectList, matching, convertCsvToArray }
