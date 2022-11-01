import { Controller, Delete, Get } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleEnum } from "../../constants/role.enum";

import { Auth, UUIDParam } from "../../decorators/http.decorators";
import type { TargetDto } from "../common/modules/target/target.dto";
import { TargetService } from "./target.service";

@Controller("targets")
@ApiTags("targets")
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Get()
  @ApiOkResponse({
    description: "You have successfully received targets.",
  })
  @ApiNotFoundResponse({
    description: "Targets are not found.",
  })
  async findAll(): Promise<TargetDto[]> {
    return this.targetService.getAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "You have successfully received the Target." })
  @ApiBadRequestResponse({ description: "The Target does not exist." })
  async getById(@UUIDParam("id") id: string): Promise<TargetDto> {
    return this.targetService.getById(id);
  }

  @Auth(RoleEnum.ADMIN)
  @Delete(":id")
  @ApiOkResponse({ description: "The Target successfully deleted." })
  @ApiBadRequestResponse({ description: "The Target does not exist." })
  async remove(@UUIDParam("id") id: string): Promise<void> {
    return this.targetService.remove(id);
  }
}
