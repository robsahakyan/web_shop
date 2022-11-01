import 'source-map-support/register';

import { compact, map } from 'lodash';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';

import { VIRTUAL_COLUMN_KEY } from './decorators/virtual-column.decorator';
import type { AbstractDto } from './modules/common/dtoes/abstract.dto';
import { PageDto } from './modules/common/dtoes/page.dto';
import { PageMetaDto } from './modules/common/dtoes/page-meta.dto';
import type { PageOptionsDto } from './modules/common/dtoes/page-options.dto';
import type { AbstractEntity } from './modules/common/entities/abstract.entity';

declare global {
  // Just to differ types where class instance is not mandatory and plain object can work as well
  type Plain<T> = T;

  interface Array<T> {
    toDtos<Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(
      this: T[],
      options?: any,
    ): Dto[];

    toPageDto<Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
    ): PageDto<Dto>;
  }
}

declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }

  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
    ): Promise<[Entity[], PageMetaDto]>;
  }
}

Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto,
>(options?: any): Dto[] {
  return compact(map<Entity, Dto>(this, (item) => item.toDto(options)));
};

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto) {
  return new PageDto(this.toDtos(), pageMetaDto);
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  this.setParameter('q', `%${q}%`);

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
) {
  const selectQueryBuilder = this.skip(pageOptionsDto.skip).take(
    pageOptionsDto.take,
  );
  const itemCount = await selectQueryBuilder.getCount();

  const { entities, raw } = await selectQueryBuilder.getRawAndEntities();

  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entitiy[propertyKey] = item[name];
    }

    return entitiy;
  });

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [items, pageMetaDto];
};
