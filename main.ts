/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd
 */
//% color=#0fbc11 weight=10 icon="\uf1b9"
//% block="MotorBitPro"
namespace MotorBitPro {
    const MotorBitProAdd = 0x08
    let _initEvents = true

    export enum MotorPos {
        //% block="M1"
        M1 = 0,
        //% block="M2"
        M2 = 1
    }

    export enum ServoList {
        //% block="S1"
        S1 = 1,
        //% block="S2"
        S2 = 2,
        //% block="S3"
        S3 = 3,
        //% block="S4"
        S4 = 4
    }


    /**
    * Set the steering gear to 180 or 360
    */
    export enum ServoTypeList {
        //% block="180°"
        S180 = 0,
        //% block="360°"
        S360 = 1
    }


    /******************************************************************************************************
     * 工具函数
     ******************************************************************************************************/
    function i2c_command_send(command: number, params: number[]) {
        let buff = pins.createBuffer(params.length + 4);
        buff[0] = 0xFF; // 帧头
        buff[1] = 0xF9; // 帧头
        buff[2] = command; // 指令
        buff[3] = params.length; // 参数长度
        for (let i = 0; i < params.length; i++) {
            buff[i + 4] = params[i];
        }
        pins.i2cWriteBuffer(MotorBitProAdd, buff);
    }

    function initEvents(): void {
        if (_initEvents) {
            pins.setEvents(DigitalPin.P13, PinEventType.Edge);
            pins.setEvents(DigitalPin.P14, PinEventType.Edge);
            _initEvents = false;
        }
    }



    /******************************************************************************************************
     * 积木块定义
     ******************************************************************************************************/


    /**
    * Setting the direction and speed of travel.
    * @param direc Left wheel speed , eg: DriveDirection.Forward
    * @param speed Travel time, eg: 100
    */
    //% weight=90
    //% group="Basic functions"
    //% block="Go %direc at speed %speed\\%"
    //% speed.min=-100 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelSpeed(motorPos: MotorPos, speed: number): void {
        let direction: number = 0;
        if (speed < 0) {
            direction |= 0x01;
        }
        speed = Math.min(Math.abs(speed), 100);
        i2c_command_send(0x10, [speed, direction]);
    }


    /**
     * Set the angle of servo. 
     * @param servo ServoList, eg: ServoList.S1
     * @param angle angle of servo, eg: 0
     */
    //% weight=15
    //% group="Basic functions"
    //% block="Set %ServoTypeList servo %servo angle to %angle °"
    export function setServo(servoType: ServoTypeList, servo: ServoList, angle: number = 0): void {
        switch (servoType) {
            case ServoTypeList.S180:
                angle = Math.map(angle, 0, 180, 0, 180)
                break
            case ServoTypeList.S360:
                angle = Math.map(angle, 0, 360, 0, 180)
                break
        }
        i2c_command_send(0x20, [servo, angle]);
    }

    /**
* Set the speed of servo.
* @param servo ServoList, eg: ServoList.S1
* @param speed speed of servo, eg: 100
*/
    //% weight=14
    //% group="Basic functions"
    //% block="Set 360° servo %servo speed to %speed \\%"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.columns=1
    //% speed.min=-100 speed.max=100
    export function setServo360(servo: ServoList, speed: number = 100): void {
        speed = Math.map(speed, -100, 100, 0, 180);
        i2c_command_send(0x20, [servo, speed]);
    }
}
