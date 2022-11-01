import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../common/dtoes/page-options.dto';

export class SearchProductsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  search_name: string;
}
