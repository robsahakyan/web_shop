import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// eslint-disable-next-line unicorn/import-style
import { join } from 'path';

@Controller('app')
@ApiTags('app')
export class AppController {
  @Get('images/:path')
  getUserImage(@Param('path') path: string, @Res() res) {
    const tmp = path.slice(Math.max(0, path.indexOf('/') + 1));
    const dirName = tmp.slice(0, Math.max(0, tmp.indexOf('/')));

    if (dirName === 'avatars' || dirName === 'products-images') {
      return res.sendFile(join(process.cwd(), path));
    }

    throw new HttpException('dirname not found', HttpStatus.FORBIDDEN);
  }
}
