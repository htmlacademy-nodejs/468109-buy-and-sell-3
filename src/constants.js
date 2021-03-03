'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.ExitCode = {
  success: 0
};
module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  SUCCESS: 204,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};
module.exports.MAX_ID_LENGTH = 6;
