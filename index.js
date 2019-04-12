const Modal = require('./modal')
const url = require('url')
const fs = require('fs')
const async = require('async')

let index = new Modal()
let indexUrl = 'https://bbs.hupu.com/selfie'
let dataArr = []

fs.mkdir('./data/img', {
    recursive: true
}, (err) => {
    if (err) throw err
})

index.getData(indexUrl, function ($) {
    $('.titlelink>a:first-child').each(function (idx, ele) {
        let href = url.resolve(indexUrl, $(ele).attr('href'))

        index.getData(href, function ($) {
            let picObj = []
            let title = $('.bbs-hd-h1>h1').attr('data-title')
            let contentimg1 = index.setUrlStr($('.quote-content img')
                .eq(0)
                .attr('src')) //爆照图1
            let contentimg2 = index.setUrlStr($('.quote-content img')
                .eq(1)
                .attr('src')) //爆照图2
            let contentimg3 = index.setUrlStr($('.quote-content img')
                .eq(2)
                .attr('src')) //爆照图3
            let dataObj = {
                "title": title, //帖子标题
                "tximg": $('.headpic:first-child>img').attr('src'), //用户头像
                "txname": $('.j_u:first-child').attr('uname'), //用户ID
                "pic1": contentimg1, //爆照图1
                "pic2": contentimg2, //爆照图2
                "pic3": contentimg3, //爆照图3
                "address": href
            }

            dataArr.push(dataObj)
            index.dealObjectValue(dataArr)

            // console.log(dataArr)
            //保存数据
            fs.writeFileSync('./data/resulit.json', JSON.stringify(dataArr))

            let picArr = index.bouncer([
                contentimg1,
                contentimg2,
                contentimg3
            ])

            picArr.forEach((item, ide) => {
                picObj.push({
                    pic: item,
                    name: `${title}${ide}`
                })
            })

            //下载
            console.log(picObj)
            async.mapSeries(picObj, function (item, callback) {
                setTimeout(() => {
                    index.downLoadPic(item.pic, `./data/img/${String(item.name).replace(/\s/g,"")}.jpg`)
                    callback(null, item)
                }, 400)
            })
        })
    })
})