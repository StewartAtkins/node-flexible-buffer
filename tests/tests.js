var buffer = require("../");

//This is not an exhaustive suite of tests but will verify the partial operation.

exports.testSomething = function(test){
	test.expect(2);

	var buf = new buffer();
	buf.writeUint8(0xFF);
	buf.writeUint8(0xFE);
	buf.writeUint8(0xFD);
	buf.writeUint8(0x01);

	var actualBuf = buf.getBuffer(true);
	test.equals(actualBuf.readUInt32LE(0), 0x01FDFEFF, "Buffer Write resulted in incorrect data");
	test.equals(buf.readUint32(), 0x01FDFEFF, "Buffer read resulted in incorrect data");

	test.done();
}