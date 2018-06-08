<template>
<div class="registerBackground" ref='loginBox'>
	<el-card class="box-card" v-show="card1">
		<div slot="header" class="clearfix">
			<span style="font-size:28px">注册账号</span>
			<router-link :to="`/login`">
				<el-button class="linkBtn" type="text">已有账号，立即登录</el-button>
			</router-link>
		</div>
		<el-form :model="registerForm" label-position="right" :rules="rules" ref="registerForm" label-width="120px" class="demo-registerForm">
			<el-form-item label="手机号码：" prop="PhoneNum">
				<el-input type="text" v-model="registerForm.PhoneNum" auto-complete="off" placeholder="请输入您的手机号码"></el-input>
			</el-form-item>
			<el-form-item label="手机验证码：" prop="ValidateCode">
				<el-input style="width:120px;" type="text" v-model="registerForm.ValidateCode" auto-complete="off" placeholder="请输入验证码"></el-input>
				<el-button style="margin-left:20px;" :disabled="disabled" @click="sendcode">{{ getBtnTxt }}</el-button>
			</el-form-item>
			<el-button class="loginBtn" @click="submitForm('registerForm')">下一步</el-button>
		</el-form>
	</el-card>
	<el-card class="box-card" v-show="card2">
		<div slot="header" class="clearfix">
			<span style="font-size:28px">注册账号</span>
		</div>
		<el-form :model="registerForm2" label-position="right" :rules="rules2" ref="registerForm2" label-width="120px" class="demo-registerForm">
			<el-form-item label="真实姓名：" prop="RealName">
				<el-input type="text" v-model="registerForm2.RealName" auto-complete="off" placeholder="请输入您的真实姓名"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="Email">
				<el-input type="text" v-model="registerForm2.Email" auto-complete="off" placeholder="请输您的邮箱"></el-input>
			</el-form-item>
			<el-form-item label="密码：" prop="Password">
				<el-input :type="this.ispassword" v-model="registerForm2.Password" auto-complete="off" placeholder="请输入您的密码"></el-input>
				<i :class="fa_eyes" aria-hidden="true" @click="changeType()" class="open_close"></i>
			</el-form-item>
			<el-form-item label="确定密码：" prop="confirm_pass">
				<el-input :type="this.ispassword2" v-model="registerForm2.confirm_pass" auto-complete="off" placeholder="请确认密码"></el-input>
				<i :class="fa_eyes2" aria-hidden="true" @click="changeType2()" class="open_close"></i>
			</el-form-item>
			<el-form-item prop="agree" label-width="40px">
				<el-checkbox v-model="registerForm2.type" label="agree" @change="handType()">
					我已经阅读并同意
					<router-link :to="`/terms`">
						<el-button class="linkBtn" type="text">《公租房注册用户条款与声明》</el-button>
					</router-link>
				</el-checkbox>
				<div class="tishixiaoxi" v-show="this.showCheckbox">请接受我们的声明</div>
			</el-form-item>

			<el-button class="loginBtn" @click="submitForm2('registerForm2')">注册</el-button>
		</el-form>
	</el-card>

</div>
</template>

<script>
import { getRegister,getSMSHelper } from '../api/api.js'
import md5 from 'js-md5';
var code; //在全局定义验证码
export default {
	layout: 'nolayout',
	data() {
		var validateRealName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('真实姓名不能为空'));
			} else {
				callback();
			}
		};
		var validatePhoneNum = (rule, value, callback) => {
			let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
			if (value === '') {
				callback(new Error('手机号码不能为空'));
			} else if (!reg.test(value)) {
				callback(new Error('请输入正确的手机号码'));
			} else if (this.sidePhone!= ''&& value!= this.sidePhone) {
				callback(new Error('请输入正确的手机号码'));
			} else {
				callback();
			}
		};
		var validateValidateCode = (rule, value, callback) => {
			let PhoneNum = this.registerForm.PhoneNum
			let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
			if (value === '') {
				callback(new Error('手机验证码不能为空'));
			} else if (!reg.test(PhoneNum)) {
				callback(new Error('请输入正确的手机号码'));
			} else if(md5(value) !== this.SMCode){
				callback(new Error('短信验证码不正确'));
			}else {
				callback();
			}
		};
		var validateEmail = (rule, value, callback) => {
			let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (value !== '') {
				if (!reg.test(value)) {
					callback(new Error('请输入正确格式的邮箱'));
				} else {
					callback();
				}
			} else {
				callback();
			}
		};
		var validatePassword = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value.length < 6) {
			callback(new Error("密码长度必须大于六位！"));
			} else {
				callback();
			}
		};
		var validateConfirm_pass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入确认密码'));
			} else if (value !== this.registerForm2.Password) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		};
		return {
			card1: true,
			card2: false,
			disabled: false,
			time: 0,
			getBtnTxt: "免费获取验证码",
			SMCode:'',//短信接口返回的验证码
			checkCode: '',
			ispassword: "password",
			fa_eyes: 'fa fa-eye-slash',
			ispassword2: "password",
			fa_eyes2: 'fa fa-eye-slash',
			sidePhone:'',
			showCheckbox: false,
			registerForm: {
				PhoneNum: '',
				ValidateCode: '',
			},
			rules: {
				PhoneNum: [{
					validator: validatePhoneNum,
					trigger: 'blur'
				}],
				ValidateCode: [{
					validator: validateValidateCode,
					trigger: 'blur'
				}],
			},
			registerForm2: {
				RealName: '',
				Email: '',
				Password: '',
				confirm_pass: '',
				type: []
			},
			rules2: {
				RealName: [{
					validator: validateRealName,
					trigger: 'blur'
				}],
				Email: [{
				  validator: validateEmail,
				  trigger: 'blur'
				}],
				Password: [{
					validator: validatePassword,
					trigger: 'blur'
				}],
				confirm_pass: [{
					validator: validateConfirm_pass,
					trigger: 'blur'
				}]
			},
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
	methods: {
		sendcode() {
			var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
			//var url="/nptOfficialWebsite/apply/sendSms?mobile="+this.registerForm.phone;
			if (this.registerForm.PhoneNum == '') {
				this.$message({
					type: 'error',
					message: '请输入手机号码'
				});
			} else if (!reg.test(this.registerForm.PhoneNum)) {
				this.$message({
					type: 'error',
					message: '手机格式不正确'
				});
			} else {
				let params = {
					Type: 1, //注册类型
					PhoneNum: this.registerForm.PhoneNum
				}
				getSMSHelper(params).then((response) => {
					console.log(response.Data)
					var errorText = response.Info;
					switch (response.StatusCode) {
						case 200:
							this.$message({
								type: 'success',
								message: '短信验证码发送成功，请注意查收！'
							});
							this.SMCode = response.Data.RegisterCode.toLowerCase();
							this.sidePhone = response.Data.PhoneNum;
							this.time = 60;
							this.disabled = true;
							this.timer();
							break;
						case 500:
							this.$message({
								type: 'error',
								message: errorText
							});
							this.time = 0;
							this.getBtnTxt = "获取验证码";
							this.disabled = false;
							break;
						default:
							this.$message({
								type: 'error',
								message: '短信验证码发送失败！'
							});
							this.time = 0;
							this.getBtnTxt = "获取验证码";
							this.disabled = false;
					}
				})
			}
		},
		timer() {
			if (this.time > 0) {
				this.time--;
				this.getBtnTxt = this.time + "s后重新获取";
				setTimeout(this.timer, 1000);
			} else {
				this.time = 0;
				this.getBtnTxt = "获取验证码";
				this.disabled = false;
			}
		},
		submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.card1 = false;
						this.card2 = true;
					} else {
						return false;
					}
				});

		},
		submitForm2(formName) {

			let checkBoxLength = this.registerForm2.type.length;
			if (checkBoxLength < 1) {
				this.showCheckbox = true;
			} else {
				this.$refs[formName].validate((valid) => {
					// console.log(valid);
					if (valid) {
						let dataArry = {
							"RealName": this.registerForm2.RealName,
							"PhoneNum": this.registerForm.PhoneNum,
							"Email": this.registerForm2.Email,
							"Password": md5(this.registerForm2.Password)
						}
                        console.log(dataArry)
						getRegister(dataArry)
							.then((response) => {
								var errorText = response.Info;
								switch (response.StatusCode) {
									case 200:
										this.$message({
											type: 'success',
											message: '注册成功！'
										});
										setTimeout(() => {
											this.$router.push("/login");
										}, 2000)
										break;
									case 500:
										this.$message({
											type: 'error',
											message: errorText
										});
										setTimeout(() => {
											this.$router.push({
												path: `/login`,
											})
										}, 1000)
										break;
									default:
										this.$message({
											type: 'error',
											message: '注册失败！'
										});
										setTimeout(() => {
											this.$router.push({
												path: `/login`,
											})
										}, 1000)
								}
							})
					} else {
						return false;
					}
				});
			}

		},
		changeType() {
			this.ispassword = this.ispassword === 'password' ? 'text' : 'password';
			this.fa_eyes = this.fa_eyes == "fa fa-eye-slash" ? "fa fa-eye" : "fa fa-eye-slash";
		},
		changeType2() {
			this.ispassword2 = this.ispassword2 === 'password' ? 'text' : 'password';
			this.fa_eyes2 = this.fa_eyes2 == "fa fa-eye-slash" ? "fa fa-eye" : "fa fa-eye-slash";
		},
		handType() {
			this.showCheckbox = false;
		}
	},
	mounted() {
		this.$refs.loginBox.style.minHeight = (document.documentElement.clientHeight - document.getElementById('header').offsetHeight) + 'px'
	},
	created() {}
}
</script>

<style lang="scss">
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
    margin-top: -3px;
    width: 100px;
    border-radius: 3px;
}
.linkBtn {
    float: right;
    padding: 3px 0;
    color: #009688 !important;
    &:hover {
        text-decoration: underline;
        color: #009688;
    }
}
.loginBtn {
    background: #009688 !important;
    border-color: #009688 !important;
    color: white !important;
    width: 100%;
    &:hover {
        background: #18ab9d !important;
        border-color: #18ab9d !important;
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
    color: #009688;
}
.tishixiaoxi {
    margin-top: -7px;
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    position: absolute;
    top: 100%;
    left: 0;
    font-weight: 500;
}
.registerBackground {
    display: flex;
    background: url("http://tstres.lesoft.cn/menber/contents/images/userbg.jpg");
	background-repeat: no-repeat;
    background-size: cover;
	.box-card {
	    width: 500px !important;
		display: inline-table;
	    margin: 60px auto;
	}
}
</style>
