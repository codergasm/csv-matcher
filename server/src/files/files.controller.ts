import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {FilesService} from "./files.service";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {FileUploadHelper} from "../common/FileUploadHelper";
import {diskStorage} from "multer";
import moveFilesToTeamDirectory from "../common/moveFilesToTeamDirectory";

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ) {
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
        files = await moveFilesToTeamDirectory(files, body.teamId);
        return this.filesService.saveSheet(body, files);
    }

    @Delete(`/deleteSheet/:id`)
    async deleteSheet(@Param('id') id) {
        return this.filesService.deleteSheet(id);
    }

    @Get('/getFilesByUser/:email')
    async getFilesByUser(@Param('email') email) {
        return this.filesService.getFilesByUser(email);
    }

    @Get('/getFilesByUserId/:id')
    async getFilesByUserId(@Param('id') id) {
        return this.filesService.getFilesByUserId(id);
    }

    @Patch('/assignFileOwnershipToTeam')
    async assignFileOwnershipToTeam(@Body() body) {
        const { fileId, teamId } = body;
        return this.filesService.assignFileOwnershipToTeam(fileId, teamId);
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
        files = await moveFilesToTeamDirectory(files, body.teamId);
        return this.filesService.updateFile(body, files);
    }

    @Patch('/updateFileName')
    async updateFileName(@Body() body) {
        const { id, name } = body;
        return this.filesService.updateFileName(id, name);
    }
}
