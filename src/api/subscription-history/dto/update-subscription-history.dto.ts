import { PartialType } from '@nestjs/swagger';

import { CreateSubscriptionHistoryDto } from './create-subscription-history.dto';

export class UpdateSubscriptionHistoryDto extends PartialType(
  CreateSubscriptionHistoryDto,
) {}
