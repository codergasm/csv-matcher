import {Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FilesInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "./common/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getProgress/:id')
  async getProgressByJobId(@Param('id') id) {
    return this.appService.getProgressByJobId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/getSelectList')
  @UseInterceptors(FilesInterceptor('files'))
  async getSelectList(@UploadedFiles() files: Array<Express.Multer.File>,
                      @Body() body) {
    const { jobId, priorities, dataFilePath, relationFilePath, dataDelimiter, relationDelimiter, selectListIndicators,
      isCorrelationMatrixEmpty, showInSelectMenuColumnsDataSheet, dataSheetLength, relationSheetLength, relationTestRow } = body;

    const dataFile = dataFilePath ? dataFilePath : files[0];
    const relationFile = relationFilePath ? relationFilePath : files[dataFilePath ? 0 : 1];
    const selectListIndicatorsObject = JSON.parse(selectListIndicators);
    const relationTestRowToSend = !isNaN(relationTestRow) ? parseInt(relationTestRow) : -1;

    return this.appService.getSelectList(jobId, priorities,
        dataFile, relationFile,
        dataDelimiter, relationDelimiter,
        isCorrelationMatrixEmpty, showInSelectMenuColumnsDataSheet,
        dataSheetLength, relationSheetLength, selectListIndicatorsObject, relationTestRowToSend);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/correlate')
  @UseInterceptors(FilesInterceptor('files'))
  async correlate(@UploadedFiles() files: Array<Express.Multer.File>,
                  @Body() body) {
    const { jobId, priorities, correlationMatrix, dataFilePath, relationFilePath,
      dataFileDelimiter, relationFileDelimiter, indexesOfCorrelatedRows,
      overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
      manuallyCorrelatedRows, userId, relationTestRow, matchType } = body;

    const dataFile = dataFilePath ? dataFilePath : files[0];
    const relationFile = relationFilePath ? relationFilePath : files[dataFilePath ? 0 : 1];
    const prioritiesObject = JSON.parse(priorities);
    const relationTestRowToSend = !isNaN(relationTestRow) ? parseInt(relationTestRow) : -1;

    return this.appService.correlate(jobId, dataFile, relationFile,
        dataFileDelimiter, relationFileDelimiter,
        prioritiesObject, correlationMatrix, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows, userId, parseInt(matchType), relationTestRowToSend);
  }
}
