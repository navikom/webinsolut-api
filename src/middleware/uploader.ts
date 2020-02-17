import multer from "multer";
import Datauri from "datauri";
import path from "path";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const dUri = new Datauri();

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = (file: any) => dUri.format(path.extname(file.originalname).toString(), file.buffer);

export { upload, dataUri }
