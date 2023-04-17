export class FileUploadHelper {
    static customFileName(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
        let fileExtension = "";
        if(file.mimetype.indexOf("csv") > -1) {
            fileExtension = "csv";
        }
        else if(file.mimetype.indexOf("text") > -1) {
            fileExtension = 'txt';
        }

        const originalName = file.originalname.split(".")[0];
        cb(null, originalName + '-' + uniqueSuffix+"."+fileExtension);
    }
}
