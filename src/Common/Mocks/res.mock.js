const res = {
  sendResult: '',
  contentTypeResult: '',
  statusResult: '',
  jsonResult: '',
  contentType: function (param) {
    this.contentTypeResult = param
    return this
  },
  send: function (param) {
    this.sendResult = param
    return this
  },
  status: function (param) {
    this.statusResult = param
    return this
  },
  json: function (param) {
    this.jsonResult = param
    return this
  }

}
export default res
