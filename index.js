var self;
self = module.exports = exports = {};

var DEFAULT_BUFFER_SIZE = 200;

self = function(buffer){
	this.rpos = 0;
	this.wpos = 0;
	
	if(typeof(buffer) == "undefined")
		buffer = DEFAULT_BUFFER_SIZE;
	
	if(buffer instanceof Buffer){
		this.buffer = buffer;
		this.wpos = buffer.length;
	}else{
		this.buffer = new Buffer(buffer);
	}
	this.endian = this.LITTLE_ENDIAN;
	
	
};

var tryRead = function(buf, numBytes){
	if((buf.rpos + numBytes) > buf.buffer.length)
		throw new Error("Flexible-Buffer: Tried to read past end of buffer");
	buf.rpos += numBytes;
};

var tryWrite = function(buf, numBytes){
	if((buf.wpos + numBytes) > buf.buffer.length){
		//consider extending the buffer?
		var bufLen = buf.buffer.length;
		while(bufLen < (buf.wpos + numBytes))
			bufLen *= 2;
		var buffer2 = new Buffer(bufLen);
		buf.buffer.copy(buffer2);
		buf.buffer = buffer2;
		//throw new selfException("Tried to write past end of buffer");
	}
	buf.wpos += numBytes;
};

self.prototype.BIG_ENDIAN = 1;
self.prototype.LITTLE_ENDIAN = 2;


//getBuffer(packBuffer)
//	returns the underlying buffer object
//	if packBuffer is truthy then return a 'view' on the buffer up to wpos
self.prototype.getBuffer = function(packBuffer){
	if(packBuffer)
		return this.buffer.slice(0, this.wpos);
	else
		return this.buffer;
};


/**************** DATA READING FUNCTIONS *****************/

self.prototype.readUint8 = function(){
	var readPos = this.rpos;
	tryRead(this, 1);
	return this.buffer.readUInt8(readPos);
};

self.prototype.readInt8 = function(){
	var readPos = this.rpos;
	tryRead(this, 1);
	return this.buffer.readInt8(readPos);
};

self.prototype.readUint16 = function(){
	var readPos = this.rpos;
	tryRead(this, 2);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readUInt16LE(readPos);
	else
		return this.buffer.readUInt16BE(readPos);
};

self.prototype.readInt16 = function(){
	var readPos = this.rpos;
	tryRead(this, 2);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readInt16LE(readPos);
	else
		return this.buffer.readInt16BE(readPos);
};

self.prototype.readUint32 = function(){
	var readPos = this.rpos;
	tryRead(this, 4);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readUInt32LE(readPos);
	else
		return this.buffer.readUInt32BE(readPos);
};

self.prototype.readInt32 = function(){
	var readPos = this.rpos;
	tryRead(this, 4);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readInt32LE(readPos);
	else
		return this.buffer.readInt32BE(readPos);
};

self.prototype.readUint64 = function(){
	var readPos = this.rpos;
	tryRead(this, 8);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readUInt64LE(readPos);
	else
		return this.buffer.readUInt64BE(readPos);
};

self.prototype.readInt64 = function(){
	var readPos = this.rpos;
	tryRead(this, 8);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readInt64LE(readPos);
	else
		return this.buffer.readInt64BE(readPos);
};

self.prototype.readFloat = function(){
	var readPos = this.rpos;
	tryRead(this, 4);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readFloatLE(readPos);
	else
		return this.buffer.readFloatBE(readPos);
};

self.prototype.readDouble = function(){
	var readPos = this.rpos;
	tryRead(this, 8);
	if(this.endian == this.LITTLE_ENDIAN)
		return this.buffer.readDoubleLE(readPos);
	else
		return this.buffer.readDoubleBE(readPos);
};


//String FriendlyBuffer::readString([strLength])
//	strLength is an optional argument specifying the length of the string in bytes (NOT characters)
//	if it is omiitted then the string is assumed to be null terminated
self.prototype.readString = function(strLength){
	var readLen = -1;;
	if(typeof(strLength) != "undefined")
		readLen = parseInt(strLength);
	var strEnd = this.rpos;
	var readPos = this.rpos;
	
	if(readLen == -1){
		while(strEnd <= this.buffer.length && this.buffer[strEnd] != 0)
			strEnd++;
		readLen = (strEnd + 1) - readPos;
	}else{
		strEnd = readPos + readLen;
	}
	tryRead(this, readLen);
	return this.buffer.toString("utf8",readPos,strEnd);
};



/**************** DATA WRITING FUNCTIONS *****************/


self.prototype.writeUint8 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 1);
	this.buffer.writeUInt8(val, writePos);
};

self.prototype.writeInt8 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 1);
	this.buffer.writeInt8(val, writePos);
};

self.prototype.writeUint16 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 2);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeUInt16LE(val, writePos);
	else
		this.buffer.writeUInt16BE(val, writePos);
};

self.prototype.writeInt16 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 2);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeInt16LE(val, writePos);
	else
		this.buffer.writeInt16BE(val, writePos);
};

self.prototype.writeUint32 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 4);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeUInt32LE(val, writePos);
	else
		this.buffer.writeUInt32BE(val, writePos);
};

self.prototype.writeInt32 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 4);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeInt32LE(val, writePos);
	else
		this.buffer.writeInt32BE(val, writePos);
};

self.prototype.writeUint64 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 8);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeUInt64LE(val, writePos);
	else
		this.buffer.writeUInt64BE(val, writePos);
};

self.prototype.writeInt64 = function(val){
	var writePos = this.wpos;
	tryWrite(this, 8);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeInt64LE(val, writePos);
	else
		this.buffer.writeInt64BE(val, writePos);
};

self.prototype.writeFloat = function(val){
	var writePos = this.wpos;
	tryWrite(this, 4);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeFloatLE(val, writePos);
	else
		this.buffer.writeFloatBE(val, writePos);
};

self.prototype.writeDouble = function(val){
	var writePos = this.wpos;
	tryWrite(this, 8);
	if(this.endian == this.LITTLE_ENDIAN)
		this.buffer.writeDoubleLE(val, writePos);
	else
		this.buffer.writeDoubleBE(val, writePos);
};

//writeString(str)
//	writes an unterminated string to the buffer
//	use when writing a size-prefixed string (does not write the size-prefix for you though)
//	returns number of bytes written
self.prototype.writeString = function(str){
	var writePos = this.wpos;
	tryWrite(this, Buffer.byteLength(str));
	return this.buffer.write(str, writePos);
};


//writeNTString(str)
//	writes a null-terminated string to the buffer
self.prototype.writeNTString = function(str){
	return this.writeString(str + "\0");
};

/*
self.prototype. = function(){
	
};
*/