import { Controller, Delete, Get } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleEnum } from "../../constants/role.enum";

import { Auth, UUIDParam } from "../../decorators/http.decorators";
import type { CategoryDto } from "../common/modules/category/category.dto";
import { CategoryService } from "./category.service";

@Controller("categories")
@ApiTags("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({
    description: "You have successfully received Categories.",
  })
  @ApiNotFoundResponse({
    description: "Categories are not found.",
  })
  async getAll(): Promise<CategoryDto[]> {
    return this.categoryService.getAll();
  }

  @Get(":id")
  @ApiOkResponse({
    description: "You have successfully received the Category.",
  })
  @ApiBadRequestResponse({ description: "The Category does not exist." })
  async getById(@UUIDParam("id") id: string): Promise<CategoryDto> {
    return this.categoryService.getById(id);
  }

  @Auth(RoleEnum.ADMIN)
  @Delete(":id")
  @ApiOkResponse({ description: "The Category successfully deleted." })
  @ApiBadRequestResponse({ description: "The Category does not exist." })
  async remove(@UUIDParam("id") id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
