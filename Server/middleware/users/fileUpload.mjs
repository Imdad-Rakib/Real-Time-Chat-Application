import uploader from "../../utilities/singleUploader.mjs";

function fileUpload(req, res, next) {
    const upload = uploader(
        "files",
        // ["image/jpeg", "image/jpg", "image/png"],
        600000000,
        // 3
        // "Only .jpg, jpeg or .png format allowed!"
    );
    // call the middleware function
    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                error: err.msg
            });
        } else {
            next();
        }
    });
}

export default fileUpload;