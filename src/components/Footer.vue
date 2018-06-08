<template>
    <div class="footer marT30" id="footer" ref="footer" v-if="headToggle===0">
        <div class="container clearfix">
            <div class="footer_item_1 fl">
                <div class="top clearfix">
                    <h4 class="fl white">友情链接：</h4>
                    <a class="fl block" href="http://www.baidu.com" target="view_window">XXXXXXXX </a>
                    <a class="fl block" href="http://www.baidu.com" target="view_window">XXXXXXXX</a>
                    <a class="fl block" href="http://www.baidu.com" target="view_window">XXXXXXXX</a>
                    <a class="fl block" href="http://www.baidu.com" target="view_window">XXXXXXXX</a>
                </div>
                <ul class="bottom">
                    <li>全国客服热线：400-060-6868（周一至周日9:00-21:00）</li>
                    <li>©2017派米雷集团 版权所有     沪ICP备09069162号-5</li>
                    <li style="line-height:28px;">
                        <a href="http://www.baidu.com" target="view_window">
                            <img src="../assets/images/u185.png" class="beian_img">
                            <span class="inline marL10">沪公网安备xxxxxxxx号</span>
                        </a>
                    </li>
                </ul>
            </div>
            <ul class="footer_item_2 fl">
                <li>
                    <strong>咨询电话:</strong>
                    <p>021-xxxxxxx</p>
                </li>
                <li>
                    <strong>报修电话:</strong>
                    <p>021-xxxxxxx</p>
                </li>
                <li>
                    <strong>投诉电话:</strong>
                    <p>021-xxxxxxx</p>
                </li>
            </ul>
            <div class="footer_item_3 fr marL20">
                <p class="tc">App下载</p>
                <img src="../assets/images/timg.png">
            </div>
            <div class="footer_item_3 fr">
                <p class="tc">关注微信公众号</p>
                <img src="../assets/images/timg.png">
            </div>
        </div>
    </div>
</template>
<script type="es6">
    import { mapGetters } from 'vuex'
    export default {
        computed : {
			...mapGetters(['headToggle']),
        }
    }
</script>
<style lang="scss">
/*footer*/
.footer{
    .beian_img{
        width:25px;
        height:25px;
    }
    background: url(../assets/images/global-footer-bg.jpg) no-repeat center;
    background-size: cover;
    padding:40px 0;
    .footer_item_1{
        padding-right:70px;
        .top{
            height:30px;
            line-height: 30px;
            padding-bottom:20px;
            margin-bottom:30px;
            border-bottom: 1px solid #555;
            width:620px;
            h4{
                font-weight:700;
            }
            a{
                color:#d7d7d7;
                font-size: 14px;
                display: block;
                float: left;
                margin-right:20px;
                &:hover{
                    color:#fff;
                }
            }
        }
        ul.bottom{
            li{
                color:#d7d7d7;
                padding-bottom:10px;
                a{
                    color:#d7d7d7;
                    &:hover{
                        color:#fff;
                    }
                }
            }
        }
    }
    ul.footer_item_2{
        width:165px;
        padding-top:6px;
        li{
            margin-bottom:20px;
            strong{
                display: block;
                margin-bottom:10px;
                color:#fff;
                font-weight:700;
            }
            p{
                color:#d7d7d7;
            }
        }
    }
    .footer_item_3{
        padding-top:6px;
        p{
            color:#fff;
            padding-bottom: 15px;
        }
        img{
            width:140px;
            height:140px;
        }
    }
}
@media screen and (max-width: 450px) {
    #footer{
        display: none;
    }
}
</style>
