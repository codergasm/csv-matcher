import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {SchemasService} from "./schemas.service";

@Controller('schemas')
export class SchemasController {
    constructor(
        private readonly schemasService: SchemasService
    ) {
    }

    @Get(`/getSchemaById/:id`)
    getSchemaById(@Param('id') id) {
        return this.schemasService.getSchemaById(id);
    }

    @Get('/getSchemasByUser/:email')
    getSchemasByUser(@Param('email') email) {
        return this.schemasService.getSchemasByUser(email);
    }

    @Post('/saveSchema')
    saveSchema(@Body() body) {
        const { name, matchedStringsArray, automaticMatcherSettingsObject,
            email, teamOwner, dataSheetId, relationSheetId } = body;
        return this.schemasService.saveSchema(name, matchedStringsArray, automaticMatcherSettingsObject,
            email, teamOwner, dataSheetId, relationSheetId);
    }

    @Patch('/updateSchema')
    updateSchema(@Body() body) {
        const { id, name, matchedStringsArray, automaticMatcherSettingsObject } = body;
        return this.schemasService.updateSchema(id, name, matchedStringsArray, automaticMatcherSettingsObject);
    }

    @Patch('/assignSchemaToTeam')
    assignSchemaToTeam(@Body() body) {
        return this.schemasService.assignSchemaToTeam(body.id, body.email);
    }

    @Delete('/deleteSchema/:id')
    deleteSchema(@Param('id') id) {
        return this.schemasService.deleteSchema(id);
    }

    @Post('/assignSheetsToSchema')
    assignSheetsToSchema(@Body() body) {
        return this.schemasService.assignSheetsToSchema(body.dataSheet, body.relationSheet, body.matchSchema);
    }

    @Delete('/detachSheetsFromSchema/:dataSheet/:relationSheet/:matchSchema')
    detachSheetsFromSchema(@Param('dataSheet') dataSheet,
                           @Param('relationSheet') relationSheet,
                           @Param('matchSchema') matchSchema) {
        return this.schemasService.detachSheetsFromSchema(dataSheet, relationSheet, matchSchema);
    }

    @Delete('/detachSheetsFromSchema/:id')
    detachSheetsFromSchemaById(@Param('id') id) {
        return this.schemasService.detachSheetsFromSchemaById(id);
    }

    @Get('/getNumberOfMatchedRows/:id')
    getNumberOfMatchedRows(@Param('id') id) {
        return this.schemasService.getNumberOfMatchedRows(id);
    }

    @Get('/correlateUsingSchema/:dataSheetId/:relationSheetId/:matchSchemaId')
    correlateUsingSchema(@Param('dataSheetId') dataSheetId,
                         @Param('relationSheetId') relationSheetId,
                         @Param('matchSchemaId') matchSchemaId) {
        return this.schemasService.correlateUsingSchema(dataSheetId, relationSheetId, matchSchemaId);
    }
}
