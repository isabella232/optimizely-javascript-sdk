var jsSdkUtils = require('@optimizely/js-sdk-utils')

const JAVASCRIPT_CLIENT_ENGINE = 'javascript-sdk'
const NODE_CLIENT_ENGINE = 'node-sdk'
const REACT_CLIENT_ENGINE = 'react-sdk'

// The normal utils.sprintf accepts the format string as first param.
// That string will be undefined for the strings stubbed by this file (ie,
// ERROR_MESSAGES and LOG_MESSAGES, etc). So we override the sprintf function
// to just splat out the args instead of attempting to invoke .replace on it.
jsSdkUtils.sprintf = (...args) => args.toString()

module.exports = {
  LOG_LEVEL: {
    NOTSET: 0,
    DEBUG: 1,
    INFO: 2,
    WARNING: 3,
    ERROR: 4
  },

  ERROR_MESSAGES: {},

  LOG_MESSAGES: {},

  RESERVED_EVENT_KEYWORDS: {
    REVENUE: 'revenue',
    VALUE: 'value'
  },

  CONTROL_ATTRIBUTES: {
    BOT_FILTERING: '$opt_bot_filtering',
    BUCKETING_ID: '$opt_bucketing_id',
    STICKY_BUCKETING_KEY: '$opt_experiment_bucket_map',
    USER_AGENT: '$opt_user_agent'
  },

  JAVASCRIPT_CLIENT_ENGINE,
  NODE_CLIENT_ENGINE,
  REACT_CLIENT_ENGINE,
  NODE_CLIENT_VERSION: '3.6.0-alpha.1',

  VALID_CLIENT_ENGINES: [NODE_CLIENT_ENGINE, REACT_CLIENT_ENGINE, JAVASCRIPT_CLIENT_ENGINE],

  NOTIFICATION_TYPES: jsSdkUtils.NOTIFICATION_TYPES,

  DECISION_NOTIFICATION_TYPES: {
    AB_TEST: 'ab-test',
    FEATURE: 'feature',
    FEATURE_TEST: 'feature-test',
    FEATURE_VARIABLE: 'feature-variable'
  },

  DECISION_SOURCES: {
    FEATURE_TEST: 'feature-test',
    ROLLOUT: 'rollout'
  },

  FEATURE_VARIABLE_TYPES: {
    BOOLEAN: 'boolean',
    DOUBLE: 'double',
    INTEGER: 'integer',
    STRING: 'string'
  },

  DATAFILE_VERSIONS: {
    V2: '2',
    V3: '3',
    V4: '4'
  }
}
