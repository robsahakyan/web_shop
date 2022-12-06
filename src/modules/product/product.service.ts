/* eslint-disable sonarjs/no-ignored-return */
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fs1, { unlinkSync } from 'fs';
import fs from 'fs/promises';
import type { UpdateResult } from 'typeorm';
import { parseString } from 'xml2js';

import { CategoryService } from '../category/category.service';
import type { PageDto } from '../common/dtoes/page.dto';
import type { ProductDto } from '../common/modules/product/product.dto';
import type { UserFavoriteDto } from '../common/modules/product/user-favorite.dto';
import { EventService } from '../event/event.service';
import { TargetService } from '../target/target.service';
import { UserService } from '../user/user.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { FavoriteProductPageOptionsDto } from './dto/favorite-product-page-options.dto';
import type { ProductPageOptionDto } from './dto/product-page-option.dto';
import type { SearchProductsDto } from './dto/search-products.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import { ProductConflictException } from './exception/product-conflict.exception';
import { ProductNotFoundException } from './exception/product-not-found.exception';
import { ImageRepository } from './image.repository';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';
import { UserFavoriteRepository } from './user-favorite.repository';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const ftp = require('basic-ftp');

@Injectable()
export class ProductService {
  private readonly xmlPath: string;

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly imageRepository: ImageRepository,
    private readonly userFavoriteRepository: UserFavoriteRepository,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly eventService: EventService,
    private readonly targetService: TargetService,
  ) {
    this.xmlPath = __dirname + '/Full.xml';
  }

  async downloadXml() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
      await client.access({
        protocol: 'ftp',
        host: 'samosoft.am',
        port: 21,
        user: 'jpit.am',
        password: 'S65%r6jg',
        secure: false,
      });
      await client.downloadTo(fs1.createWriteStream(this.xmlPath), 'Full.xml');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new Error(error);
    }

    client.close();
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleCron() {
    await this.downloadXml();
    const file = await fs.readFile(this.xmlPath, 'utf-8');
    const newData = file.toString();
    const newData3 = newData.slice(94);
    let parsedFile;
    parseString(newData3, (err, results) => {
      parsedFile = results?.Products?.Product;
    });

    parsedFile?.map(async (product) => {
      const ftpProduct = await this.productRepository.findByCode(
        Number(product.CODE[0]),
      );

      if (ftpProduct) {
        await this.productRepository
          .update(ftpProduct.id, {
            name: product.Name[0],
            code: Number(product.CODE[0]),
            price: Number(product.Price[0]),
            stock: Number(product.Stock[0]),
          })
          .catch((error) => error);
      }

      await this.productRepository
        .save({
          name: product.Name[0],
          code: Number(product.CODE[0]),
          price: Number(product.Price[0]),
          stock: Number(product.Stock[0]),
        })
        .catch((error) => error);
    });
  }

  async create(files, createProductDto: CreateProductDto): Promise<ProductDto> {
    try {
      const newProduct = this.productRepository.create({
        name: createProductDto.name,
        name_ru: createProductDto.name_ru,
        name_en: createProductDto.name_en,
        code: Number(createProductDto.code),
        description: createProductDto.description,
        description_ru: createProductDto.description_ru,
        description_en: createProductDto.description_en,
        price: Number(createProductDto.price),
        category: createProductDto.category
          ? await this.categoryService.getByName(createProductDto.category)
          : undefined,
        event: createProductDto.event
          ? await this.eventService.getByName(createProductDto.event)
          : undefined,
        target: createProductDto.target
          ? await this.targetService.getByName(createProductDto.target)
          : undefined,
        fromAge: Number(createProductDto.fromAge) || undefined,
        toAge: Number(createProductDto.toAge) || undefined,
        stock: Number(createProductDto.stock),
      });

      await this.productRepository.save(newProduct);
      await files.map(async (image) => {
        await this.imageRepository.save({
          name: image.path,
          product: await this.productRepository.findByCode(
            createProductDto.code,
          ),
        });
      });

      return newProduct.toDto();
    } catch {
      await files.map((image) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        unlinkSync(image.path);
      });

      throw new ProductConflictException();
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async getAll(
    productPageOptionDto: ProductPageOptionDto,
  ): Promise<PageDto<ProductDto>> {
    let sortBy: string;

    switch (productPageOptionDto.sortBy) {
      case 'FREQUENTLY_SEARCHED':
        sortBy = 'product.views_count';
        break;
      case 'PRODUCTS_NEWS':
        sortBy = 'product.createdAt';
        break;
      default:
        sortBy = 'product.updatedAt';
        break;
    }

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .orderBy(sortBy, productPageOptionDto.order)
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.event', 'event')
      .leftJoinAndSelect('product.target', 'target')
      .where('product.created_at <= :date', {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

    if (productPageOptionDto.expectId) {
      if (!productPageOptionDto.categoryId) {
        throw new UnprocessableEntityException('categoryId must be provided');
      }

      queryBuilder.andWhere('product.id != :productId', {
        productId: productPageOptionDto.expectId,
      });
    }

    if (productPageOptionDto.fromAge) {
      if (
        Number(productPageOptionDto.toAge) &&
        Number(productPageOptionDto.toAge) <=
          Number(productPageOptionDto.fromAge)
      ) {
        throw new UnprocessableEntityException(
          'fromAge must be less then toAge',
        );
      }

      queryBuilder.andWhere('product.to_age > :fromAge', {
        fromAge: Number(productPageOptionDto.fromAge),
      });
    }

    if (productPageOptionDto.toAge) {
      queryBuilder.andWhere('product.from_age < :toAge', {
        toAge: Number(productPageOptionDto.toAge),
      });
    }

    if (productPageOptionDto.minPrice) {
      if (
        Number(productPageOptionDto.maxPrice) &&
        Number(productPageOptionDto.maxPrice) <=
          Number(productPageOptionDto.minPrice)
      ) {
        throw new UnprocessableEntityException(
          'minPrice must be less then maxPrice',
        );
      }

      queryBuilder.andWhere('product.price > :minPrice', {
        minPrice: Number(productPageOptionDto.minPrice),
      });
    }

    if (productPageOptionDto.maxPrice) {
      queryBuilder.andWhere('product.price < :maxPrice', {
        maxPrice: Number(productPageOptionDto.maxPrice),
      });
    }

    if (productPageOptionDto.categoryId) {
      queryBuilder.andWhere('product.category_id = :categoryId', {
        categoryId: productPageOptionDto.categoryId,
      });
    }

    if (
      productPageOptionDto.eventId &&
      !Array.isArray(productPageOptionDto.eventId)
    ) {
      productPageOptionDto.eventId = [productPageOptionDto.eventId];
    }

    if (
      productPageOptionDto.targetId &&
      !Array.isArray(productPageOptionDto.targetId)
    ) {
      productPageOptionDto.targetId = [productPageOptionDto.targetId];
    }

    if (productPageOptionDto.eventId) {
      queryBuilder.andWhere('product.event_id in (:...eventsArray)', {
        eventsArray: productPageOptionDto.eventId,
      });
    }

    if (productPageOptionDto.targetId) {
      queryBuilder.andWhere('product.target_id in (:...targetsArray)', {
        targetsArray: productPageOptionDto.targetId,
      });
    }

    if (productPageOptionDto.q) {
      queryBuilder.searchByString(productPageOptionDto.q, ['product.name']);
    }

    const [products, pageMetaDto] = await queryBuilder.paginate(
      productPageOptionDto,
    );

    return products.toPageDto(pageMetaDto);
  }

  async getById(id: string): Promise<ProductDto> {
    let product = await this.productRepository.findById(id);
    const viewsCount = product.views_count + 1;
    await this.productRepository.update(id, {
      views_count: viewsCount,
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    product = await this.productRepository.getAndJoin(id);

    return product.toDto();
  }

  async getProducts(
    searchProductsDto: SearchProductsDto,
  ): Promise<PageDto<ProductDto>> {
    const productsQuery = this.productRepository
      .createQueryBuilder('product')
      .where('product.name LIKE :name', {
        name: `%${searchProductsDto.search_name}%`,
      })
      .orWhere('product.name_ru LIKE :name_ru', {
        name_ru: `%${searchProductsDto.search_name}%`,
      })
      .orWhere('product.name_en LIKE :name_en', {
        name_en: `%${searchProductsDto.search_name}%`,
      });

    const [products, pageMetaDto] = await productsQuery.paginate(
      searchProductsDto,
    );

    return products.toPageDto(pageMetaDto);
  }

  async update(
    files,
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException();
    }

    if (files) {
      // eslint-disable-next-line sonarjs/no-ignored-return
      if (product.image) {
        product.image.map(async (image) => {
          await this.imageRepository.delete(image.id);
          unlinkSync(image.name);
        });
      }

      await files.map(async (image) => {
        await this.imageRepository.save({
          name: image.path,
          product,
        });
      });
    }

    const updateProductObject = {
      name: updateProductDto.name,
      name_ru: updateProductDto.name_ru,
      name_en: updateProductDto.name_en,
      description: updateProductDto.description,
      description_ru: updateProductDto.description_ru,
      description_en: updateProductDto.description_en,
      price: Number(updateProductDto.price) || product.price,
      category: updateProductDto.category
        ? await this.categoryService.getByName(updateProductDto.category)
        : undefined,
      event: updateProductDto.event
        ? await this.eventService.getByName(updateProductDto.event)
        : undefined,
      target: updateProductDto.target
        ? await this.targetService.getByName(updateProductDto.target)
        : undefined,
      fromAge: Number(updateProductDto.fromAge) || product.fromAge,
      toAge: Number(updateProductDto.toAge) || product.toAge,
      show: updateProductDto.show,
    };

    return this.productRepository.update(id, updateProductObject);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (product) {
      const images = product.image;

      if (Array.isArray(images)) {
        // eslint-disable-next-line sonarjs/no-ignored-return
        images.map(async (image) => {
          await this.imageRepository.delete(image.id);
          unlinkSync(image.name);
        });
      }
      // eslint-disable-next-line sonarjs/no-ignored-return

      await this.productRepository.delete(id);
    }
  }

  async getEntityById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductEntity();
    }

    return product;
  }

  async addFavorite(id: string, userId: string): Promise<UserFavoriteDto> {
    const userEntity = await this.userService.getEntityById(userId);
    const productEntity = await this.getEntityById(id);
    let userFavorite = (
      await this.userFavoriteRepository.findByIdandUserId(userId, id)
    )?.toDto();

    if (!userFavorite) {
      const favorite = this.userFavoriteRepository.create({
        userId,
        productId: id,
        user: userEntity,
        product: productEntity,
      });

      userFavorite = (await this.userFavoriteRepository.save(favorite)).toDto();
    }

    return userFavorite;
  }

  async getAllFavorite(
    userId: string,
    favoriteProductPageOptionDto: FavoriteProductPageOptionsDto,
  ): Promise<PageDto<UserFavoriteDto>> {
    const userEntity = await this.userService.getEntityById(userId);

    const queryBuilder = this.userFavoriteRepository
      .createQueryBuilder('userFavorite')
      .where('userFavorite.user_id = :id', { id: userEntity.id })
      .orderBy('userFavorite.updatedAt', favoriteProductPageOptionDto.order)
      .leftJoinAndSelect('userFavorite.product', 'product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.event', 'event')
      .leftJoinAndSelect('product.target', 'target');
    const [favoriteProducts, pageMetaDto] = await queryBuilder.paginate(
      favoriteProductPageOptionDto,
    );

    return favoriteProducts.toPageDto(pageMetaDto);
  }

  async deleteUserFavorite(productId: string, userId: string): Promise<void> {
    const userFavorite = await this.userFavoriteRepository.findByIdandUserId(
      userId,
      productId,
    );

    if (userFavorite) {
      await this.userFavoriteRepository.delete(userFavorite.id);
    }
  }
}
