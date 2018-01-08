/**
 * skyway-sdk is required.
 * See also https://webrtc.ecl.ntt.com/js-tutorial.html
 */

var io = io || {};
io.github = io.github || {};
io.github.shunshun94 = io.github.shunshun94 || {};
io.github.shunshun94.trpg = io.github.shunshun94.trpg || {};
io.github.shunshun94.trpg.udonarium = io.github.shunshun94.trpg.udonarium || {};

io.github.shunshun94.trpg.udonarium.client = class  {
	constructor(apiKey, targetPeerId, opt_debugLevel) {
		this.peer = new Peer({
			key: apiKey, debug: opt_debugLevel || 0
		});
		this.peerId = targetPeerId;
		this.isConnected = false;
		this._eventBind();
	}
	
	connect() {
		if(this.isConnected) {
			return true;
		}
		
		if(this.peer.open) {
			this.connection = this.peer.connect(this.peerId, {
				serialization: 'binary'
			});
			
			this.connection.on('data', data => {
				const tmp = new Uint8Array(data.data)
				try {
					const text = msgpack.decode(tmp);
					console.log('getData', text);
				} catch (e) {
					console.error(e);
					console.error('raw', data.data);
					console.error('raw as array', tmp);
				}
			});
			
			this.isConnected = true;
			return true;
		}
		console.warn('Connection with SkyWay server is not started. You cannot connect to room, please wait.');
		return false;
	}
	
	getAllPeerIds() {
		return new Promise((resolve, reject) => {
			try {
				this.peer.listAllPeers(peers => {
					resolve(peers);
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	
	toString() {
		return '';
	}
	
	_eventBind() {
		this.peer.on('connection', connection => {
			console.log(connection);
		});
	}
};

io.github.shunshun94.trpg.udonarium.client.LOG_LEVEL = {
	NONE: 0, ERROR: 1, ERR: 1, WARN: 2, WARNING: 2, INFO: 3, TRACE: 3, DEBUG: 3, FULL: 3
};

