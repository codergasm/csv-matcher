import {Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FilesInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "./common/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getLanguages')
  async getLanguages() {
    return this.appService.getLanguages();
  }

  @Get('/getProgress/:id')
  async getProgressByJobId(@Param('id') id) {
    return this.appService.getProgressByJobId(id);
  }

  async getSelectList(body, files) {
    const { dataSheetLength, relationSheetLength } = body;

    return this.appService.getSelectList(dataSheetLength, relationSheetLength);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getSelectList')
  @UseInterceptors(FilesInterceptor('files'))
  async getSelectListNormal(@UploadedFiles() files: Array<Express.Multer.File>,
                      @Body() body) {
    return this.getSelectList(body, files);
  }

  @Post('/getSelectListApi')
  @UseInterceptors(FilesInterceptor('files'))
  async getSelectListApi(@UploadedFiles() files: Array<Express.Multer.File>,
                      @Body() body) {
    return this.getSelectList(body, files);
  }

  async correlate(body, files) {
    const { correlationId, jobId, priorities, dataFilePath, relationFilePath,
      overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
      correlationMatrix, indexesOfCorrelatedRows, schemaCorrelatedRows,
      manuallyCorrelatedRows, userId, teamId, relationTestRow, matchType } = body;

    const dataFile = dataFilePath ? dataFilePath : files[0];
    const relationFile = relationFilePath ? relationFilePath : files[dataFilePath ? 0 : 1];
    const prioritiesObject = JSON.parse(priorities);
    const relationTestRowToSend = !isNaN(relationTestRow) ? parseInt(relationTestRow) : -1;
    const prevIndexesOfCorrelatedRows = JSON.parse(indexesOfCorrelatedRows);
    const prevCorrelationMatrix = JSON.parse(correlationMatrix);
    const prevSchemaCorrelatedRows = JSON.parse(schemaCorrelatedRows);

    return this.appService.correlate(correlationId, jobId, dataFile, relationFile,
        prioritiesObject,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        JSON.parse(manuallyCorrelatedRows), userId, teamId, parseInt(matchType), prevIndexesOfCorrelatedRows,
        prevCorrelationMatrix, prevSchemaCorrelatedRows, relationTestRowToSend);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/correlate')
  @UseInterceptors(FilesInterceptor('files'))
  async correlateNormal(@UploadedFiles() files: Array<Express.Multer.File>,
                  @Body() body) {
    return this.correlate(body, files);
  }

  @Post('/correlateApi')
  @UseInterceptors(FilesInterceptor('files'))
  async correlateApi(@UploadedFiles() files: Array<Express.Multer.File>,
                        @Body() body) {
    return this.correlate(body, files);
  }
}
