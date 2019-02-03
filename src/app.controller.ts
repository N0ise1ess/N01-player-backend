import { Controller, Get, Param, Head, Header, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get('tracks/search/:text')
  search(@Param('text') text: string) {
    return this.service.search(text, 'tracks');
  }

  @Get('tracks/:trackId/download')
  @Header('Content-Type', 'audio/mpeg')
  async get(@Param('trackId') trackid: number, @Res() res) {
    let file = await this.service.download(trackid);
    file.pipe(res);
  }
}
