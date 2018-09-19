let host = '10.13.4.12'



const params = {
  server: {
     host: host,
     port: 8080,
     getUrl() {
     	return 'http://' + this.host + ':' + this.port
     }
  },
}

module.exports = params
