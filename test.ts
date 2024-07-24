// When button A is pressed
input.onButtonPressed(Button.A, function () {
    // Set the travel speed of motor M1 to 100 
    MotorBitPro.setTravelSpeed(MotorBitPro.MotorPos.M1, 100);
    // Set the travel speed of motor M2 to 100 
    MotorBitPro.setTravelSpeed(MotorBitPro.MotorPos.M2, 100);

    // Set servo S1 to 0 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S1, 0);
    // Set servo S2 to 0 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S2, 0);
    // Set servo S3 to 0 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S3, 0);
    // Set servo S4 to 0 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S4, 0);
});

// When button B is pressed
input.onButtonPressed(Button.B, function () {
    // Set the travel speed of motor M1 to -100 
    MotorBitPro.setTravelSpeed(MotorBitPro.MotorPos.M1, -100);
    // Set the travel speed of motor M2 to -100
    MotorBitPro.setTravelSpeed(MotorBitPro.MotorPos.M2, -100);

    // Set servo S1 to 180 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S1, 180);
    // Set servo S2 to 180 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S2, 180);
    // Set servo S3 to 180 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S3, 180);
    // Set servo S4 to 180 degrees
    MotorBitPro.setServo(MotorBitPro.ServoTypeList.S180, MotorBitPro.ServoList.S4, 180);
});