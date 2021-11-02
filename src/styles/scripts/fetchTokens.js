/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const fetchTokenUrlsFromGithub = async () => {
  try {
    const res = await axios.get('https://api.github.com/repos/Joystream/atlas-resources/contents/design_tokens')
    return res.data.filter((file) => file.name.includes('token.json')).map((file) => file.download_url)
  } catch (error) {
    console.error('Something went wrong. Status code:', error.response.status)
  }
}

const generateTokens = async () => {
  try {
    const tokenUrls = await fetchTokenUrlsFromGithub()
    const responses = await axios.all(tokenUrls.map((res) => axios.get(res)))

    responses.forEach((res) => {
      const filePath = path.join(__dirname, '..', 'tokens')
      const fileName = path.basename(res.config.url)

      fs.mkdir(filePath, { recursive: true }, (err) => {
        if (err) {
          console.log("Couldn't generate directory", err)
        }
      })

      fs.writeFile(`${filePath}/${fileName}`, JSON.stringify(res.data, null, 2) + '\n', (err) => {
        console.log(`Generating ${fileName} done`)
        if (err) {
          console.log("Couldn't generate tokens", err)
        }
      })
    })
  } catch (error) {
    console.error('Something went wrong. Status code:', error.response.status)
  }
}

generateTokens()
