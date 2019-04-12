const userAgents = require('./userAgents.js')
const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')


require('superagent-proxy')(superagent)
let proxy

module.exports = class Modal {
    constructor() {}

    //生成随机userAgents
    getAgent() {
        let userAgent = userAgents[parseInt(Math.random() * userAgents.length)]
        return {
            'User-Agent': userAgent
        }
    }

    //获取数据
    async getData(url, func) {
        await superagent
            .get(url)
            .set('header', this.getAgent())
            .end((err, res) => {
                if (err) throw new Error(err)

                //加载cheerio
                let $ = cheerio.load(res.text)

                func($)
            })
    }

    //去undfind
    bouncer(arr) {
        return arr.filter(function (val) {
            return !(!val || val === '')
        })
    }

    //判断文件夹是否存在 并创建
    setFolder(path) {
        fs.access(path, err => {
            if (err) {
                console.log('err')
                return
            }
            fs.mkdirSync(path)
        })
        // if (!fs.access(path)) {
        //     fs.mkdirSync(path)
        // }
    }

    //下载
    downLoadPic(src, dest) {
        console.log('start')
        if (src.includes('http')) {
            superagent(src)
                .set('header', this.getAgent())
                .pipe(fs.createWriteStream(dest))
                .on('close', function () {
                    console.log('pic saved!')
                })
        } else {
            console.log('no pic!')
            return
        }
    }

    //图片下载地址处理
    setUrlStr(str) {
        let str1 = String(str)
        let index = str1.indexOf('jpg')
        return str1.substring(0, index + 3)
    }

    //去除对象中的null
    dealObjectValue(obj) {
        var param = {};
        if (obj === null || obj === undefined || obj === "") return param;
        for (var key in obj) {
            if (dataType(obj[key]) === "Object") {
                param[key] = this.dealObjectValue(obj[key]);
            } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
                param[key] = obj[key];
            }
        }
        return param;

        function dataType(obj) {
            if (obj === null) return "Null";
            if (obj === undefined) return "Undefined";
            return Object.prototype.toString.call(obj).slice(8, -1);
        }

    }
}