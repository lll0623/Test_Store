<template>
<div class='container marT20 marB20' v-loading="loading">
	<div>
		<div class="screen-search-breadcrumb">
			<!-- 面包屑 -->
			<div class="clearfix search-breadcrumb">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_nav fl">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item :to="{ path: '/store' }">门店列表</el-breadcrumb-item>
					<el-breadcrumb-item>门店详情</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</div>
		<div class="villageDetails-item-top pad15" id="anchor-0">
			<h4 class="bold fs30 c-3 marB20">{{title}}</h4>
			<ul class="villageDetails-item-nav clearfix" :class="IsFixed? 'fix' : ''">
				<li v-for="(item,index) in navData" :key="index" :class="{'active':item.isActive===true}" @click="tabActive(item)">
					<a href="javascript:void(0)" @click="goAnchor('#anchor-'+index)">{{item.name}}</a>
				</li>
			</ul>
			<div class="villageDetails-item-top-cont clearfix">
				<div class="fl marR30 villageDetails-item-top-cont-fir rel">
					<swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop">
						<swiper-slide v-for="(banner,index) in banners" :key="index">
							<img :src="banner">
						</swiper-slide>
						<div class="swiper-button-next swiper-button-white" slot="button-next"></div>
						<div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
					</swiper>
					<swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
						<swiper-slide v-for="(banner,index) in banners" :key="index">
							<img :src="banner">
						</swiper-slide>
					</swiper>
				</div>
				<div class="fl villageDetails-item-top-cont-sec">
					<h5 class="bold fs16 c-3">门店基本信息</h5>
					<div class="clearfix village-info-fir">
						<p class="fl c-6">总计<strong class="red fs40">{{residueHouse}}</strong>个户型可供预约</p>
						<router-link class="fr block c-6" :to="{path:'/houseType',query: {id: villageId}}">查看该门店户型&gt;&gt;</router-link>
					</div>
					<ul class="village-info-sec marT20">
						<li>
							<label>区域：</label>
							<span>{{region}}</span>
						</li>
						<li>
							<label>地址：</label>
							<span>{{address}}</span>
						</li>
						<li>
							<label> 门店简介：</label>
							<span>{{wuyeType}}</span>
						</li>
						<li>
							<label>房间总数：</label>
							<span>{{totalHouse}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="villageCircum-wrap marT30 pad15" id="#anchor-1">
		<h2 class="site-title">门店地图</h2>
		<div class="DetailsFilter__Map">
			<!-- <input type="hidden" name="name" value="121.5259780000" id="lng">
                    <input type="hidden" name="name" value="31.1859440000" id="lat"> -->
			<div class="DetailsFilter__Map__Media fl" id="mapcontainer"></div>
			<div class="DetailsFilter__Map__Panel fr">
				<el-tabs v-model="villageArea" @tab-click="handleClick">
					<el-tab-pane v-for="(item,index) in villageAreaList" :label="item.name" :key="index" :index="index" :name="item.menu">
						<div class="villageAreaView" v-show="ite.list.length !== 0" v-for="(ite,index2) in listMessage" :key="index2">
							<h4>{{ ite.title }}</h4>
							<div :class="{villageAreaViewLi:true,active: ites.title==viactive}" v-for="(ites,index3) in ite.list" :key="index3" @mouseenter="mapChangeOver(ites.point, ite.cateList + (index3 + 1) )" @mouseleave="mapChangeOut(ites.point, ite.cateList + (index3 + 1) )"
							 @click="addClickHandler(ites.address,ites.point,ites.title);toggleClick(ites.title)">
								<i class="pull-left">{{ ite.cateList }}{{ index3 + 1 }}</i>
								<span>{{ites.title}}</span>
								<span class="fr">{{ ites.point | pointDistence(lng,lat) }}米</span>
							</div>
						</div>

					</el-tab-pane>
				</el-tabs>
				<div class="DetailsFilter__Map__InsideMemu medmenu">
					<ul class="clearfix">
						<li v-for="(item,index) in distenceList" :key="index" :class="{'active':item.isDistrnceActive}" @click="checkAreaSize(item.distence,index)">{{ item.label }}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="marT30" id='#anchor-2' v-show='showSimilarityLists'>
		<h2 class="site-title">该小区户型</h2>
		<div class="DetailsFilter__OthersHouse">
			<div class="col-xs-3" v-for="(item,index) in similarityLists">
				<router-link :to="`/houseDetails/${item.id}`" class="panel panel-default block">
					<div class="panel-body">
						<img v-lazy="(item.mainpic == null || item.mainpic == '') ? defaultImg : item.mainpic " data-error="../../assets/images/default.jpg" class="fl block DetailsFilter__OthersHouse__media" :alt="item.allname">
						<p class="text-warning marB10">{{item.allname}}</p>
						<p>{{item.housetypename}}</p>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import { getStoreDetails } from '../api/api.js'
import { getScrollTop } from '../util/index.js'
import BMap from 'BMap'
import defaultImg from '../assets/images/room_default.jpg'
import dwImg from '../assets/images/dw.png'
import aroundPos from '../assets/images/aroundPos.png'
import aroundPosActive from '../assets/images/aroundPosActive.png'
var mapVillage;
export default {
	data() {
		return {
			defaultImg,
			step: { //此数据是控制动画快慢的
				type: Number,
				default: 50
			},
			IsFixed: false,
			distence: '500',
			loading: false,
			navData: [{
				name: '门店概况',
				isActive: true
			}, {
				name: '门店地图',
				isActive: false
			}, {
				name: '门店户型',
				isActive: false
			}, ],
			swiperOptionTop: {
				spaceBetween: 10,
				loop: true,
				loopedSlides: 5, //looped slides should be the same
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}
			},
			swiperOptionThumbs: {
				spaceBetween: 10,
				slidesPerView: 4,
				touchRatio: 0.2,
				loop: true,
				loopedSlides: 5, //looped slides should be the same
				slideToClickedSlide: true,
			},
			//details
			villageId: '',
			title: '', //小区全称
			address: '', //地址
			region: '', //所属区域
			residueHouse: 0, //剩余房源
			totalHouse: null, //房屋总数
			wuyeType: '', //小区简介
			lat: '',
			lng: '',
			banners: [],
			//相似房源
			similarityLists: [],
			//该小区下是否有房源
			showSimilarityLists: true,
			//map
			villageArea: "tran",
			villageAreaList: [{
				name: '交通',
				keyWOrd: ['地铁', '公交'],
				menu: 'tran'
			}, {
				name: '教育',
				keyWOrd: ['幼儿园', '小学', '中学', '大学', '学院'],
				menu: 'edu'
			}, {
				name: '医疗',
				keyWOrd: ['医院', '药店'],
				menu: 'med'
			}, {
				name: '购物',
				keyWOrd: ['商场', '超市', '便利店', '市场'],
				menu: 'shop'
			}, {
				name: '生活',
				keyWOrd: ['ATM', '银行', '快餐', '餐厅', '咖啡厅'],
				menu: 'live'
			}, {
				name: '娱乐',
				keyWOrd: ['公园', '电影院', 'KTV', '健身房', '体育馆'],
				menu: 'happy'
			}],
			cateList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"], // 类型标记
			listMessage: '',
			tabIndex: "",
			viactive: "", //周边列表选则
			activeMap: false,
			distenceList: [{
				distence: 500,
				label: "0.5km",
				isDistrnceActive: true
			}, {
				distence: 1000,
				label: "1km",
				isDistrnceActive: false
			}, {
				distence: 1500,
				label: "1.5km",
				isDistrnceActive: false
			}, {
				distence: 2000,
				label: "2km",
				isDistrnceActive: false
			}, {
				distence: 2500,
				label: "2.5km",
				isDistrnceActive: false
			}],
			distence: 500,
			map: '',
		}
	},
	mounted() {
		this.$nextTick(() => {
			var _this = this
			const swiperTop = this.$refs.swiperTop.swiper
			const swiperThumbs = this.$refs.swiperThumbs.swiper
			swiperTop.controller.control = swiperThumbs
			swiperThumbs.controller.control = swiperTop
		})
		setTimeout(() => {
			this.creatChangeMap(0);
		}, 1000)
		this.addEventListeners()
	},
	filters: {
		// 根据金纬度距离计算
		pointDistence: function(point,lng,lat) {
            let mPoint_lat,mPoint_lng;
			if (lat == '' || lat == null || lat == 0 || lng == '' || lng == null || lng == 0) {
				mPoint_lng = 121.5505840120, 31.2274065041
				mPoint_lat = 31.2274065041
			} else {
                mPoint_lng = lng
				mPoint_lat = lat
			}
			var radLat1 = mPoint_lat * Math.PI / 180.0;
			var radLat2 = point.lat * Math.PI / 180.0;
			var a = radLat1 - radLat2;
			var b = mPoint_lng * Math.PI / 180.0 - point.lng * Math.PI / 180.0;
			var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
			s = s * 6378.137;
			s = (Math.round(s * 10000) / 10).toFixed(0);
			return s
		}
	},
	methods: {
		currentFunc() {
			//监听滚动条
			var _this = this
			try {
				if (getScrollTop() >= 160) {
					_this.IsFixed = true
					if (getScrollTop() >= 560 && getScrollTop() < 810) {
						_this.navData[0].isActive = false;
						_this.navData[1].isActive = true;
						_this.navData[2].isActive = false;
						if (_this.navData.length == 4) {
							_this.navData[3].isActive = false;
						}
					} else if (getScrollTop() >= document.getElementById('#anchor-2').offsetTop) {
						_this.navData[0].isActive = false;
						_this.navData[1].isActive = false;
						_this.navData[2].isActive = true;
						if (_this.navData.length == 4) {
							_this.navData[3].isActive = false;
						}
					}
				} else if (getScrollTop() >= document.getElementById('#anchor-3').offsetTop) {
					_this.navData[0].isActive = false;
					_this.navData[1].isActive = false;
					_this.navData[2].isActive = false;
					if (_this.navData.length == 4) {
						_this.navData[4].isActive = true;
					}
				} else {
					_this.navData[0].isActive = true;
					_this.navData[1].isActive = false;
					_this.navData[2].isActive = false;
					if (_this.navData.length == 4) {
						_this.navData[3].isActive = false;
					}
					_this.IsFixed = false
				}
			} catch (e) {}
		},
		addEventListeners() {
			const _this = this;
			window.addEventListener('scroll', _this.currentFunc);
		},
		tabActive(item) {
			for (var i = 0; i < this.navData.length; i++) {
				this.navData[i].isActive = false
			}
			item.isActive = true
		},
		backTop(i) {
			//参数i表示间隔的幅度大小，以此来控制速度
			document.documentElement.scrollTop -= i;
			if (document.documentElement.scrollTop > 0) {
				var c = setTimeout(() => this.backTop(1), 16);
			} else {
				clearTimeout(c);
			}
		},
		//获取锚点
		goAnchor(anchorName) {
			// 找到锚点
			let anchorElement = document.getElementById(anchorName);
			// 如果对应id的锚点存在，就跳转到锚点
			if (anchorElement) {
				anchorElement.scrollIntoView();
			}
			if (anchorName == '#anchor-0') {
				this.backTop(this.step)
			}
		},
		checkAreaSize(dis, index) {
			for (var i = 0; i < this.distenceList.length; i++) {
				this.distenceList[i].isDistrnceActive = false;
			}
			this.distenceList[index].isDistrnceActive = true;
			this.distence = dis;
			this.creatChangeMap(this.tabIndex);
		},
		creatChangeMap(tab_index) {
			var map = new BMap.Map("mapcontainer", {
				enableMapClick: true
			});

			// 添加地图类型控件
			map.addControl(new BMap.MapTypeControl());
			// 添加工具条、比例尺控件
			map.addControl(new BMap.ScaleControl({
				anchor: BMAP_ANCHOR_TOP_LEFT
			}));
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.NavigationControl({
				anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
				type: BMAP_NAVIGATION_CONTROL_SMALL
			}));
			// 开启鼠标滚轮缩放
			map.enableScrollWheelZoom(true);
			map.clearOverlays();
			mapVillage = map;
			this.tabIndex = tab_index;

			let mPoint;
			if (this.lat == '' || this.lat == null || this.lat == 0 || this.lng == '' || this.lng == null || this.lng == 0) {
				mPoint = new BMap.Point(121.5505840120, 31.2274065041);
			} else {
				mPoint = new BMap.Point(this.lng, this.lat);
			}

			var myIcon = new BMap.Icon(dwImg, new BMap.Size(35, 35));
			var marker = new BMap.Marker(mPoint, {
				icon: myIcon
			}); // 创建标注
			map.addOverlay(marker); // 将标注添加到地图中

			map.centerAndZoom(mPoint, 15);
			var circle = new BMap.Circle(mPoint, this.distence, {
				fillColor: "#bb0068",
				strokeWeight: 1,
				fillOpacity: 0.3,
				strokeOpacity: 0.3
			});
			map.addOverlay(circle);
			var arry;
			var _this = this,
				arryList = [];
			for (var i = 0; i < this.villageAreaList[this.tabIndex].keyWOrd.length; i++) {
				var result, index = 0;;
				var options = {
					onSearchComplete: function(results) {
						index += 1;
						result = results.keyword;
						var list = [];
						for (var m = 0; m < results.getCurrentNumPois(); m++) {
							list.push(results.getPoi(m));
							var point = new BMap.Point(results.getPoi(m).point.lng, results.getPoi(m).point.lat);
							var myIcon = new BMap.Icon(aroundPos, new BMap.Size(40, 40));
							var marker = new BMap.Marker(point, {
								icon: myIcon
							});
							marker.addEventListener('mouseover', function(e) { //气泡mouseenter事件
								if (this.activeMap == true) return false;
								//当前气泡高亮、置顶
								var myIconActive = new BMap.Icon(aroundPosActive, new BMap.Size(40, 40));
								this.setIcon(myIconActive);
								this.setTop(true);
							});
							marker.addEventListener('mouseout', function(e) { //气泡mouseenter事件
								if (this.activeMap == true) return false;
								//当前气泡高亮、置顶
								var myIcon = new BMap.Icon(aroundPos, new BMap.Size(40, 45));
								this.setIcon(myIcon);
								this.setTop(true);
							});


							_this.addClickHandler2(results.getPoi(m).address, results.getPoi(m).title, marker, point, "" + _this.cateList[index - 1] + "" + (m + 1) + "");
						}
						arryList.push({
							title: result,
							list: list,
							cateList: _this.cateList[index - 1]
						});
						_this.listMessage = arryList;
					},
					pageCapacity: 100
				};

				var local2 = new BMap.LocalSearch(map, options);
				local2.searchNearby(this.villageAreaList[this.tabIndex].keyWOrd[i], mPoint, this.distence);
			}
		},
		addClickHandler(address, points, title) {
			var map = mapVillage;
			var point = new BMap.Point(points.lng, points.lat);
			var marker = new BMap.Marker(point); // 创建标注
			this.openInfo(address, title, point)
		},
		// 移入事件
		mapChangeOver(points, labels) {

		},
		// 移出事件
		mapChangeOut(points, labels) {},
		toggleClick(index) {
			this.viactive = index;
		},
		addClickHandler2(content, title, marker, point, text) {
			var _this = this;
			var map = mapVillage;
			var label = new BMap.Label(text);
			label.setStyle({
				color: "#fff",
				letterSpacing: '-2px',
				fontSize: "12px",
				border: "0",
				background: "transparent",
				textAlign: "center",
				width: "26px",
				height: "29px",
				marginLeft: "-3px",
				paddingTop: "5px"
			});

			marker.setLabel(label);
			map.addOverlay(marker);
			marker.addEventListener("click", function(e) {
				this.activeMap = true;
				_this.openInfo(content, title, point);
				//当前气泡高亮，其他气泡还原
				var myIconActive = new BMap.Icon(aroundPosActive, new BMap.Size(40, 40));
				this.setIcon(myIconActive);
				this.setTop(true);
				this.activeMap = false;
			});
		},
		openInfo(content, title, point) {
			var map = mapVillage;
			var point = point;
			var infoWindow = new BMap.InfoWindow("地址：" + content + "", {
				width: 200, // 信息窗口宽度
				height: 100, // 信息窗口高度
				title: title, // 信息窗口标题
				enableMessage: true, //设置允许信息窗发送短息
			}); // 创建信息窗口对象
			map.openInfoWindow(infoWindow, point); //开启信息窗口
		},
		handleClick(tab, event) {
			this.creatChangeMap(tab.index); //检索的函数 this.creatChangeMap()
		},

	},
	created() {
		this.loading = true
		//获取小区详情
		getStoreDetails({
			Id: this.$route.params.id
		}).then(response => {
			switch (response.StatusCode) {
				case 200:
					this.villageId = response.Data.BaseInfo.Id //小区id
					this.title = response.Data.BaseInfo.Name //全称
					this.address = response.Data.BaseInfo.Address //地址
					this.residueHouse = response.Data.BaseInfo.RentableRoomNums == null ? '0' : response.Data.BaseInfo.RentableRoomNums //房源剩余数量
					this.wuyeType = response.Data.BaseInfo.Memo //小区简介
					this.region = response.Data.BaseInfo.RegionName //所属区域
					this.lat = response.Data.BaseInfo.LAT //经度
					this.lng = response.Data.BaseInfo.LNG //纬度
					this.totalHouse = response.Data.BaseInfo.Count == null ? '0' : response.Data.BaseInfo.Count //房间总数
					//该小区下的房源
					if (response.Data.OtherInfo.length && response.Data.OtherInfo.length > 0) {
						this.similarityLists = response.Data.OtherInfo
					} else {
						this.navData = this.navData.slice(0, 2)
						this.showSimilarityLists = false
					}

					if (response.Data.ImageList.length == 0) {
						this.banners.push(defaultImg)
					} else {
						this.banners = response.Data.ImageList
					}
					setTimeout(() => {
						this.loading = false
					}, 1000)
					break;
			}
		}).catch(error => {
			this.$message.error(error)
		});
		// this.creatChangeMap(0);
	}
}
</script>
<style lang="scss">
.DetailsFilter__Map__Panel {
    .el-tabs__item {
        padding: 0 15px;
    }
    .el-tabs__header {
        margin-left: 15px;
    }
    .el-tabs__content {
        height: 336px;
        overflow: scroll;
        margin-top: 40px;
        h4 {
            margin: 10px;
            font-size: 18px;
            color: #333;
        }
    }
}
.DetailsFilter__Map__InsideMemu {
    position: absolute;
    top: 45px;
    padding-left: 30px;
    ul li {
        float: left;
        width: 52px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #bb0068;
        margin-right: 5px;
        color: #333;
    }
    ul li.active {
        color: #fff;
        background-color: #bb0068;
    }
}
.site-title {
    width: 100%;
    margin-bottom: 20px;
    font-size: 30px;
    color: #333;
    font-weight: 300;
}
.DetailsFilter__OthersHouse {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    background: #fff;
    .col-xs-3 {
        width: 25%;
        float: left;
        .panel-body {
            padding: 15px;
            .DetailsFilter__OthersHouse__media {
                width: 100%;
                height: 120px;
                background-color: #fff;
                margin-bottom: 10px;
                overflow: hidden;
                vertical-align: middle;
                display: block;
            }
            .text-warning {
                color: #ff5722;
            }
        }
    }
}
.villageAreaView {
    padding-left: 15px;
    h4 {
        font-weight: 300;
        font-size: 18px;
    }
    .villageAreaViewLi {
        height: 35px;
        cursor: pointer;
        i {
            width: 24px;
            height: 24px;
            line-height: 24px;
            background-color: #bb0068;
            color: #fff;
            text-align: center;
            border-radius: 50%;
            font-style: normal;
            margin-right: 10px;
        }
        &:hover {
            color: #ff9a1b !important;
            i {
                background-color: #ff9a1b !important;
            }
        }
    }
    .villageAreaViewLi.active {
        color: #ff9a1b !important;
    }

}
//锚点
ul.villageDetails-item-nav {
    &.fix {
        top: 60px;
        left: 0;
        width: 100%;
        z-index: 2001;
        background: #fff;
    }
}
</style>
