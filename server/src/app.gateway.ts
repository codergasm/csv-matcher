import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import * as papa from 'papaparse';
import { Server } from 'socket.io';
import {AppService} from "./app.service";
import fs from "fs";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    maxHttpBufferSize: 500 * 1024 * 1024
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;
    appService: AppService

    @SubscribeMessage('correlate')
    correlate(@MessageBody() data: any, @ConnectedSocket() client) {
        const { priorities, correlationMatrix,
            dataFile, relationFile,
            indexesOfCorrelatedRows, overrideAllRows,
            avoidOverrideForManuallyCorrelatedRows,
            manuallyCorrelatedRows, matchThreshold } = data.formData;

        this.appService = new AppService();

        const dataFileContent = dataFile.toString();
        const relationFileContent = relationFile.toString();

        const dataSheet = papa.parse(dataFileContent, { header: true }).data;
        const relationSheet = papa.parse(relationFileContent, { header: true }).data;

        let correlationMatrixTmp = this.appService.getCorrelationMatrix(JSON.parse(priorities), correlationMatrix,
            dataSheet, relationSheet,
            indexesOfCorrelatedRows, overrideAllRows)
        let i = 0;
        let indexesOfCorrelatedRowsTmp = JSON.parse(indexesOfCorrelatedRows).map((item) => (item));

        if(overrideAllRows && avoidOverrideForManuallyCorrelatedRows) {
            indexesOfCorrelatedRowsTmp = JSON.parse(indexesOfCorrelatedRows).map((item, index) => {
                if(manuallyCorrelatedRows.includes(index)) {
                    return item;
                }
                else {
                    return -1;
                }
            });
        }

        let progress = 0;

        for(let el of correlationMatrixTmp) {
            let numberOfTrials = 0;
            let newMatch = -1;

            // Send progress info
            progress++;
            client.emit('events', progress / correlationMatrixTmp.length);

            while(newMatch === -1) {
                const indexWithMaxValue = this.appService.getIndexWithMaxValue(el);

                if(!indexesOfCorrelatedRowsTmp.includes(indexWithMaxValue)) {
                    newMatch = indexWithMaxValue;
                }
                else {
                    el = el.map((item, index) => {
                        if(index === indexWithMaxValue) {
                            return -1;
                        }
                        else {
                            return item;
                        }
                    });
                }

                numberOfTrials++;
                if(numberOfTrials === 100) {
                    newMatch = -2;
                }
            }

            indexesOfCorrelatedRowsTmp[i] = (newMatch === -2 || el[newMatch] < matchThreshold) ? -1 : newMatch;

            i++;
        }

        return {
            indexesOfCorrelatedRowsTmp,
            correlationMatrixTmp
        }
    }

    @SubscribeMessage('correlate')
    async getSelectList(@MessageBody() data: any, @ConnectedSocket() client) {


        return data;
    }
}
