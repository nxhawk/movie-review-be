import { Controller, Get, Query } from '@nestjs/common';
import { LlmService } from './llm.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ROUTES } from 'src/constants/route';

@ApiTags('LLM service')
@Controller(ROUTES.LLM)
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for movies by natural language' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  searchMovieByNaturalLanguage(@Query() query) {
    return this.llmService.searchMovieByNaturalLanguage(query);
  }

  @Get('navigate')
  @ApiOperation({ summary: 'Get page navigation base on natural language' })
  @ApiQuery({ name: 'query', required: true, type: String })
  getPageNavigation(@Query() query) {
    return this.llmService.getPageNavigation(query);
  }
}
