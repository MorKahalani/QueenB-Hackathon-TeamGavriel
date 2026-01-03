import multer from 'multer';
import path from 'path';

// manages file storage configuration for multer - where and how to store uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // defines the folder to store uploaded files
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // defines the naming convention for uploaded files to avoid name conflicts - 
    // using timestamp + original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// creates the multer instance with the defined storage configuration
const upload = multer({ storage: storage });

// exports the configured multer instance for use in other parts of the application
export default upload;