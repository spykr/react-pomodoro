//Web Audio API
//http://matt-harrison.com/perfect-web-audio-on-ios-devices-with-the-web-audio-api/
try {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	window.audioContext = new window.AudioContext();
} catch( e ) {
	console.log( 'No web audio API support' );
}

var WebAudioAPISoundManager = function( context )
{
	this.context = context;
	this.bufferList = {};
	this.playingSounds = {};
};
WebAudioAPISoundManager.prototype = {
	addSound: function( url )
	{
		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );
		request.responseType = 'arraybuffer';
		var self = this;
		request.onload = function()
		{
			self.context.decodeAudioData(
				request.response,
				function( buffer ) {
					if( !buffer )
					{
						console.log( 'Error decoding file data: ' + url );
						return;
					}
					self.bufferList[ url ] = buffer;
				});
		};
		request.onerror = function() {
			console.log( 'Buffer loader error' );
		};
		request.send();
	},
	stopSoundWithURL: function( url )
	{
		if( this.playingSounds.hasOwnProperty( url ) ) {
			for( var i in this.playingSounds[ url ] )
			{
				if( this.playingSounds[ url ].hasOwnProperty( i ) )
				{
					this.playingSounds[ url ][ i ].noteOff( 0 );
				}
			}
		}
	}
};

var WebAudioAPISound = function( url, options )
{
	this.settings = {
		loop: false,
		volume: 1
	};
	for( var i in options )
	{
		if( options.hasOwnProperty( i ) )
		{
			this.settings[ i ] = options[ i ];
		}
	}
	var audio = document.createElement( 'audio' );
	if( audio.canPlayType( 'audio/ogg;' ) )
	{
		this.url = url + '.ogg';
	} else {
		this.url = url + '.aac';
	}
	window.webAudioAPISoundManager = window.webAudioAPISoundManager || new WebAudioAPISoundManager( window.audioContext );
	this.manager = window.webAudioAPISoundManager;
	this.manager.addSound( this.url );
};
WebAudioAPISound.prototype = {
	play: function( vol ) {
		var buffer = this.manager.bufferList[ this.url ];
		if( typeof buffer !== "undefined" )
		{
			var source = this.makeSource( buffer, vol );
			source.loop = this.settings.loop;
			source.start( 0 );

			if( !this.manager.playingSounds.hasOwnProperty( this.url ) )
			{
				this.manager.playingSounds[ this.url ] = [];
			}
			this.manager.playingSounds[ this.url ].push( source );
		}
	},
	stop: function() {
		this.manager.stopSoundWithURL( this.url );
	},
	getVolume: function() {
		// return this.translateVolume( this.settings.volume, true );
		return this.settings.volume;
	},
	setVolume: function( volume )
	{
		// this.settings.volume = this.translateVolume( volume );
		this.settings.volume = volume;
	},
	translateVolume: function( volume, inverse ) {
		return inverse ? volume * 100 : volume / 100;
	},
	makeSource: function( buffer, vol ) {
		var source = this.manager.context.createBufferSource();
		var gainNode = this.manager.context.createGain();
		source.buffer = buffer;
		source.connect( gainNode );
		gainNode.connect( this.manager.context.destination );
		gainNode.gain.value = this.settings.volume;

		if( vol !== undefined )
			gainNode.gain.value = vol;

		return source;
	}
};

export default WebAudioAPISound;
