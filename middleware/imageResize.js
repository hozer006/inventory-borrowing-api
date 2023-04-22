const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const outputFolder = "public/uploads";

module.exports = async (req, res, next) => {
    try {
        await sharp(req.file.path)
            .resize(600, 500)
            .jpeg({ quality: 50 })
            .toFile(path.resolve(outputFolder, req.file.filename + "resize.jpg"));
        fs.unlinkSync(req.file.path);
        req.file = `${outputFolder}/${req.file.filename}resize.jpg`

        res.status(200).send({
            message: `Book upload successfully`,
            file: req.file
          });
    } catch (error) {
        res.status(500).send({
            message: `error`,
          });
    }
    next();
};
