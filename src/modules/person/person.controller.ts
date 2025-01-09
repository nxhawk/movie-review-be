import { Controller, Get, Param, Query } from '@nestjs/common';
import { PersonService } from './person.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROUTES } from 'src/constants/route';

@ApiTags('Person TMDB')
@Controller(ROUTES.PERSON)
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('/search')
  @ApiOperation({ summary: 'Search for people' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the search results.',
  })
  searchPeople(@Query() query) {
    return this.personService.searchPeople(query);
  }

  @Get('/:personId')
  @ApiOperation({ summary: 'Get the detail of a person' })
  @ApiParam({
    description: 'The ID of the person to get detail',
    name: 'personId',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the person detail.',
  })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  getPersonDetail(@Param() { personId }) {
    return this.personService.getPersonDetail(personId);
  }

  @Get('/:personId/credits')
  @ApiOperation({ summary: 'Get the movie credits of a person' })
  @ApiParam({
    description: 'The ID of the person to get movie credits',
    name: 'personId',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the movie credits of the person.',
  })
  @ApiResponse({ status: 404, description: 'Person not found.' })
  getPersonCredits(@Param() { personId }) {
    return this.personService.getPersonCredits(personId);
  }
}
