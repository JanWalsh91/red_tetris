let host = '127.0.0.1'



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
