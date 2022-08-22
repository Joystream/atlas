/* eslint-disable no-console */
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

const UPLOADS_DIR_PATH = `./uploads`
const PORT = process.env.AVATAR_SERVICE_PORT || 80

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(UPLOADS_DIR_PATH))
  },
  filename: (req, file, callback) => {
    callback(null, `${uuid()}${path.extname(file.originalname)}`)
  },
})
const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (!['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'].includes(file.mimetype)) {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: { fileSize: 1048576 },
})

const app = express()
app.use(cors())
app.use('/', express.static(path.resolve(UPLOADS_DIR_PATH)))

app.post('/', upload.single('file'), (req, res) => {
  if (req.headers['content-type'] && !/multipart\/form-data/.test(req.headers['content-type'])) {
    res.status(500).send('Content-Type header must be set to multipart/form-data')
    return
  }
  try {
    const fileName = req.file?.filename
    res.json({ fileName }).send()
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
})

app
  .listen(PORT, () => {
    if (!fs.existsSync(UPLOADS_DIR_PATH)) {
      fs.mkdirSync(UPLOADS_DIR_PATH)
    }
    console.log('listening on ' + PORT + '...')
  })
  .on('error', (error) => console.log('Error during app startup', error))
