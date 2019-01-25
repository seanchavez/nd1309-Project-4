class Mempool {
  constructor() {
    this.mempool = {};
    this.timeoutRequests = {};
  }
}

module.exports = Mempool;

self.timeoutRequests[request.walletAddress] = setTimeout(function() {
  self.removeValidationRequest(request.walletAddress);
}, TimeoutRequestsWindowTime);
