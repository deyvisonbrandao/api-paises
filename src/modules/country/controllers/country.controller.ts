import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryService } from '../services/country.service';

@ApiTags('países')
@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) { }

  @Get('countries')
  @ApiOperation({ summary: 'Lista todos os países' })
  @ApiResponse({ status: 200, description: 'Sucesso' })
  findAll() {
    return this.countryService.findAll();
  }

  @Get('country/id/:id')
  @ApiOperation({ summary: 'Lista um país pelo id' })
  @ApiResponse({ status: 200, description: 'Sucesso' })
  findById(@Param('id') id: number) {
    return this.countryService.findById(+id);
  }

  @Get('country/shortName/:shortName')
  @ApiOperation({ summary: 'Lista um país pela sigla' })
  @ApiResponse({ status: 200, description: 'Sucesso' })
  findByShortName(@Param('shortName') shortName: string) {
    return this.countryService.findByShortName(shortName);
  }

  @Get('countries/search/:search')
  @ApiOperation({ summary: 'Busca países por parte do nome' })
  @ApiResponse({ status: 200, description: 'Sucesso' })
  findBySearch(@Param('search') search: string) {
    return this.countryService.findBySearch(search);
  }
}
