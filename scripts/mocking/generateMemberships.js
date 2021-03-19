/* eslint-disable @typescript-eslint/no-var-requires */

const faker = require('faker')
const { saveToFile, randomRange } = require('./utils')

const OUTPUT_FILENAME = 'memberships.json'
const MEMBERSHIPS_COUNT = 4

const generateMembership = () => {
  const handleWordsCount = randomRange(1, 4)
  return {
    id: faker.random.uuid(),
    handle: faker.lorem.words(handleWordsCount),
  }
}

const main = async () => {
  const memberships = Array.from({ length: MEMBERSHIPS_COUNT }, generateMembership)
  await saveToFile(memberships, OUTPUT_FILENAME)
}

main()
