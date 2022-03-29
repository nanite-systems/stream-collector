import { Injectable } from '@nestjs/common';

@Injectable()
export class WorldAccessor {
  detailToId(detail: string): string {
    return detail.match(/[0-9]+/)[0];
  }
}
