import { Controller, Delete, Get } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleEnum } from "../../constants/role.enum";

import { Auth, UUIDParam } from "../../decorators/http.decorators";
import type { EventDto } from "../common/modules/event/event.dto";
import { EventService } from "./event.service";

@Controller("events")
@ApiTags("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOkResponse({
    description: "You have successfully received Evnets.",
  })
  @ApiNotFoundResponse({
    description: "Events are not found.",
  })
  async getAll(): Promise<EventDto[]> {
    return this.eventService.getAll();
  }

  @Get(":id")
  @ApiOkResponse({ description: "You have successfully received the Event." })
  @ApiBadRequestResponse({ description: "The Event does not exist." })
  async getById(@UUIDParam("id") id: string): Promise<EventDto> {
    return this.eventService.getById(id);
  }

  @Auth(RoleEnum.ADMIN)
  @Delete(":id")
  @ApiOkResponse({ description: "The Event successfully deleted." })
  @ApiBadRequestResponse({ description: "The Event does not exist." })
  async remove(@UUIDParam("id") id: string): Promise<void> {
    return this.eventService.remove(id);
  }
}
