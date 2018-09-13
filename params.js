const params = {
  server: {
     host: '10.13.6.14',
     port: 3004,
     getUrl() {
       return 'http://' + this.host + ':' + this.port
     }
  },
}

module.exports = params
