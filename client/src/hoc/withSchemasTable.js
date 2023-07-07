import {useEffect, useState} from "react";

const withSchemasTable = (WrappedComponent) => {
    const columnsNames = [
        'nazwa schematu', 'data utworzenia', 'edycja', 'zwiń/rozwiń'
    ];
    const sheetsColumnsNames = [
        'arkusz 1', 'arkusz 2', 'ilość rekordów w arkuszu 1 z dopasowaniem do arkusza 2',
        'ilość rekordów w arkuszu 2 z dopasowaniem do arkusza 1', 'opcje'
    ];

    return (props) => {
        const {schemas, allFiles} = props;

        const [sheetsVisible, setSheetsVisible] = useState([]);
        const [chooseSheetsModalVisible, setChooseSheetsModalVisible] = useState(false);
        const [chooseSheetsSchemaId, setChooseSheetsSchemaId] = useState(null);

        useEffect(() => {
            if(schemas) {
                setSheetsVisible(Object.entries(schemas).map(() => false));
            }
        }, [schemas]);

        useEffect(() => {
            if(chooseSheetsSchemaId === 0 || chooseSheetsSchemaId === -1) {
                setTimeout(() => {
                    setChooseSheetsSchemaId(null);
                }, 3000);
            }
        }, [chooseSheetsSchemaId]);

        const handleSheetsVisibilityChange = (i, value) => {
            setSheetsVisible(prevState => (prevState.map((item, index) => {
                if(i === index) return value;
                else return item;
            })));
        }

        const getFileName = (id) => {
            const file = allFiles.find((item) => (item.id === id));

            if(file) return file.filename;
            else return '';
        }

        const getFileRowCount = (id) => {
            const file = allFiles.find((item) => (item.id === id));

            if(file) return file.row_count;
            else return '';
        }

        const extraProps = {
            getFileName,
            getFileRowCount, handleSheetsVisibilityChange,
            sheetsVisible, setSheetsVisible,
            chooseSheetsModalVisible, setChooseSheetsModalVisible,
            chooseSheetsSchemaId, setChooseSheetsSchemaId,
            columnsNames, sheetsColumnsNames
        }

        return <WrappedComponent {...props} {...extraProps} />
    }
}

export default withSchemasTable;
