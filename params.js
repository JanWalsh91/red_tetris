let host = '10.13.5.15'

const params = {
  server: {
     host: host,
     port: 3004,
     getUrl() {
     	return 'http://' + this.host + ':' + this.port
     }
  },
}

module.exports = params
