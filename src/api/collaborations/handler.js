class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, usersService, validator) {
    // eslint-disable-next-line no-underscore-dangle
    this._collaborationsService = collaborationsService;
    // eslint-disable-next-line no-underscore-dangle
    this._playlistsService = playlistsService;
    // eslint-disable-next-line no-underscore-dangle
    this._usersService = usersService;
    // eslint-disable-next-line no-underscore-dangle
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.collaborationsPayloadValidator(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    // eslint-disable-next-line no-underscore-dangle
    await this._usersService.checkUserById(userId);
    // eslint-disable-next-line no-underscore-dangle
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const resposne = h.response({
      status: 'success',
      data: {
        collaborationId,
        playlistId,
        userId,
      },
    });
    resposne.code(201);
    return resposne;
  }

  async deleteCollaborationHandler(request) {
    // eslint-disable-next-line no-underscore-dangle
    this._validator.collaborationsPayloadValidator(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    // eslint-disable-next-line no-underscore-dangle
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    // eslint-disable-next-line no-underscore-dangle
    await this._collaborationsService.deleteCollaborations(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
