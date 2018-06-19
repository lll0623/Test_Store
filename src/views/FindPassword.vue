<template>
<div class="findPassWordBackground" ref='loginBox'>
	<!-- 第一个card -->
	<el-card class="box-card" v-show="card1" style="height:230px">
    <div slot="header" class="clearfix">
      <span style="font-size:28px">找回密码</span>
	  <el-progress :percentage="33.33" :show-text="false" class="marT30"></el-progress>
    </div>
    <el-form :model="oneForm" label-position="right" :rules="oneRules" ref="oneForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="手机号码：" prop="inputTel">
        <el-input type="text" v-model="oneForm.inputTel" placeholder="请输入注册过的手机号" auto-complete="off"></el-input>
      </el-form-item>

      <el-button class="nextBtn" @click="submitForm('oneForm')">下一步</el-button>
    </el-form>
  </el-card>

	<!-- 第二个card -->
	<el-card class="box-card" v-show="card2">
		<div slot="header" class="clearfix">
	      <span style="font-size:28px">找回密码</span>
		  <el-progress :percentage="66.66" :show-text="false" class="marT30"></el-progress>
	    </div>
		<el-form :model="twoForm" label-position="right" :rules="twoRules" ref="twoForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="手机验证码：" prop="ValidateCode">
				<el-input style="width:125px;" type="text" placeholder="请输入短信验证码" v-model="twoForm.ValidateCode" auto-complete="off"></el-input>
				<el-button style="margin-left:20px;" :disabled="disabled" @click="sendcode">{{ getBtnTxt }}</el-button>
			</el-form-item>
			<el-button class="nextBtn tc" @click="submitForm2('twoForm')">提交</el-button>
		</el-form>

	</el-card>

	<!-- 通过手机号修改成功 -->
	<el-card class="box-card" v-show="card3">
		<div slot="header" class="clearfix">
	      <span style="font-size:28px">找回密码</span>
		  <el-progress :percentage="100" :show-text="false" class="marT30"></el-progress>
	    </div>
		<el-form :model="threeForm" label-position="right" :rules="threeRules" ref="threeForm" label-width="120px" class="demo-ruleForm">
			<el-form-item label="新密码：" prop="Password">
				<el-input :type="this.ispassword" placeholder="请输入新密码" v-model="threeForm.Password" auto-complete="off"></el-input>
				<i :class="fa_eyes" aria-hidden="true" @click="changeType()" class="open_close"></i>
			</el-form-item>
			<el-form-item label="确定密码：" prop="confirm_pass">
				<el-input :type="this.ispassword2" placeholder="请确认新密码" v-model="threeForm.confirm_pass" auto-complete="off"></el-input>
				<i :class="fa_eyes2" aria-hidden="true" @click="changeType2()" class="open_close"></i>
			</el-form-item>
			<el-button class="nextBtn tc" @click="submitForm3('threeForm')">确认修改</el-button>
		</el-form>
	</el-card>
	<el-card class="box-card" v-show="card4">
		<div style="font-size:28px;margin: 20px 0px 15px 0;">手机验证找回密码成功！！！</div>
		<router-link :to="`/login`">
			<el-button class="linkBtn" style="float:left;margin-bottom:30px;" type="text">点这里返回登录页面>>></el-button>
		</router-link>
	</el-card>
</div>
</template>

<script>
import { getSMSHelper,getFindPassword,getIsExistPhone } from '../api/api.js'
import md5 from 'js-md5';
var codeFindPassword; //在全局定义验证码
export default {
	data() {
		var validatePhoneNum = (rule, value, callback) => {
			let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
			if (value === '') {
				callback(new Error('手机号码不能为空'));
			} else if (!reg.test(value)) {
				callback(new Error('请输入正确的手机号码'));
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
			} else if (value !== this.threeForm.Password) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		};
		var validateValidateCode = (rule, value, callback) => {
			let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
			if (value === '') {
				callback(new Error('手机验证码不能为空'));
			} else if (md5(value) != this.SMCode_phone) {
				callback(new Error('短信验证码不正确'));
			} else {
				callback();
			}
		};
		return {
			card1: true,
			card2: false,
			card3: false,
			card4: false,
			activeName: 'first',
			checkCode: '', //验证码value值
			disabled: false,
			time: 0,
			getBtnTxt: "免费获取验证码",
			SMCode_phone: '', //短信接口返回的验证码
			ispassword: "password",
			fa_eyes: 'fa fa-eye-slash',
			ispassword2: "password",
			fa_eyes2: 'fa fa-eye-slash',
			oneForm: {
				inputTel: ''
			},
			oneRules: {
				inputTel: [{
					validator: validatePhoneNum,
					trigger: 'blur'
				}]
			},
			twoForm: {
				ValidateCode: ''
			},
			twoRules: {
				// ValidateCode: [{
				// 	validator: validateValidateCode,
				// 	trigger: 'blur'
				// }]
			},
			threeForm: {
				Password: '',
				confirm_pass: ''
			},
			threeRules: {
				Password: [{
					validator: validatePassword,
					trigger: 'blur'
				}],
				confirm_pass: [{
					validator: validateConfirm_pass,
					trigger: 'blur'
				}]
			}
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
		handleClick(tab, event) {
		},
		// 图片验证码
		createCode() {
			codeFindPassword = "";
			var codeLength = 4; //验证码的长度
			var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
				'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
			for (var i = 0; i < codeLength; i++) { //循环操作
				var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
				codeFindPassword += random[index]; //根据索引取得随机数加到code上
			}
			this.checkCode = codeFindPassword; //把code值赋给验证码
		},
		sendcode() {
			let params = {
				Type: 2, //找回密码
				PhoneNum: this.oneForm.inputTel
			}
			console.log(params)
			getSMSHelper(params).then((response) => {
				console.log(response.Data)
				var errorText = response.Info;
				switch (response.StatusCode) {
					case 200:
						this.$message({
							type: 'success',
							message: '短信验证码发送成功，请注意查收！'
						});
						this.SMCode_phone = response.Data.RegisterCode.toLowerCase();
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
						this.getBtnTxt = "免费获取验证码";
						this.disabled = false;
						break;
					default:
						this.$message({
							type: 'error',
							message: '短信验证码发送失败！'
						});
						this.time = 0;
						this.getBtnTxt = "免费获取验证码";
						this.disabled = false;
				}
			})
		},
		timer() {
			if (this.time > 0) {
				this.time--;
				this.getBtnTxt = this.time + "s后重新获取";
				setTimeout(this.timer, 1000);
			} else {
				this.time = 0;
				this.getBtnTxt = "免费获取验证码";
				this.disabled = false;
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
		submitForm(formName) {
		    this.$refs[formName].validate((valid) => {
			    if (valid) {
					let params = {
						PhoneNum: this.oneForm.inputTel
					}
					getIsExistPhone(params).then((response) => {
						var errorText = response.Info;
						switch (response.StatusCode) {
							case 200:
								this.card1 = false;
								this.card2 = true;
								break;
							case 500:
								this.$message({
									type: 'error',
									message: errorText
								});
								break;
							default:
								this.$message({
									type: 'error',
									message: errorText
								});
								break;

						}
					})
			    } else {
			        return false;
			    }
		    });
		},
		submitForm2(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
	  		      	this.card2 = false;
					this.card3 = true;
				} else {
					return false;
				}
			});
		},
		submitForm3(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let params = {
						Type: 1,
						PhoneNum: this.oneForm.inputTel,
						Password: md5(this.threeForm.Password)
					}
					getFindPassword(params).then((response) => {
						var errorText = response.Info;
						switch (response.StatusCode) {
							case 200:
								this.card3 = false;
								this.card4 = true;
								break;
							case 500:
								this.$message({
									type: 'error',
									message: errorText
								});
								break;
							default:
								this.$message({
									type: 'error',
									message: errorText
								});
								break;

						}
					})
				} else {
					return false;
				}
			});
		},
	},
	mounted() {
		this.$refs.loginBox.style.minHeight = (document.documentElement.clientHeight - document.getElementById('header').offsetHeight) + 'px'
	},
	created() {
		this.createCode();
	}
}
</script>

<style lang="scss">
.el-tabs__item.is-active {
    color: #bb0068 !important;
}
.el-tabs__item:hover {
    color: #bb0068 !important;
    cursor: pointer;
}
.el-tabs__active-bar {
    background-color: white;
}
.el-tabs__nav-wrap::after {
    height: 0;
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
.code {
    font-size: 18px;
    letter-spacing: 3px;
    color: #053d84;
    background: #f2f2f5 !important;
    margin-left: 30px;
    line-height: 37px;
    height: 40px;
    margin-top: -3px;
    width: 100px;
    border-radius: 3px;
}
.nextBtn {
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
.findPassWordBackground {
    display: flex;
    background:url("../assets/images/login.jpg") no-repeat center;
    background-repeat: no-repeat;
    background-size: cover;
	.box-card {
	    width: 480px;
	    margin: 160px auto;
	    display: inline-table;
		border: none !important;
	}
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
</style>
