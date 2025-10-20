const { RawSource } = require('webpack-sources')
const fs = require('fs')
const path = require('path')
const util = require('util')

class MyAwesomeWebpackPlugin {
    constructor(options) {
        // 传入的配置
        this.options = options
        // 插件名
        this.PLUGIN_NAME = 'MyAwesomeWebpackPlugin'
    }
    apply(compiler) {
        const output = compiler.options.output
        // webpack中的output配置对象
        console.log(output)
        // 编译输出地址
        const outputPath = output.path
        compiler.hooks.done.tap(
            this.PLUGIN_NAME,
            async (stats) => {
                const assets = stats.compilation.assets
                // 这里也能拿到output配置对象
                console.log(stats.compilation.options.output.path)
                // assets对象的键是最终生成的文件地址，值是一个对象
                console.log(Object.keys(assets))
                const urls = Object.keys(assets)
                for (let url of urls) {
                    const temp = url.split('.')
                    const isJSFile = temp[temp.length - 1] === 'js'
                    if (isJSFile) {
                        const fileUrl = path.join(outputPath, url)
                        const comment = this.options.comment || `/* some comment */`
                        // 写入注释
                        const access = util.promisify(fs.access)
                        const readFile = util.promisify(fs.readFile)
                        const writeFile = util.promisify(fs.writeFile)
                        try {
                            await access(fileUrl, fs.constants.F_OK)
                            const data = await readFile(fileUrl)
                            // console.log(data) // 读取的buffer格式数据
                            const newData = `${comment}\r\n${data}`
                            writeFile(fileUrl, newData)
                        } catch (error) {
                            console.error('err', error)
                        }
                    }
                }
                console.log(new RawSource(JSON.stringify({ test: 1 })))
            }
        )

    }
}

module.exports = MyAwesomeWebpackPlugin