import * as fs from "fs";

const moveFileToTeamDirectoryByName = async (path, teamId) => {
    const filename = path.split('/').slice(-1).join('/');
    const destination = path.replace(filename, '');

    try {
        await fs.promises.mkdir(`${path}/${teamId}`, {
            recursive: true
        });

        await fs.promises.rename(path, `${path}/${teamId}/${filename}`);

        return `${path}/${teamId}/${filename}`;
    }
    catch(e) {
        // If directory already exists
        try {
            await fs.promises.rename(path, `${destination}${teamId}/${filename}`);
            return `${destination}${teamId}/${filename}`;
        } catch(e) {
            console.log(e);
        }
    }
}

export default moveFileToTeamDirectoryByName;
