/* eslint-disable no-console */
import { spawn } from 'child_process'
import { differenceInDays } from 'date-fns'
import { config } from 'dotenv'
import fs from 'fs'
import { scheduleJob } from 'node-schedule'

config()
const BACKUPS_PATH = './figma-backup-root/backups'
const DOWNLOAD_TIMEOUT = 15
const BACKUP_LIFETIME = 30

const init = () => {
  fs.readdir(BACKUPS_PATH, (err, files) => {
    if (files && files.length) {
      files.forEach((file) => {
        if (differenceInDays(new Date(), new Date(file)) > BACKUP_LIFETIME) {
          fs.rm(`${BACKUPS_PATH}/${file}`, { force: true, recursive: true }, (error) => {
            if (error) {
              console.error(error)
            }
            console.log('Old backups have been removed')
          })
        }
      })
    }

    const figmaBackup = spawn('figma-backup', [
      '-e',
      process.env.FIGMA_EMAIL,
      '-p',
      process.env.FIGMA_PASSWORD,
      '-t',
      process.env.FIGMA_TOKEN,
      '--download-timeout',
      DOWNLOAD_TIMEOUT,
      '--projects-ids',
      ...process.env.FIGMA_IDS.split(' '),
    ])

    figmaBackup.stdout.on('data', (data) => {
      process.stdout.write(data)
    })
  })
}

scheduleJob({ dayOfWeek: 2, hour: '00', minute: '00' }, () => {
  console.info(`[${new Date()}] Starting figma backup`)
  init()
})
