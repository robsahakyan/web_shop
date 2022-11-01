import { Injectable } from '@nestjs/common';

import { ContactRepository } from './contact.repostitory';
import type { CreateContactDto } from './dtoes/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(createContactDto: CreateContactDto) {
    try {
      await this.contactRepository.save(createContactDto);

      return {
        success: true,
        messages: [],
      };
    } catch (error) {
      return {
        success: false,
        messages: [error],
      };
    }
  }

  async getAll() {
    try {
      const feedbacks = await this.contactRepository.findAll();

      return feedbacks.map((feedback) => feedback.toDto());
    } catch (error) {
      return {
        success: false,
        messages: [error],
      };
    }
  }

  async getOne(id: string) {
    try {
      return (await this.contactRepository.findById(id)).toDto();
    } catch (error) {
      return {
        success: false,
        messages: [error],
      };
    }
  }
}
