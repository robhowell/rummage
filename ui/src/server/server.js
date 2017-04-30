import EnvironmentVariables from 'dotenv-safe'

EnvironmentVariables.load()

const {
  DOWNLOAD_HOST = "",
  DOWNLOAD_PATH = "",
  DOWNLOAD_USERNAME = "",
  DOWNLOAD_PASSWORD = "",
} = process.env

console.log('DOWNLOAD_HOST:', DOWNLOAD_HOST)
console.log('DOWNLOAD_PATH:', DOWNLOAD_PATH)
console.log('DOWNLOAD_USERNAME:', DOWNLOAD_USERNAME)
console.log('DOWNLOAD_PASSWORD:', DOWNLOAD_PASSWORD)
