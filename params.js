const params = {
  server: {
     host: '0.0.0.0',
     port: 3004,
     getUrl() {
       return 'http://' + this.host + ':' + this.port
     }
  },
}

module.exports = params
