import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {SchemasService} from "./schemas.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";

@Controller('schemas')
export class SchemasController {
    constructor(
        private readonly schemasService: SchemasService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get(`/getSchemaById/:id`)
    getSchemaById(@Param('id') id) {
        return this.schemasService.getSchemaById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getSchemasByUser/:email')
    getSchemasByUser(@Param('email') email) {
        return this.schemasService.getSchemasByUser(email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/saveSchema')
    saveSchema(@Body() body) {
        const { name, matchedStringsArray, automaticMatcherSettingsObject,
            email, teamOwner, dataSheetId, relationSheetId } = body;
        return this.schemasService.saveSchema(name, matchedStringsArray, automaticMatcherSettingsObject,
            email, teamOwner, dataSheetId, relationSheetId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateSchema')
    updateSchema(@Body() body) {
        const { id, name, matchedStringsArray, automaticMatcherSettingsObject } = body;
        return this.schemasService.updateSchema(id, name, matchedStringsArray, automaticMatcherSettingsObject);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateSchemaName')
    updateSchemaName(@Body() body) {
        const { id, name } = body;
        return this.schemasService.updateSchemaName(id, name);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/assignSchemaToTeam')
    assignSchemaToTeam(@Body() body) {
        return this.schemasService.assignSchemaToTeam(body.id, body.email);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/deleteSchema/:id')
    deleteSchema(@Param('id') id) {
        return this.schemasService.deleteSchema(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/assignSheetsToSchema')
    assignSheetsToSchema(@Body() body) {
        return this.schemasService.assignSheetsToSchema(body.dataSheet, body.relationSheet, body.matchSchema);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/detachSheetsFromSchema/:dataSheet/:relationSheet/:matchSchema')
    detachSheetsFromSchema(@Param('dataSheet') dataSheet,
                           @Param('relationSheet') relationSheet,
                           @Param('matchSchema') matchSchema) {
        return this.schemasService.detachSheetsFromSchema(dataSheet, relationSheet, matchSchema);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/detachSheetsFromSchema/:id')
    detachSheetsFromSchemaById(@Param('id') id) {
        return this.schemasService.detachSheetsFromSchemaById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getNumberOfMatchedRows/:id')
    getNumberOfMatchedRows(@Param('id') id) {
        return this.schemasService.getNumberOfMatchedRows(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/correlateUsingSchema/:dataSheetId/:relationSheetId/:matchSchemaId')
    correlateUsingSchema(@Param('dataSheetId') dataSheetId,
                         @Param('relationSheetId') relationSheetId,
                         @Param('matchSchemaId') matchSchemaId) {
        return this.schemasService.correlateUsingSchema(dataSheetId, relationSheetId, matchSchemaId);
    }
}
