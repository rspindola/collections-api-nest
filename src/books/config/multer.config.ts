import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads/covers',
    filename: (req, file, cb) => {
      const originalName = file.originalname.split('.')[0].replace(/\s+/g, '_');
      const timestamp = Date.now();
      const ext = extname(file.originalname);
      cb(null, `${originalName}_${timestamp}${ext}`);
    },
  }),
};
