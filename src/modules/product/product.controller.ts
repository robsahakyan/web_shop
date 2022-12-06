import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { UpdateResult } from 'typeorm';

import { RoleEnum } from '../../constants/role.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ApiFile } from '../../decorators/swagger.decorator';
import { StorageProvider } from '../../providers/storage.provider';
import type { PageDto } from '../common/dtoes/page.dto';
import { ProductDto } from '../common/modules/product/product.dto';
import type { UserFavoriteDto } from '../common/modules/product/user-favorite.dto';
import { UserDto } from '../common/modules/user/user.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FavoriteProductPageOptionsDto } from './dto/favorite-product-page-options.dto';
import { ProductPageOptionDto } from './dto/product-page-option.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(public readonly productService: ProductService) {}

  @Post()
  @Auth(RoleEnum.ADMIN)
  @ApiFile([{ name: 'images', isArray: true }], {
    isRequired: true,
    okResponseData: {
      type: ProductDto,
      description: 'product creation',
    },
  })
  @UseInterceptors(
    FilesInterceptor(
      'images',
      5,
      StorageProvider.productImageUploadFileOptions,
    ),
  )
  @ApiCreatedResponse({
    description: 'Your request of Product is successfully done.',
  })
  @ApiForbiddenResponse({ description: 'Product data does not match' })
  @ApiConflictResponse({ description: 'Product name is already exist' })
  async createProduct(
    @UploadedFiles() files,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.create(files, createProductDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'You have successfully received the Products.',
  })
  @ApiNotFoundResponse({
    description: 'Products not found.',
  })
  async getAll(
    @Query() productPageOptionDto: ProductPageOptionDto,
  ): Promise<PageDto<ProductDto>> {
    return this.productService.getAll(productPageOptionDto);
  }

  @Get('/search')
  @ApiOkResponse({ description: 'You have successfully received the Product.' })
  @ApiBadRequestResponse({ description: 'The Product does not exist.' })
  async getSearchProducts(
    @Query() searchProductsDto: SearchProductsDto,
  ): Promise<PageDto<ProductDto>> {
    return this.productService.getProducts(searchProductsDto);
  }

  @Get('/favorite')
  @ApiOkResponse({
    description: 'You have successfully received the favorite products.',
  })
  @ApiNotFoundResponse({
    description: 'Products not found.',
  })
  @Auth(RoleEnum.CUSTOMER)
  async getAllFavorites(
    @AuthUser() user: UserDto,
    @Query() favoriteProductPageOptionDto: FavoriteProductPageOptionsDto,
  ) {
    return this.productService.getAllFavorite(
      user.id,
      favoriteProductPageOptionDto,
    );
  }

  @Get(':id')
  @ApiOkResponse({ description: 'You have successfully received the Product.' })
  @ApiBadRequestResponse({ description: 'The Product does not exist.' })
  async getOne(@UUIDParam('id') id: string): Promise<ProductDto> {
    return this.productService.getById(id);
  }

  @Put(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiFile([{ name: 'images', isArray: true }], {
    isRequired: true,
    okResponseData: {
      type: ProductDto,
      description: 'product creation',
    },
  })
  @UseInterceptors(
    FilesInterceptor(
      'images',
      5,
      StorageProvider.productImageUploadFileOptions,
    ),
  )
  @ApiOkResponse({ description: 'Product successfully updated.' })
  @ApiBadRequestResponse({ description: 'The Product does not exist.' })
  async update(
    @UploadedFiles() files,
    @Body() updateProductDto: UpdateProductDto,
    @UUIDParam('id') id: string,
  ): Promise<UpdateResult> {
    return this.productService.update(files, id, updateProductDto);
  }

  @Delete(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiOkResponse({ description: 'Product successfully deleted.' })
  @ApiBadRequestResponse({ description: 'The Product does not exist.' })
  async remove(@UUIDParam('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }

  @Post('favorite/:productId')
  @Auth(RoleEnum.CUSTOMER)
  addNewFavorite(
    @UUIDParam('productId') productId: string,
    @AuthUser() user: UserDto,
  ): Promise<UserFavoriteDto> {
    return this.productService.addFavorite(productId, user.id);
  }

  @Delete('favorite/:productId')
  @Auth(RoleEnum.CUSTOMER)
  deleteSelectedFavorite(
    @UUIDParam('productId') productId: string,
    @AuthUser() user: UserDto,
  ): Promise<void> {
    return this.productService.deleteUserFavorite(productId, user.id);
  }
}
