/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const fs = require('fs')
const path = require('path')

axios
  .get('https://raw.githubusercontent.com/Joystream/atlas-resources/main/design_tokens/colors.token.json')
  .then((res) => {
    const filePath = path.join(__dirname, '..', 'tokens')
    fs.writeFile(`${filePath}/colors.json`, JSON.stringify(res.data, null, 2), (err) => {
      console.log('done')
      if (err) {
        console.log(err)
      }
    })
  })
