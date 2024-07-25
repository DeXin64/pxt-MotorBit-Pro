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
        S4 = 4,
        //% block="S5"
        S5 = 5,
        //% block="S6"
        S6 = 6
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




    /******************************************************************************************************
     * 积木块定义
     ******************************************************************************************************/
    /**
     * 设置电机的方向和速度。
     * @param motorPos 电机位置，例如：MotorPos.M1
     * @param speed 速度，例如：100
     */
    export function setTravelSpeed(motorPos: MotorPos, speed: number): void {
        // 确定电机的方向和速度
        let absSpeed = Math.abs(speed); // 取绝对值
        absSpeed = mapValue(absSpeed, 0, 100, 0, 1000);
        let absSpeed_16bit = absSpeed; // 此时 absSpeed 已经是在 0-1000 范围内的值
        let absSpeed_H = (absSpeed_16bit >> 8) & 0xFF; // 注意这里使用 >> 而不是 << 来右移
        let absSpeed_L = absSpeed_16bit & 0xFF;
        const direction = speed < 0 ? 0 : 1; // 0 表示反转，1 表示正转

        // 计算电机的偏移量（代表M1A/M1B/M2A/M2B的命令）
        const motorOffset = (motorPos << 1) | direction; // 00:M1正转，01:M1反转，10:M2正转，11:M2反转

        const pin1 = direction ? motorPos : 1 - motorPos; // 根据direction和motorPos计算第一个引脚
        const pin2 = direction ? 1 - motorPos : motorPos; // 根据direction和motorPos计算第二个引脚
        i2c_command_send(0x10, [pin1 * 2, absSpeed_H, absSpeed_L]);
        i2c_command_send(0x10, [pin2 * 2 + 1, 0, 0]);
    }
    function mapValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    // 注释中的错误已修复，指向正确的参数名
    //% weight=90
    //% group="Basic functions"
    //% block="Go %motorPos at speed %speed\\%"
    //% speed.min=-100 speed.max=100
    //% motorPos.fieldEditor="gridpicker" motorPos.fieldOptions.columns=2

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
                angle = Math.map(angle, 0, 180, 0, 1000)
                break
            case ServoTypeList.S360:
                angle = Math.map(angle, 0, 360, 0, 1000)
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
        speed = Math.map(speed, -100, 100, 0, 1000);
        i2c_command_send(0x20, [servo, speed]);
    }
}
