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
    return this.appService.getSelectList(body.jobId, body.priorities,
        body.dataFilePath ? body.dataFilePath : files[0],
        body.relationFilePath ? body.relationFilePath : files[body.dataFilePath ? 1 : 0],
        body.dataDelimiter, body.relationDelimiter,
        body.isCorrelationMatrixEmpty, body.showInSelectMenuColumns, body.dataSheetLength, body.relationSheetLength);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/correlate')
  @UseInterceptors(FilesInterceptor('files'))
  async correlate(@UploadedFiles() files: Array<Express.Multer.File>,
                  @Body() body) {
    const { jobId, priorities, correlationMatrix, dataFilePath, relationFilePath,
      dataFileDelimiter, relationFileDelimiter, indexesOfCorrelatedRows,
      overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
      manuallyCorrelatedRows, matchThreshold, userId } = body;

    return this.appService.correlate(jobId,
        dataFilePath ? dataFilePath : files[0],
        relationFilePath ? relationFilePath : files[dataFilePath ? 1 : 0],
        dataFileDelimiter, relationFileDelimiter,
        priorities, correlationMatrix, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows, matchThreshold, userId);
  }
}
