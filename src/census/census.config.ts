import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { ArrayUnique, IsIn, IsInt, IsNotEmpty, Min } from 'class-validator';
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

  @ProcessEnv('RESUBSCRIBE_INTERVAL')
  @IsInt()
  @Min(1000)
  @Transform(({ value }) => Number.parseInt(value, 10))
  resubscribeInterval = 5 * 3600 * 1000;

  @ProcessEnv('SUBSCRIBE_WORLDS')
  @Transform(({ value }) => value.split(','))
  worlds: string[] = ['all'];

  @ProcessEnv('SUBSCRIBE_EVENTS')
  @IsIn(['all', ...EventNames], {
    each: true,
  })
  @ArrayUnique()
  @Transform(({ value }) => value.split(','))
  events: Stream.CensusCommands.Subscribe['eventNames'] = ['all'];

  @ProcessEnv('SUBSCRIBE_LOGICAL_AND')
  @Transform(({ value }) => value.toUpperCase() == 'TRUE')
  logicalAnd = false;
}
