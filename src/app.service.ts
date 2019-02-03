import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as md5 from 'md5';
import request = require('request');
@Injectable()
export class AppService {
  private readonly searchUrl =
    'https://music.yandex.ru/handlers/music-search.jsx';
  async search(text: string, type: string) {
    let result = await axios.get(this.searchUrl, {
      withCredentials: true,
      params: {
        text,
        type,
        page: 0,
      },
    });
    return result.data[type].items.map(
      ({ id, durationMs, title, artists, albums }) => ({
        trackId: id,
        durationMs,
        title,
        coverUri: albums[0].coverUri.replace('%%', '100x100'),
        artist: artists[0].name,
      }),
    );
  }

  download(trackId: number) {
    return axios
      .get(
        `https://music.yandex.ru/api/v2.1/handlers/track/${trackId}/track/download`,
        {
          withCredentials: true,
          headers: { 'X-Retpath-Y': 'https://music.yandex.ru/' },
        },
      )
      .then(({ data }) => {
        return axios.get(data.src, {
          withCredentials: true,
          params: { format: 'json' },
        });
      })

      .then(({ data }) => {
        let { host, path, s, ts } = data;
        let hash = md5(`XGRlBW9FXlekgbPrRHuSiA${path.substring(1)}${s}`);
        return request.get(`https://${host}/get-mp3/${hash}/${ts}${path}`);
        // return axios.get(, {
        //   withCredentials: true,
        //   responseType: 'stream',
        // });
      });
  }
}
