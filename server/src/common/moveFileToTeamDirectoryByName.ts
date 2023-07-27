import * as fs from "fs";

const moveFileToTeamDirectoryByName = async (path, teamId) => {
    const filename = path.split('/').slice(-1).join('/');
    const destination = path.replace(filename, '');

    console.log(teamId);

    console.log(path);
    console.log(destination);
    console.log(filename);

    try {
        await fs.promises.mkdir(`${path}/${teamId}`, {
            recursive: true
        });

        await fs.promises.rename(path, `${path}/${teamId}/${filename}`);

        return `${path}/${teamId}/${filename}`;
    }
    catch(e) {
        console.log('directory exists');
        console.log(e);
        // If directory already exists
        try {
            const res = await fs.promises.rename(path, `${destination}${teamId}/${filename}`);
            console.log('success');
            console.log(path);
            console.log(`${destination}${teamId}/${filename}`);
            console.log(res);
        } catch(e) {
            console.log(e);
        }
    }
}

export default moveFileToTeamDirectoryByName;
