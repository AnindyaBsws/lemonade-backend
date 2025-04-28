import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)    //You can console log the file.fieldname and uniqueSuffix
    }
  })
  
  export const upload = multer({ storage: storage }) // As we are using ES6, we can only write "storage", as the key-valuye is same.