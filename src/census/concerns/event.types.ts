/** Character centric events */

export type AchievementEarnedPayload = {
  event_name: 'AchievementEarned';
  character_id: string;
  timestamp: string;
  world_id: string;
  achievement_id: string;
  zone_id: string;
};

export type BattleRankUpPayload = {
  battle_rank: string;
  character_id: string;
  event_name: 'BattleRankUp';
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type DeathPayload = {
  attacker_character_id: string;
  attacker_fire_mode_id: string;
  attacker_loadout_id: string;
  attacker_vehicle_id: string;
  attacker_weapon_id: string;
  character_id: string;
  character_loadout_id: string;
  event_name: 'Death';
  // is_critical: string,
  is_headshot: string;
  timestamp: string;
  // vehicle_id: string,
  world_id: string;
  zone_id: string;
};

export type GainExperiencePayload = {
  amount: string;
  character_id: string;
  event_name: 'GainExperience';
  experience_id: string;
  loadout_id: string;
  other_id: string;
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type ItemAddedPayload = {
  character_id: string;
  context: string;
  event_name: 'ItemAdded';
  item_count: string;
  item_id: string;
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type PlayerFacilityCapturePayload = {
  character_id: string;
  event_name: 'PlayerFacilityCapture';
  facility_id: string;
  outfit_id: string;
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type PlayerFacilityDefendPayload = {
  character_id: string;
  event_name: 'PlayerFacilityDefend';
  facility_id: string;
  outfit_id: string;
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type PlayerLoginPayload = {
  character_id: string;
  event_name: 'PlayerLogin';
  timestamp: string;
  world_id: string;
};

export type PlayerLogoutPayload = {
  character_id: string;
  event_name: 'PlayerLogout';
  timestamp: string;
  world_id: string;
};

export type SkillAddedPayload = {
  character_id: string;
  event_name: 'SkillAdded';
  skill_id: string;
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type VehicleDestroyPayload = {
  attacker_character_id: string;
  attacker_loadout_id: string;
  attacker_vehicle_id: string;
  attacker_weapon_id: string;
  character_id: string;
  event_name: 'VehicleDestroy';
  facility_id: string;
  faction_id: string;
  timestamp: string;
  vehicle_id: string;
  world_id: string;
  zone_id: string;
};

/** World centric events */

export type ContinentLockPayload = {
  event_name: 'ContinentLock';
  event_type: string;
  metagame_event_id: string;
  nc_population: string;
  previous_faction: string;
  timestamp: string;
  tr_population: string;
  triggering_faction: string;
  vs_population: string;
  world_id: string;
  zone_id: string;
};

export type ContinentUnlockPayload = {
  event_name: 'ContinentUnlock';
  event_type: string;
  metagame_event_id: string;
  nc_population: string;
  previous_faction: string;
  timestamp: string;
  tr_population: string;
  triggering_faction: string;
  vs_population: string;
  world_id: string;
  zone_id: string;
};

export type FacilityControlPayload = {
  duration_held: string;
  event_name: 'FacilityControl';
  facility_id: string;
  new_faction_id: string;
  old_faction_id: string;
  outfit_id: string;
  timestamp: string;
  world_id: string;
  zone_id: string;
};

export type MetagameEventPayload = {
  event_name: 'MetagameEvent';
  experience_bonus: string;
  faction_nc: string;
  faction_tr: string;
  faction_vs: string;
  metagame_event_id: string;
  metagame_event_state: string;
  metagame_event_state_name: string; // Added
  timestamp: string;
  world_id: string;
  instance_id: string;
};

export type PS2Event =
  | AchievementEarnedPayload
  | BattleRankUpPayload
  | DeathPayload
  | GainExperiencePayload
  | ItemAddedPayload
  | PlayerFacilityCapturePayload
  | PlayerFacilityDefendPayload
  | PlayerLoginPayload
  | PlayerLogoutPayload
  | SkillAddedPayload
  | VehicleDestroyPayload
  | ContinentLockPayload
  | ContinentUnlockPayload
  | FacilityControlPayload
  | MetagameEventPayload;

export type PS2EventNames = PS2Event['event_name'];
