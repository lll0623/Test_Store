<template>
<div class="loginBackground" @keyup.enter="submitForm('ruleForm')" ref='loginBox' id="loginhEAD" style="position:relative;top:0px;">
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span style="font-size:28px">登录</span>
			<router-link :to="`/register`">
				<el-button class="linkBtn" type="text">注册账户</el-button>
			</router-link>
		</div>
		<el-form :model="ruleForm" label-position="right" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
			<el-form-item label="手机号码：" prop="Account">
				<el-input type="text" placeholder="请输入用户名或手机号" v-model="ruleForm.Account" auto-complete="off" @keyup.enter.native="submitForm('ruleForm')"></el-input>
			</el-form-item>
			<el-form-item label="密码：" prop="Password">
				<el-input :type="this.ispassword" placeholder="请输入密码" v-model="ruleForm.Password" auto-complete="off" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				<i :class="fa_eyes" aria-hidden="true" @keyup.enter.native="submitForm('ruleForm')" @click="changeType()" class="open_close"></i>
			</el-form-item>
			<el-form-item label="验证码：" prop="VerifyCode" class="clearfix">
				<el-input style="width:190px;" type="text" placeholder="请输入验证码" class="yanzhengma_input" v-model="ruleForm.VerifyCode" auto-complete="off"></el-input>
				<input type="button" id="code" @click="createCode" class="verification fr" v-model="checkCode" />
			</el-form-item>
			<el-form-item>
				<router-link :to="`/findPassword`">
					<el-button class="linkBtn" type="text">忘记密码</el-button>
				</router-link>
			</el-form-item>

			<el-button class="loginBtn" @click="submitForm('ruleForm')" :loading="btnLoading">登录</el-button>
		</el-form>
	</el-card>
</div>
</template>
<script type="es6">
import {
	mapGetters
} from 'vuex'
import {
	getLogin
} from '../api/api.js'
import md5 from 'js-md5';
import { setCookie } from '../util/index.js'

var code; //在全局定义验证码
export default {
	data() {
		var validatePassword = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				callback();
			}
		};
		var validateAccount = (rule, value, callback) => {
			let regPhoneNum = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
			let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (value === '') {
				callback(new Error('请输入用户名'));
			} else if (!regPhoneNum.test(value) && !regEmail.test(value)) {
				callback(new Error('请输入正确格式的邮箱或手机号'));
			} else {
				callback();
			}
		};
		var validateVerifyCode = (rule, value, callback) => {
			value.toUpperCase(); //取得输入的验证码并转化为大写
			if (value === '') {
				callback(new Error('请输入验证码'));
			} else if (value.toUpperCase() != this.checkCode) { //若输入的验证码与产生的验证码不一致时
				callback(new Error('验证码不正确'));
				this.isD = false;
				this.createCode(); //刷新验证码
			} else {
				callback();
			}
		};
		return {
			btnLoading: false,
			ruleForm: {
				Password: '',
				Account: '',
				VerifyCode: ''
			},
			rules: {
				Password: [{
					validator: validatePassword,
					trigger: 'blur'
				}],
				Account: [{
					validator: validateAccount,
					trigger: 'blur'
				}],
				VerifyCode: [{
					validator: validateVerifyCode,
					trigger: 'blur'
				}]
			},
			checkCode: '',
			ispassword: "password",
			fa_eyes: 'fa fa-eye-slash'
		};
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.$store.commit('SET_HEADTOGGLE', 1)
		})
	},
	beforeRouteLeave(to, from, next) {
		this.$store.commit('SET_HEADTOGGLE', 0)
		next()
	},
	mounted() {
		this.$refs.loginBox.style.minHeight = (document.documentElement.clientHeight - document.getElementById('header').offsetHeight) + 60+'px'
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let dataArry = {
						Account: this.ruleForm.Account,
						// Password: this.ruleForm.Password,
						Password: md5(this.ruleForm.Password),
						VerifyCode: this.ruleForm.VerifyCode
					}
					this.btnLoading = true

					getLogin(dataArry).then((response) => {
						switch (response.StatusCode) {
							case 200:
								this.$message({
									type: 'success',
									message: '登录成功！'
								});
								console.log(response.Data)
								setCookie('userInfo',JSON.stringify(response.Data))
								this.$store.commit('SET_USERINFO', response.Data);
								this.$router.push({path:'/'})
								break;
							case 500:
								this.$message({
									type: 'error',
									message: response.Info
								});
								break;
							default:
								this.$message({
									type: 'error',
									message: '登录失败！'
								});
						}
						this.btnLoading = false
					})

				} else {
					return false;
				}
			});
		},
		// 图片验证码
		createCode() {
			code = "";
			var codeLength = 4; //验证码的长度
			var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
				'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
			for (var i = 0; i < codeLength; i++) { //循环操作
				var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
				code += random[index]; //根据索引取得随机数加到code上
			}
			this.checkCode = code; //把code值赋给验证码
		},
		changeType() {
			this.ispassword = this.ispassword === 'password' ? 'text' : 'password';
			this.fa_eyes = this.fa_eyes == "fa fa-eye-slash" ? "fa fa-eye" : "fa fa-eye-slash"; //密码的显示和隐藏 眼睛图标
		}
	},
	created() {
		this.createCode();
	}
}
</script>
<style lang="scss">
#loginhEAD {
    .el-dialog__header {
        background: white !important;
    }
	.box-card {
	    width: 500px !important;
		display: inline-table;
	    margin: 160px auto 0;
	}
}
.yanzhengma_input {
    width: 190px;
}
.disappear {
    visibility: hidden;
}
.verification {
    vertical-align: middle;
    transform: translate(-15px,0);
    width: 102px;
}
#code {
    font-size: 18px;
    letter-spacing: 3px;
    color: #053d84;
    background: #f2f2f5;
    margin-left: 30px;
    line-height: 37px;
    height: 40px;

    width: 100px;
    border-radius: 3px;
}
.linkBtn {
    float: right;
    padding: 3px 0;
    color: #bb0068 !important;
    &:hover {
        text-decoration: underline;
        color: #bb0068;
    }
}
.loginBtn {
    background: #bb0068 !important;
    border-color: #bb0068 !important;
    color: white !important;
    width: 100%;
    &:hover {
        background: #e4007f !important;
        border-color: #e4007f !important;
        color: white !important;
    }
}
.open_close {
    position: absolute;
    right: -3px;
    top: 9px;
    width: 30px;
    height: 20px;
    cursor: pointer;
    font-size: 20px;
    color: #bb0068;
}
.loginBackground {
    display: flex;
    background: url("../assets/images/login.jpg") no-repeat center;
	background-size:cover;
}
.qrcode-img {
    height: auto;
    background: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: #3988ed !important;
}
.qrcode {
    margin: -30px 0 0;
    text-align: center;
}
.qrcode-img p {
    margin-bottom: 10px;
    color: #3988ed !important;
}
.qrcode-img > img {
    width: 160px;
    height: 160px;
    margin-left: auto;
    margin-right: auto;
    display: block;
}
.qrcode-content {
    width: 240px;
    height: auto;
    background: #3988ed;
    color: #fff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding: 30px 30px 20px;
    margin-left: -25px;
}
.qrcode-content .mb20 {
    margin-bottom: 20px;
}
.qrcode-content h3 {
    font-size: 18px;
    margin-top: 0;
    text-align: left;
}
.qrcode-content p {
    margin-left: 30px;
    color: white;
    font-size: 15px;
    margin-top: 7px;
    text-align: left;
}
.qrcode-content h3 > span {
    margin-right: 10px;
}
.qrcode-content h3 > span > img {
    width: 20px;
    height: 20px;
}
.wapper {
    padding-bottom: 0!important;
}
</style>
