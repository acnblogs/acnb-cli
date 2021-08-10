const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data
})

async function getRepoList() {
  return axios.get('https://api.github.com/orgs/awescnb/repos')
}

async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/awescnb/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList,
}
