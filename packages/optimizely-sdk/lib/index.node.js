/****************************************************************************
 * Copyright 2016-2017, 2019-2020 Optimizely, Inc. and contributors        *
 *                                                                          *
 * Licensed under the Apache License, Version 2.0 (the "License");          *
 * you may not use this file except in compliance with the License.         *
 * You may obtain a copy of the License at                                  *
 *                                                                          *
 *    http://www.apache.org/licenses/LICENSE-2.0                            *
 *                                                                          *
 * Unless required by applicable law or agreed to in writing, software      *
 * distributed under the License is distributed on an "AS IS" BASIS,        *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. *
 * See the License for the specific language governing permissions and      *
 * limitations under the License.                                           *
 ***************************************************************************/
import * as sdkLogging from '@optimizely/js-sdk-logging';

import fns from './utils/fns';
import Optimizely from './optimizely';
import utilEnums from './utils/enums';
import loggerPlugin from './plugins/logger';
import configValidator from './utils/config_validator';
import defaultErrorHandler from './plugins/error_handler';
import jsonSchemaValidator from './utils/json_schema_validator';
import defaultEventDispatcher from './plugins/event_dispatcher/index.node';
import eventProcessorConfigValidator from './utils/event_processor_config_validator';

var logger = sdkLogging.getLogger();
sdkLogging.setLogLevel(sdkLogging.LogLevel.ERROR);

var DEFAULT_EVENT_BATCH_SIZE = 10;
var DEFAULT_EVENT_FLUSH_INTERVAL = 30000; // Unit is ms, default is 30s

export var logging = loggerPlugin;
export var errorHandler = defaultErrorHandler;
export var eventDispatcher = defaultEventDispatcher;
export var enums = utilEnums;
export var setLogger = sdkLogging.setLogHandler;
export var setLogLevel = sdkLogging.setLogLevel;

/**
 * Creates an instance of the Optimizely class
 * @param  {Object} config
 * @param  {Object} config.datafile
 * @param  {Object} config.errorHandler
 * @param  {Object} config.eventDispatcher
 * @param  {Object} config.jsonSchemaValidator
 * @param  {Object} config.logger
 * @param  {Object} config.userProfileService
 * @param {Object} config.eventBatchSize
 * @param {Object} config.eventFlushInterval
 * @return {Object} the Optimizely object
 */
export var createInstance = (config) => {
  try {
    let hasLogger = false;
    config = config || {};

    // TODO warn about setting per instance errorHandler / logger / logLevel
    if (config.errorHandler) {
      sdkLogging.setErrorHandler(config.errorHandler);
    }
    if (config.logger) {
      // only set a logger in node if one is provided, by not setting we are noop-ing
      hasLogger = true;
      sdkLogging.setLogHandler(config.logger);
      // respect the logger's shouldLog functionality
      sdkLogging.setLogLevel(sdkLogging.LogLevel.NOTSET);
    }
    if (config.logLevel !== undefined) {
      sdkLogging.setLogLevel(config.logLevel);
    }

    try {
      configValidator.validate(config);
      config.isValidInstance = true;
    } catch (ex) {
      if (hasLogger) {
        logger.error(ex);
      } else {
        console.error(ex.message);
      }
      config.isValidInstance = false;
    }

    config = fns.assign(
      {
        clientEngine: utilEnums.NODE_CLIENT_ENGINE,
        eventBatchSize: DEFAULT_EVENT_BATCH_SIZE,
        eventDispatcher: defaultEventDispatcher,
        eventFlushInterval: DEFAULT_EVENT_FLUSH_INTERVAL,
        jsonSchemaValidator: jsonSchemaValidator,
        skipJSONValidation: false,
      },
      config,
      {
        // always get the OptimizelyLogger facade from logging
        logger: logger,
        errorHandler: sdkLogging.getErrorHandler(),
      }
    );

    if (!eventProcessorConfigValidator.validateEventBatchSize(config.eventBatchSize)) {
      logger.warn('Invalid eventBatchSize %s, defaulting to %s', config.eventBatchSize, DEFAULT_EVENT_BATCH_SIZE);
      config.eventBatchSize = DEFAULT_EVENT_BATCH_SIZE;
    }
    if (!eventProcessorConfigValidator.validateEventFlushInterval(config.eventFlushInterval)) {
      logger.warn(
        'Invalid eventFlushInterval %s, defaulting to %s',
        config.eventFlushInterval,
        DEFAULT_EVENT_FLUSH_INTERVAL
      );
      config.eventFlushInterval = DEFAULT_EVENT_FLUSH_INTERVAL;
    }

    return new Optimizely(config);
  } catch (e) {
    logger.error(e);
    return null;
  }
};

/**
 * Entry point into the Optimizely Node testing SDK
 */
export default {
  logging,
  errorHandler,
  eventDispatcher,
  enums,
  setLogger,
  setLogLevel,
  createInstance,
};
