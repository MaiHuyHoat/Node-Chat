class CallLog {
    constructor(callLogID, callerID, receiverID, startTime, endTime, duration, callType) {
      this.callLogID = callLogID;
      this.callerID = callerID;
      this.receiverID = receiverID;
      this.startTime = startTime;
      this.endTime = endTime;
      this.duration = duration;
      this.callType = callType;
    }
  }
//   const callLog1 = new CallLog(
//     "call1",
//     "user123",
//     "user456",
//     new Date(),
//     new Date(),
//     "5 minutes",
//     "voice"
//   );
module.exports= CallLog;
  