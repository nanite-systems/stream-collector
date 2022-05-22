import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { ArrayUnique, IsIn, IsNotEmpty } from 'class-validator';
import { PS2Environment, Stream } from 'ps2census';
import { Transform } from 'class-transformer';

const EventNames: Stream.CensusCommands.Subscribe['eventNames'] = [
  'all',
  'AchievementEarned',
  'BattleRankUp',
  'ContinentLock',
  'ContinentUnlock',
  'Death',
  'FacilityControl',
  'GainExperience',
  'ItemAdded',
  'MetagameEvent',
  'PlayerFacilityCapture',
  'PlayerFacilityDefend',
  'PlayerLogin',
  'PlayerLogout',
  'SkillAdded',
  'VehicleDestroy',
];

export class CensusConfig {
  @ProcessEnv('SERVICE_ID')
  @IsNotEmpty()
  serviceId;

  @ProcessEnv('PS2_ENVIRONMENT')
  @IsIn(['ps2', 'ps2ps4eu', 'ps2ps4us'])
  environment: PS2Environment;

  @ProcessEnv('SUBSCRIBE_WORLDS')
  @Transform(({ value }) => value.split(','))
  worlds: string[] = ['all'];

  @ProcessEnv('SUBSCRIBE_EVENTS')
  @IsIn(['all', ...EventNames], {
    each: true,
  })
  @ArrayUnique()
  @Transform(({ value }) => value.split(','))
  events: Stream.CensusCommands.Subscribe['eventNames'];

  @ProcessEnv('SUBSCRIBE_LOGICAL_AND')
  @Transform(({ value }) => value.toUpperCase() == 'TRUE')
  logicalAnd = false;
}
