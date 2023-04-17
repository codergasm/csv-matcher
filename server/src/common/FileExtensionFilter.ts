import { UnsupportedMediaTypeException } from '@nestjs/common';

export const fileExtensionFilter = (
    req: any,
    file,
    callback: (error: Error, acceptFile: boolean) => any,
) => {
    if(!(file.mimetype.indexOf("csv") > -1) &&
        !(file.mimetype.indexOf("text") > -1)
    ){
        callback(
            new UnsupportedMediaTypeException('Dozwolone są tylko pliki w następujących formatach: csv, txt'),
            false,
        );
    }

    callback(null, true);
};
