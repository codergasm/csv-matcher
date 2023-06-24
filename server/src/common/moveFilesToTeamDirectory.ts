import fs from "fs";

const moveFilesToTeamDirectory = async (files, teamId) => {
    let imageIndex = 0;

    if(files?.sheet?.length) {
        for(const item of files.sheet) {
            try {
                await fs.promises.mkdir(`${item.destination}/${teamId}`, {
                    recursive: true
                });
                await fs.promises.rename(item.path, `${item.destination}/${teamId}/${item.filename}`);
            }
            catch(e) {
                // If directory already exists
                try {
                    await fs.promises.rename(item.path, `${item.destination}/${teamId}/${item.filename}`);
                } catch(e) {}
            }

            files.sheet[imageIndex] = {
                ...item,
                path: `${item.destination}/${teamId}/${item.filename}`,
                destination: `${item.destination}/${teamId}`
            }
            imageIndex++;
        }
    }

    return files;
}

export default moveFilesToTeamDirectory;
