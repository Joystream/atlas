/* eslint-disable @typescript-eslint/no-var-requires */

const { Octokit } = require('@octokit/rest')
const { get } = require('lodash')

const ENV_PRODUCTION = 'PRODUCTION'
const ENV_STAGING = 'STAGING'

module.exports = {
  onPreBuild: async ({ inputs: { production_branch, app_env_prefix }, utils }) => {
    const { CONTEXT, REVIEW_ID, REPOSITORY_URL } = process.env

    // === get env based on branch/PR ===
    let env = ENV_PRODUCTION
    if (CONTEXT === 'branch-deploy') {
      env = ENV_STAGING
    } else if (CONTEXT === 'deploy-preview') {
      const productionPull = await isProductionPull({
        productionBranch: production_branch,
        repoUrl: REPOSITORY_URL,
        pullNumber: REVIEW_ID,
      })
      if (!productionPull) {
        env = ENV_STAGING
      }
    }

    const pluginSummary = `Using ${env} variables`
    console.log(pluginSummary)

    // === expose all matching env variables ===
    let pluginText = ''
    Object.keys(process.env).forEach((varKey) => {
      if (varKey.startsWith(env)) {
        const varValue = process.env[varKey]
        const appVarKey = app_env_prefix ? `${app_env_prefix}${varKey.replace(`${env}_`, '')}` : varKey

        const varLine = `Exposing ${varKey} as ${appVarKey}=${varValue}`
        pluginText = `${pluginText}\n${varLine}`
        console.log(varLine)

        process.env[appVarKey] = varValue
      }
    })

    // === expose env ===
    const appEnvKey = `${app_env_prefix}ENV`
    const envLine = `Exposing ${appEnvKey}=${env}`
    pluginText = `${pluginText}\n${envLine}`
    console.log(envLine)

    process.env[appEnvKey] = env

    utils.status.show({
      title: 'Env variables set',
      summary: pluginSummary,
      text: pluginText,
    })
  },
}

const isProductionPull = async ({ productionBranch, repoUrl, pullNumber }) => {
  try {
    const baseBranch = await getPullBaseBranch({ repoUrl, pullNumber })
    return baseBranch === productionBranch
  } catch (e) {
    console.log("Couldn't load base branch: ", e)
  }
  return true
}

const getRepoOwnerAndName = (repoUrl) => {
  const segments = repoUrl.split('/')
  const owner = segments[segments.length - 2]
  const name = segments[segments.length - 1]
  return { owner, name }
}

const getPullBaseBranch = async ({ repoUrl, pullNumber, timeout = 2000 }) => {
  const { owner, name } = getRepoOwnerAndName(repoUrl)
  const octokit = new Octokit()

  const response = await octokit.pulls.get({
    owner,
    repo: name,
    pull_number: pullNumber,
    request: {
      timeout,
    },
  })

  if (response.status !== 200) {
    throw new Error('Failed to fetch pull')
  }

  const base = get(response, 'data.base.ref', null)
  if (!base) {
    throw new Error('Failed to access base branch')
  }

  return base
}
