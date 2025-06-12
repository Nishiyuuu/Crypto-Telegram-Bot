const logger = require('../src/utils/logger');

logger.info('This is an informational message.');
logger.warn('This is a warning message.');
logger.error('This is an error message.', new Error('Something went wrong!'));