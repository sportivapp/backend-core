const ClassMedia = require('../../models/v2/ClassMedia');

const classMediaService = {};

classMediaService.initMedia = async (mediaDTO, user, trx) => {

    return ClassMedia.query(trx)
        .insertToTable(mediaDTO, user.sub);

};

classMediaService.saveMedia = async (classUuid, fileIds, user, trx) => {

    const medias = await ClassMedia.query(trx)
        .where('class_uuid', classUuid);
    const mediasFileIds = medias.map(media => {
        return media.fileId;
    });

    const newMediasUserIds = fileIds.filter(fileId => !mediasFileIds.includes(fileId));
    const removedMediasUserIds = mediasFileIds.filter(fileId => !fileIds.includes(fileId));

    const newMedias = newMediasUserIds.map(fileId => {
        return {
            classUuid: classUuid,
            fileId: fileId,
        }
    });

    if (removedMediasUserIds !== 0) {
        await ClassMedia.query(trx)
            .whereIn('file_id', removedMediasUserIds)
            .delete();
    }

    // No new media, only remove
    if (newMedias.length === 0)
        return;

    return ClassMedia.query(trx)
        .insertToTable(newMedias, user.sub);

}

module.exports = classMediaService;