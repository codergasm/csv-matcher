import {Body, Controller, Post} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/getSelectList')
  getSelectList(@Body() body) {
    return this.appService.getSelectList(body.dataSheet, body.correlationMatrix, body.showInSelectMenuColumns);
  }

  @Post('/correlate')
  correlate(@Body() body) {
    const { priorities, correlationMatrix,
      dataSheet, relationSheet, indexesOfCorrelatedRows,
      overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
      manuallyCorrelatedRows, matchThreshold } = body;
    return this.appService.correlate(priorities, correlationMatrix, dataSheet, relationSheet, indexesOfCorrelatedRows,
        overrideAllRows, avoidOverrideForManuallyCorrelatedRows,
        manuallyCorrelatedRows, matchThreshold);
  }
}
