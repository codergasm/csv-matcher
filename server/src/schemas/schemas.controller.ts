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

    @Get('/getSchemasByUserId/:id')
    getSchemasByUserId(@Param('id') id) {
        return this.schemasService.getSchemasByUserId(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/saveSchema')
    saveSchema(@Body() body) {
        return this.schemasService.saveSchema(body);
    }

    @Post('/saveSchemaApi')
    saveSchemaApi(@Body() body) {
        return this.schemasService.saveSchema(body);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateSchema')
    updateSchema(@Body() body) {
        return this.schemasService.updateSchema(body);
    }

    @Patch('/updateSchemaApi')
    updateSchemaApi(@Body() body) {
        return this.schemasService.updateSchema(body);
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
        const { id, email } = body;
        return this.schemasService.assignSchemaToTeam(id, email);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/deleteSchema/:id')
    deleteSchema(@Param('id') id) {
        return this.schemasService.deleteSchema(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/assignSheetsToSchema')
    assignSheetsToSchema(@Body() body) {
        const { dataSheet, relationSheet, matchSchema } = body;
        return this.schemasService.assignSheetsToSchema(dataSheet, relationSheet, matchSchema);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/detachSheetsFromSchema/:dataSheet/:relationSheet/:matchSchema')
    detachSheetsFromSchema(@Param('dataSheet') dataSheet,
                           @Param('relationSheet') relationSheet,
                           @Param('matchSchema') matchSchema) {
        return this.schemasService.detachSheetsFromSchemaBySheetsAndSchemaId(dataSheet, relationSheet, matchSchema);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/detachSheetsFromSchema/:id')
    detachSheetsFromSchemaBySchemaId(@Param('id') id) {
        return this.schemasService.detachSheetsFromSchemaBySchemaId(id);
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
