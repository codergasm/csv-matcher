import {Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/convertToArray')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.appService.convertToArray(file, body.separator);
  }

  @Post('/getSelectList')
  @UseInterceptors(FilesInterceptor('files'))
  async getSelectList(@UploadedFiles() files: Array<Express.Multer.File>,
                      @Body() body) {
    return this.appService.getSelectList(body.priorities, files[0], files[1],
        body.dataDelimiter, body.relationDelimiter,
        body.isCorrelationMatrixEmpty, body.showInSelectMenuColumns);
  }

  @Post('/correlate')
  @UseInterceptors(FilesInterceptor('files'))
  async correlate(@UploadedFiles() files: Array<Express.Multer.File>,
                  @Body() body) {
    const { priorities, correlationMatrix,
      dataFileDelimiter, relationFileDelimiter, indexesOfCorrelatedRows,
      overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
      manuallyCorrelatedRows, matchThreshold } = body;

    console.log(body);

    return this.appService.correlate(files[0], files[1], dataFileDelimiter, relationFileDelimiter,
        priorities, correlationMatrix, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows, matchThreshold);
  }
}
