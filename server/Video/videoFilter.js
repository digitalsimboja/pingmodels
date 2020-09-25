const videoFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(mp4|MP4|mov|MOV|wmv|WMV|gif|GIF|flv|FLV|avi|AVI|avchd|AVCHD|webm|WebM|mkv|MKV|ogg|OGG)$/)) {
        req.fileValidationError = 'Only video files are allowed!';
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
};
exports.videoFilter = videoFilter;