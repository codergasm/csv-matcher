import {Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FilesInterceptor} from "@nestjs/platform-express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getProgress/:id')
  async getProgressByJobId(@Param('id') id) {
    return this.appService.getProgressByJobId(id);
  }

  @Post('/getSelectList')
  @UseInterceptors(FilesInterceptor('files'))
  async getSelectList(@UploadedFiles() files: Array<Express.Multer.File>,
                      @Body() body) {
    return this.appService.getSelectList(body.jobId, body.priorities, files[0], files[1],
        body.dataDelimiter, body.relationDelimiter,
        body.isCorrelationMatrixEmpty, body.showInSelectMenuColumns, body.dataSheetLength, body.relationSheetLength);
  }

  @Post('/correlate')
  @UseInterceptors(FilesInterceptor('files'))
  async correlate(@UploadedFiles() files: Array<Express.Multer.File>,
                  @Body() body) {
    const { jobId, priorities, correlationMatrix,
      dataFileDelimiter, relationFileDelimiter, indexesOfCorrelatedRows,
      overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
      manuallyCorrelatedRows, matchThreshold } = body;

    return this.appService.correlate(jobId, files[0], files[1], dataFileDelimiter, relationFileDelimiter,
        priorities, correlationMatrix, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows, matchThreshold);
  }
}
