const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationsSchema } = require('./schema');

const CollaborationsValidator = {
  collaborationsPayloadValidator: (payload) => {
    const resultValidate = CollaborationsSchema.validate(payload);

    if (resultValidate.error) {
      throw new InvariantError(resultValidate.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
