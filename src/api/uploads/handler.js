
class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;

    this._validator.validateImageHeaders(cover.hapi.headers);
    const { id: albumId } = request.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    cUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.allCovers(albumId, cUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: cUrl,
      },    
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
