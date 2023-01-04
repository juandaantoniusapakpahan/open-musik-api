class ExportsHandler {
  constructor(ProducerService, playlistsService, validator) {
    this._ProducerService = ProducerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportNotesHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // Memeriksa kepemilikan;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const message = {
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._ProducerService.sendMessage('export:songs', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler; 
