<template>
<section class="container userCenter">
	<el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_nav">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>个人中心</el-breadcrumb-item>
	</el-breadcrumb>
	<div class="main-content">
		<div class="panel-heading">
			<h3 class="title is-2">个人信息</h3>
		</div>
		<div class="panel-body" v-loading="allMessage">
			<el-form :model="PersonalInformation" label-width="120px" ref="SeeRoomListViewForm">
				<el-form-item label="用户姓名：" prop="Name" class="fl50">
					<span class="span">{{ (PersonalInformation.Name == '' || PersonalInformation.Name == null) ? "-" : PersonalInformation.Name }}</span>
				</el-form-item>
				<el-form-item label="身份证号码：" prop="IDCard" class="fl50">
					<span class="span">{{ (PersonalInformation.IDCard == '' || PersonalInformation.IDCard == null) ? "-" : PersonalInformation.IDCard }}</span>
				</el-form-item>
				<el-form-item label="手机号码：" prop="Phone" class="fl50">
					<span class="span">{{ (PersonalInformation.Phone == null || PersonalInformation.Phone == '') ? "-" : PersonalInformation.Phone }}</span>
				</el-form-item>
				<el-form-item label="电子邮箱：" prop="EMail" class="fl50">
					<span class="span">{{ (PersonalInformation.EMail == null || PersonalInformation.EMail == '') ? "-" : PersonalInformation.EMail }}</span>
				</el-form-item>
				<!-- <el-form-item label="性别：" prop="Sex" class="fl50">
					<span v-if="PersonalInformation.Sex == 1" class="span">男</span>
					<span v-else-if="PersonalInformation.Sex == 2" class="span">女</span>
					<span v-else class="span"></span>
				</el-form-item>
				<el-form-item label="名族：" prop="Nation" class="fl50">
					<span class="span">{{ (PersonalInformation.Nation == null || PersonalInformation.Nation == '') ? "-" : PersonalInformation.Nation }}</span>
				</el-form-item> -->
				<!-- <el-form-item label="学历：" prop="Cultural" class="fl50">
					<span v-if="PersonalInformation.Cultural == 0" class="span">博士</span>
					<span v-else-if="PersonalInformation.Cultural == 1" class="span">硕士</span>
					<span v-else-if="PersonalInformation.Cultural == 2" class="span">本科</span>
					<span v-else-if="PersonalInformation.Cultural == 3" class="span">大专、高职</span>
					<span v-else-if="PersonalInformation.Cultural == 4" class="span">高中</span>
					<span v-else-if="PersonalInformation.Cultural == 5" class="span">中专、职校</span>
					<span v-else-if="PersonalInformation.Cultural == 6" class="span">初中</span>
					<span v-else-if="PersonalInformation.Cultural == 7" class="span">小学</span>
					<span v-else class="span">-</span>
				</el-form-item>
				<el-form-item label="婚姻状况：" prop="MarryInfo" class="fl50">
					<span v-if="PersonalInformation.MarryInfo == 1" class="span">未婚</span>
					<span v-else-if="PersonalInformation.MarryInfo == 2" class="span">已婚</span>
					<span v-else-if="PersonalInformation.MarryInfo == 3" class="span">离婚、离异</span>
					<span v-else-if="PersonalInformation.MarryInfo == 4" class="span">丧偶</span>
					<span v-else class="span">-</span>
				</el-form-item> -->
				<!-- <el-form-item label="联系人：" prop="LinkMan" class="fl50">
					<span class="span">{{ (PersonalInformation.LinkMan == '' || PersonalInformation.LinkMan == null) ? "-" : PersonalInformation.LinkMan }}</span>
				</el-form-item>
				<el-form-item label="联系人电话：" prop="LinkPhone" class="fl50">
					<span class="span">{{ (PersonalInformation.LinkPhone == '' || PersonalInformation.LinkPhone == null) ? "-" : PersonalInformation.LinkPhone }}</span>
				</el-form-item>
				<el-form-item label="户籍地址：" prop="HouseholdAddress" class="fl50">
					<span class="span">{{ (PersonalInformation.HouseholdAddress == '' || PersonalInformation.HouseholdAddress == null) ? "-" : PersonalInformation.HouseholdAddress }}</span>
				</el-form-item>
				<el-form-item label="户籍邮编：" prop="HouseholdPostalCode" class="fl50">
					<span class="span">{{ (PersonalInformation.HouseholdPostalCode == '' || PersonalInformation.HouseholdPostalCode == null) ? "-" : PersonalInformation.HouseholdPostalCode }}</span>
				</el-form-item> -->
			</el-form>
		</div>


	</div>
</section>
</template>
<script>
import { getUserInfo } from '../api/api.js'
export default {
	data() {
		return {
			allMessage: false,
			PersonalInformation: { //个人信息展示
				Name: '',
				IDCard: '',
				Phone: '',
				EMail: '',
				Sex: '',
				Nation: '',
				Cultural: '',
				MarryInfo: '',
				LinkMan: '',
				LinkPhone: '',
				HouseholdAddress: '',
				HouseholdPostalCode: ''
			},
		}
	},
	methods: {
		getUserInfoMessage(params) {
			this.allMessage = true;
			//个人信息显示接口
			getUserInfo(params).then((response) => {
				console.log(response.Data);
				this.PersonalInformation = response.Data;
				this.allMessage = false;
			})
		}
	},
	created() {
		var params = {
			AccountId: this.$store.getters.userInfo.AccountId
		}
		this.getUserInfoMessage(params);
	}
}
</script>
<style lang="scss">
.userCenter {
    .main-content {
        padding: 0;
        .panel-heading {
            background-color: #eeeeee;
            padding: 10px 20px;
        }
		.panel-body {
		    padding: 10px 20px;
			display:inline-block;
			*display:inline;
			*zoom:1;
			vertical-align:middle;  /*去掉下边距*/
			.fl50 {
	    		float: left;
	    		width: 50%;
				.span{
					color: #959795;
				}
			}
		}
        .title {
            font-size: 24px;
            font-weight: bold;
            line-height: 1.2;
            color: #333;
        }

        .title:hover {
            color: #333 !important;
        }
    }
}
</style>
