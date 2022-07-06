/* eslint-disable no-console */
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

const DIRECTORY_NAME = 'uploads'
const UPLOAD_DIRECTORY = `./${DIRECTORY_NAME}`

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(UPLOAD_DIRECTORY))
  },
  filename: (req, file, callback) => {
    callback(null, `${uuid()}${path.extname(file.originalname)}`)
  },
})
const upload = multer({ storage })

const app = express()
app.use(cors())
app.use(`/${DIRECTORY_NAME}`, express.static(path.resolve(UPLOAD_DIRECTORY)))

const PORT = 80

app.post('/upload-avatar', upload.single('file'), (req, res) => {
  try {
    const fileName = req.file?.filename
    const oldAvatar = req.body.oldAvatar
    if (oldAvatar) {
      fs.unlink(`${UPLOAD_DIRECTORY}/${oldAvatar}`, (error) => {
        if (error) {
          console.error(error)
        }
      })
    }
    const uploadedImagePath = `${req.protocol}://${req.hostname}/${DIRECTORY_NAME}/${fileName}`
    res.end(uploadedImagePath)
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
})

app
  .listen(PORT, () => console.log('listening on ' + PORT + '...'))
  .on('error', (error) => console.log('Error during app startup', error))
