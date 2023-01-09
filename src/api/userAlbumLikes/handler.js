class UserAlbumLikeHandler {
  constructor (service) {
    this._service = service;
  }
  
  async likeDislikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    
    await this._service.likeAlbum(credentialId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menambah/membatalkan like',
    });
    response.code(201);
    return response;   
  }

  async getLikeAlbumHandler(request) {
    const { id: albumId } = request.params;

    const getAlbumLikes = await this._service.getAlbumLikes(albumId);

    return {
      status: 'success',
      data: {
        likes: getAlbumLikes,
      },
    };
  }
}

module.exports = UserAlbumLikeHandler;