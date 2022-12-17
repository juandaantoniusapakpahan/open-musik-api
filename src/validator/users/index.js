const InvariantError = require('../../exceptions/InvariantError');
const { UsersPayloadSchema } = require('./schema');

const UsersValidator = {
  validateUsersPayload: (payload) => {
    const userValidatorResult = UsersPayloadSchema.validate(payload);

    if (userValidatorResult.error) {
      throw new InvariantError(userValidatorResult.error.message);
    }
  },
};

module.exports = UsersValidator;
