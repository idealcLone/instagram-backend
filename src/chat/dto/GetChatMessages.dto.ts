import { IsNumber } from 'class-validator';
import { PaginationDto } from '../../common/dtos/Pagination.dto';

export class GetChatMessagesDto extends PaginationDto {
  @IsNumber()
  chatHistoryId: number;
}
