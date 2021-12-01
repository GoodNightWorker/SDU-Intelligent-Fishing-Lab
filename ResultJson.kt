package top.yumik.sduintelligentfishinglab.util

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty

@ApiModel(value = "返回Response格式")
sealed class ResultJson {

    companion object {
        fun time(): Long = System.currentTimeMillis()
    }

    @ApiModel(value = "请求成功")
    data class Success(
        @ApiModelProperty(value = "返回数据")
        val data: Map<String, *>? = null,
        val errMsg: String = "Success.",
        val errCode: Int = 0,
        val timestamp: Long = time()
    ) : ResultJson()

    object Empty : ResultJson()

    @ApiModel(value = "请求失败")
    data class Failed(
        @ApiModelProperty(value = "返回状态")
        val errMsg: String,
        @ApiModelProperty(value = "返回状态码")
        val errCode: Int,
        val timestamp: Long = time()
    ) : ResultJson()

    //  xx-0-xx - 登录接口
    data class RegistrationFailed(
        val errMsg: String = "Registration Failed.",
        val errCode: Int = 40001,
        val timestamp: Long = time()
    ) : ResultJson()

    data class InvalidCode(
        val errMsg: String = "Invalid Code.",
        val errCode: Int = 40002,
        val timestamp: Long = time()
    ) : ResultJson()

    data class Logged(
        val errMsg: String = "Logged.",
        val errCode: Int = 40003,
        val timestamp: Long = time()
    ) : ResultJson()

    //  xx-1-xx - Token接口
    data class UnAuthorized(
        val errMsg: String = "UnAuthorized.",
        val errCode: Int = 40101,
        val timestamp: Long = time()
    ) : ResultJson()

    data class TokenNonExistent(
        val errMsg: String = "Token NonExistent.",
        val errCode: Int = 40102,
        val timestamp: Long = time()
    ) : ResultJson()

    //  xx-2-xx - 用户信息接口

    data class PermissionDenied(
        val errMsg: String = "Permission denied.",
        val errCode: Int = 40201,
        val timestamp: Long = time()
    ) : ResultJson()

    data class UserNotFound(
        val errMsg: String = "User Not Found.",
        val errCode: Int = 40202,
        val timestamp: Long = time()
    ) : ResultJson()

    //  xx-3-xx - 上传图片错误
    data class ImageTypeUnsupported(
        val errMsg: String = "Image Type Unsupported.",
        val errCode: Int = 40301,
        val timestamp: Long = time()
    ) : ResultJson()

    data class ImageIsTooLarge(
        val errMsg: String = "Image Is TooLarge.",
        val errCode: Int = 40302,
        val timestamp: Long = time()
    ) : ResultJson()

    data class ImageSaveFailed(
        val errMsg: String = "Image Save Failed.",
        val errCode: Int = 40303,
        val timestamp: Long = time()
    ) : ResultJson()

    data class FaceNotFound(
        val errMsg: String = "Face Not Found.",
        val errCode: Int = 40304,
        val timestamp: Long = time()
    ) : ResultJson()

    data class SecurityProhibitions(
        val errMsg: String = "Security Prohibitions.",
        val errCode: Int = 40305,
        val timestamp: Long = time()
    ) : ResultJson()

    // xx-4-xx - 设备信息接口
    data class DeviceNotFound(
        val errMsg: String = "Device Not Found.",
        val errCode: Int = 40401,
        val timestamp: Long = time()
    ) : ResultJson()

    data class DeviceIsBound(
        val errMsg: String = "Device Is Bound.",
        val errCode: Int = 40402,
        val timestamp: Long = time()
    ) : ResultJson()

    data class DeviceBindFail(
        val errMsg: String = "Device Bind Fail.",
        val errCode: Int = 40403,
        val timestamp: Long = time()
    ) : ResultJson()

    data class DeviceUnbindFail(
        val errMsg: String = "Device Unbind Fail.",
        val errCode: Int = 40404,
        val timestamp: Long = time()
    ) : ResultJson()

    data class DeviceNotBound(
        val errMsg: String = "Device Not Bound.",
        val errCode: Int = 40405,
        val timestamp: Long = time()
    ) : ResultJson()

    data class NotYourDevice(
        val errMsg: String = "Not Your Device.",
        val errCode: Int = 40406,
        val timestamp: Long = time()
    ) : ResultJson()

    data class VersionAbnormal(
        val errMsg: String = "Version Abnormal.",
        val errCode: Int = 40407,
        val timestamp: Long = time()
    ) : ResultJson()

    data class LowerVersionAbnormal(
        val errMsg: String = "Lower Version Abnormal.",
        val errCode: Int = 40407,
        val timestamp: Long = time()
    ) : ResultJson()

    data class NotChanged(
        val errMsg: String = "Not Changed.",
        val errCode: Int = 40408,
        val timestamp: Long = time()
    ) : ResultJson()

    // xx-5-xx - SecretKey数据回调
    data class DataNonExistent(
        val errMsg: String = "Data NonExistent.",
        val errCode: Int = 40501,
        val timestamp: Long = time()
    ) : ResultJson()

    data class NoGuestsAllowed(
        val errMsg: String = "No Guests Allowed.",
        val errCode: Int = 40502,
        val timestamp: Long = time()
    ) : ResultJson()

    // xx-6-xx - 实验室信息接口
    data class LabNotFound(
        val errMsg: String = "Lab Not Found.",
        val errCode: Int = 40601,
        val timestamp: Long = time()
    ) : ResultJson()

    data class NonLabManagement(
        val errMsg: String = "Non-Lab Management.",
        val errCode: Int = 40602,
        val timestamp: Long = time()
    ) : ResultJson()

    //  -xxx - 通用错误类型
    data class DisallowedParameters(
        val errMsg: String = "Disallowed Parameters.",
        val errCode: Int = -2,
        val timestamp: Long = time()
    ) : ResultJson()

    data class SQLException(
        val errMsg: String = "SQL Exception.",
        val errCode: Int = -3,
        val timestamp: Long = time()
    ) : ResultJson()

    data class RedisException(
        val errMsg: String = "Redis Exception.",
        val errCode: Int = -4,
        val timestamp: Long = time()
    ) : ResultJson()

    data class MqttException(
        val errMsg: String = "Mqtt Exception.",
        val errCode: Int = -5,
        val timestamp: Long = time()
    ) : ResultJson()
}