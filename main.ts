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
        S1 = 4,
        //% block="S2"
        S2 = 5,
        //% block="S3"
        S3 = 6,
        //% block="S4"
        S4 = 7,
        //% block="S5"
        S5 = 8,
        //% block="S6"
        S6 = 9
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

    /**
    * Unit of Ultrasound Module
    */
    export enum SonarUnit {
        //% block="cm"
        Cm,
        //% block="inch"
        Inch
    }


    /******************************************************************************************************
     * 工具函数
     ******************************************************************************************************/
    function i2cCommandSend(command: number, params: number[]) {
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

    function pwmControl(pwmPin: number, value: number) {
        let pwmHight = (value >> 8) & 0xFF;
        let pwmLow = value & 0xFF;
        i2cCommandSend(0x10, [pwmPin, pwmHight, pwmLow]);
    }

    function setPwmFrequecy(value: number) {
        let frequencyHight = (value >> 8) & 0xFF;
        let requencyLow = value & 0xFF;
        i2cCommandSend(0x00, [frequencyHight, requencyLow]);
    }

    function mapInt(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        if (value <= inMin) return outMin;
        if (value >= inMax) return outMax;
        return Math.floor((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
    }



    /******************************************************************************************************
     * 积木块定义
     ******************************************************************************************************/
    /**
     * 设置电机的方向和速度。
     * @param motorPos 电机位置，例如：MotorPos.M1
     * @param speed 速度，例如：100
     */
    //% weight=90
    //% group="Basic functions"
    //% block="set Motor %motorPos speed as %speed\\%"
    //% speed.min=-100 speed.max=100
    export function setMotorSpeed(motorPos: MotorPos, speed: number): void {
        // 确定电机的方向和速度, 先将反向PWM脚置为0，再根据speed的值来设置反向PWM脚的值
        if (speed > 0) {
            pwmControl(motorPos * 2, 0);
            pwmControl(motorPos * 2 + 1, mapInt(speed, 0, 100, 0, 2000));
        } else {
            pwmControl(motorPos * 2 + 1, 0);
            pwmControl(motorPos * 2, mapInt(speed, 0, 100, 0, 2000));
        }
    }

    /**
     * 停止所有电机
     */
    //% weight=89
    //% group="Basic functions"
    //% block="stop all motor"
    export function stopAllMotor(): void {
        pwmControl(MotorPos.M1 * 2, 0);
        pwmControl(MotorPos.M1 * 2 + 1, 0);
        pwmControl(MotorPos.M2 * 2, 0);
        pwmControl(MotorPos.M2 * 2 + 1, 0);
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
        if (servoType == ServoTypeList.S360) {
            angle *= 0.5;
        }
        angle = 50 + Math.floor(200 / angle);
        pwmControl(servo, angle);
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
        setServo(ServoTypeList.S180, servo, Math.map(speed, -100, 100, 0, 180));
    }


    /**
     * Cars can extend the ultrasonic function to prevent collisions and other functions.. 
     * @param Sonarunit two states of ultrasonic module, eg: Centimeters
     */
    //% blockId=ultrasonic block="HC-SR04 Sonar unit %unit"
    //% weight=35
    export function ultrasonic(unit: SonarUnit, maxCmDistance = 500): number {
        // send pulse
        let pinTrig = DigitalPin.P8;
        let pinEcho = DigitalPin.P12;

        pins.setPull(pinTrig, PinPullMode.PullNone);
        pins.setPull(pinEcho, PinPullMode.PullNone);
        pins.digitalWritePin(pinTrig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pinTrig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(pinTrig, 0);
        let ts = pins.pulseIn(pinEcho, PulseValue.Low, 500)
        if (ts < 0) return unit == SonarUnit.Cm ? 425 : 167; // err
        // read pulse
        ts = pins.pulseIn(pinEcho, PulseValue.High, maxCmDistance * 50);
        if (ts < 0) return unit == SonarUnit.Cm ? 425 : 167; // err

        return unit == SonarUnit.Cm ? Math.floor(ts * 34 / 2 / 1000) : Math.floor(ts * 34 / 2 / 1000 * 0.3937);
    }

}


