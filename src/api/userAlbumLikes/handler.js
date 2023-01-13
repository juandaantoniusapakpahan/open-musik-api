class UserAlbumLikeHandler {
  constructor (userAlbumLikeService, cacheService) {
    this._userAlbumLikeService = userAlbumLikeService;
    this._cacheService = cacheService;
  }
  
  async likeDislikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    
    await this._userAlbumLikeService.likeAlbum(credentialId, albumId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil menambah/membatalkan like',
    });
    response.code(201);
    return response;   
  }

  async getLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    try {
      const getAlbumLikes = await this._cacheService.get(`likes:${albumId}`)
      const response = h.response({
        status: 'success',
        data: {
          likes: getAlbumLikes,
        },
      });
      response.code(200);
      response.header('X-Data-Source','cache');
      return response;
    } catch (error) {
      const getAlbumLikes = await this._userAlbumLikeService.getAlbumLikes(albumId);
      return {
        status: 'success',
        data: {
          likes: getAlbumLikes,
        },
      };
    }
  }
}

module.exports = UserAlbumLikeHandler;