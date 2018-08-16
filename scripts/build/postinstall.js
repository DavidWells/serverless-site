// Post install to build components
const cwd = process.cwd()
const path = require('path')
const child_process = require('child_process')
const exec = child_process.exec
const execSync = child_process.execSync
const fs = require('fs')
const rimraf = require('rimraf')
const docsConfig = require('../docs/config')
const blogConfig = require('../blog/config')
const docsRepoPath = docsConfig.serverlessRepoPath
const blogRepoPath = blogConfig.blogRepoPath
const seperator = '--------------------------'


function execute(command, callback) {
  try {
    exec(command, function(error, stdout, stderr){
      if (error.message.match(/successfully authenticated/)) {
        return callback(true)
      }
      return callback(false)
    })
  } catch (err) {
    return callback(false)
  }
}

// Check if user used ssh with github

console.log('cwd', cwd)
if (process.env.DEPLOY_PRIME_URL) {
  console.log('in NETLIFY CI context, don\'t clone stuff just download it')
} else if (cwd.indexOf('node_modules') > -1) {
  console.log('in node_module context, don\'t clone/download extra stuff')
} else {
  // in normal project site. check for serverless and serverless-blog folder
  console.log(seperator)
  console.log('Installing external content')
  console.log(seperator)
    // Handle blog folder
  const blogExists = fileOrDirExists(blogRepoPath)
  const isBlogGitRepo = fileOrDirExists(path.join(blogRepoPath, '.git'))

  // Check if user used ssh with github for cloning
  execute('ssh -T git@github.com', function(hasGithubSSH) {

    const blogGithubURL = (hasGithubSSH) ? 'git@github.com:serverless/blog.git': 'https://github.com/serverless/blog.git'
    const docsGithubURL = (hasGithubSSH) ? 'git@github.com:serverless/serverless.git': 'https://github.com/serverless/serverless.git'
    // console.log('hasGithubSSH', hasGithubSSH)
    if (!blogExists) {
      // check for git  path.join(blogRepoPath, '.git')
      console.log('No serverless blog repo found. Clone it from github')
      cloneRepo(blogGithubURL, blogConfig.repoBranch, 'serverless-blog')
    }
    if (blogExists && !isBlogGitRepo) {
      console.log('Blog folder exists but isnt github repo')
      rimraf(blogRepoPath, () => {
        console.log('Empty ./serverless-blog directory and clone repo')
        cloneRepo(blogGithubURL, blogConfig.repoBranch, 'serverless-blog')
      })
    } else {
      // console.log(`Local Blog Repo found`)
      // updateRepo(blogRepoPath)
      // console.log(seperator)
    }
    if (isBlogGitRepo) {
      console.log('Local Blog Repo found')
      updateRepo(blogRepoPath)
    }
  })
}
// TODO: replace clone with https://github.com/tunnckoCore/gitclone
function cloneRepo(repo, branch, path) {
  console.log(seperator)
  console.log(`Cloning repo down ${branch} branch of ${repo} to ./${path}`)
  const finalPath = (path) ? ` ${path}` : ''
  const command = `git clone -b ${branch} ${repo}${finalPath}`
  const child = exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) {
      console.warn(error)
    }
  })
  child.stdout.on('data', (data) => {
    console.log(data)
  })
  child.stderr.on('data', (data) => {
    console.log(data)
  })
  child.on('close', (code) => {
    console.log(`${repo} successfully cloned`)
    console.log(seperator)
  })
}

function updateRepo(filePath) {
  const name = path.basename(filePath)
  console.log(`Run git pull on ./${name}`)
  const command = 'git pull'
  const child = exec(command, { cwd: filePath }, (error, stdout, stderr) => {
    if (error) {
      console.warn(error)
    }
    // console.log(stdout)
  })
  child.stdout.on('data', (data) => {
    console.log(data)
    console.log(`./${name} repo updated`)
  })
  child.stderr.on('data', (data) => {
    console.log(data)
  })
  child.on('close', (code) => {
    console.log(seperator)
  })
}

function fileOrDirExists(filePath) {
  // console.log(filePath)
  try {
    fs.statSync(filePath)
    return true
  } catch (err) {
    return false
  }
}
