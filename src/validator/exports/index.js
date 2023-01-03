const ExportSongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportSongsPayload: (payload) => {
    const resultExportPayload = ExportSongsPayloadSchema.validate(payload);

    if (resultExportPayload.error) {
      throw new InvariantError(resultExportPayload.error.message);
    }
  }
}

module.exports  = ExportsValidator;