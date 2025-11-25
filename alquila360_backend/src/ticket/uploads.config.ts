import { diskStorage } from 'multer';
import { join } from 'path';

export const ticketsDiskStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'tickets'),
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safe);
  },
});
