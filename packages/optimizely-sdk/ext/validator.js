module.exports = {
  // config_validator, user_profile_service_validator, string_value_validator
  validate: () => true,

  // config_validator
  validateDatafile: () => true,

  // event_processor_config_validator
  validateEventBatchSize: () => true,

  // event_processor_config_validator
  validateEventFlushInterval: () => true,
};
