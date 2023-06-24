import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {FilesService} from "./files.service";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {FileUploadHelper} from "../common/FileUploadHelper";
import {diskStorage} from "multer";
import * as fs from 'fs';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ) {
    }

    async moveFilesToProperDirectory(files, teamId) {
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

    @Get('/getFileById/:id')
    getFileById(@Param('id') id) {
        return this.filesService.getFileById(id);
    }

    @Post('/saveSheet')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'sheet', maxCount: 1},
    ], {
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads'
        })
    }))
    async saveSheet(@UploadedFiles() files: {
        sheet?: Express.Multer.File[],
    }, @Body() body) {
        const { email, teamId, teamOwner } = body;

        files = await this.moveFilesToProperDirectory(files, teamId);

        return this.filesService.saveSheet(files, email, teamOwner);
    }

    @Delete(`/deleteSheet/:id`)
    async deleteSheet(@Param('id') id) {
        return this.filesService.deleteSheet(id);
    }

    @Get('/getFilesByUser/:email')
    async getFilesByUser(@Param('email') email) {
        return this.filesService.getFilesByUser(email);
    }

    @Patch('/assignFileOwnershipToTeam')
    async assignFileOwnershipToTeam(@Body() body) {
        return this.filesService.assignFileOwnershipToTeam(body.fileId, body.teamId);
    }

    @Patch('/updateFile')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'sheet', maxCount: 1},
    ], {
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads'
        })
    }))
    async updateFile(@UploadedFiles() files: {
        sheet?: Express.Multer.File[],
    }, @Body() body) {
        const { id, name, email, teamId } = body;

        files = await this.moveFilesToProperDirectory(files, teamId);

        return this.filesService.updateFile(id, files, name, email);
    }

    @Patch('/updateFileName')
    async updateFileName(@Body() body) {
        return this.filesService.updateFileName(body.id, body.name);
    }
}
