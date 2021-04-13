
const ErrorCodes = {
	CodeError : 1,
	IntegerError : 2,
	DateError : 3,
	CoordsError : 4,
	PercentileError : 5,
	SeasonError : 6,
	SubplotError : 7,
	SubsampleError : 8,
	TexturalClassError : 9,
	SenTimestampError : 10,
	SenCodeError : 11,
	SenRepIDError : 12,
	SenTreatError : 13,
	SenVoltError : 14,
	SenTempError : 15,
	SenHumError : 16,
	SenAddrError : 17,
	SenWCError : 18,
	SenIntError : 19,
	SenDepthError : 20
}


function CustomError(message) {
    this.type = 'custom';
    this.message = message || '';
    var error = new Error(this.message);
    error.type = this.name;
    this.stack = error.stack;
  }
  CustomError.prototype = Object.create(Error.prototype);
  
  module.exports = CustomError;