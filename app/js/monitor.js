const path = require('path')
const osu = require('node-os-utils')
const { ipcRenderer } = require('electron')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os//require('os')


let cpuOverload
let cpuOverloadNotifyInterval
// get settings 
ipcRenderer.on('settings:get', (e, settings) => {
    cpuOverload = settings.cpuOverload
    cpuOverloadNotifyInterval = settings.notifyInterval
})



// dynamic system statistics
// run every 2 seconds
setInterval(() => {

    // cpu usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = `${info}%`
        // progress bar
        document.getElementById('cpu-progress').style.width = `${info}%`
        document.getElementById('cpu-progress').style.background = info > cpuOverload ? 'red' : '#30c88b'
        // check overload alert
        if (info > cpuOverload && canNotify(cpuOverloadNotifyInterval)) {
            // notify
            notifyUser({
                title: 'cpu overload',
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            })
            // store last notify time
            localStorage.setItem('lastNotify', +new Date())//+ to add timestamp(sec)
        }
    })
    // cpu free
    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = `${info}%`
    })
    // up time
    document.getElementById('sys-uptime').innerText = convertSecond(os.uptime())

}, 2000);
const convertSecond = (sec) => {
    sec = +sec //convert to number format
    const days = Math.floor(sec / (3600 * 24))
    const hours = Math.floor((sec % (3600 * 24)) / 3600)
    const minutes = Math.floor((sec % 3600) / 60)
    const seconds = Math.floor(sec % 60)
    return `${days} day ${hours} hours ${minutes} min ${seconds} s`
}


// static system statistics
// set model
document.getElementById('cpu-model').innerText = cpu.model()
// computer name
document.getElementById('comp-name').innerText = os.hostname()
// os
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`
// memory total
mem.info().then(info => {
    document.getElementById('mem-total').innerText = `${info.totalMemMb}MB`
})

// make notification
const notifyUser = (options) => {
    new Notification(options.title, options)
}
// check can notify
const canNotify = (interval) => {
    if (localStorage.getItem('lastNotify') === null) {
        localStorage.setItem('lastNotify', +new Date())
        return true
    }
    const lastNotify = parseInt(localStorage.getItem('lastNotify'))
    const diff = (+new Date()) - lastNotify
    return diff / 60000 >= interval
}