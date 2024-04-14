import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { Subscription, SubscriptionHistory, User } from '../../../../entities';
import { Action } from '../enum/action';

type Subjects = InferSubjects<typeof Subscription | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  subscription(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.roleId === 1 || user.roleId === 0) {
      can(Action.Manage, 'all');
    } else if (user.roleId === 2) {
      can(Action.Manage, Subscription, { userId: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  subscriptionHistory(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.roleId === 1 || user.roleId === 0) {
      can(Action.Manage, 'all');
    } else if (user.roleId === 2) {
      can(Action.Manage, SubscriptionHistory, { userId: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

export { Action } from '../enum/action';
