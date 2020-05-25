// const { ipcRenderer } = require('electron')

// set configuration items
ipcRenderer.on('settings:get', (e, settings) => {
    document.getElementById('cpu-overload').value = settings.cpuOverload
    document.getElementById('alert-frequency').value = settings.notifyInterval
})

ipcRenderer.on('settings:saved', (e) => {
    showAlert('Settings saved!')
})
// show alert
const showAlert = msg => {
    const Alert = document.getElementById('alert')
    Alert.innerText = msg
    Alert.classList.remove('hide')
    Alert.classList.add('alert')
    setTimeout(() => {
        Alert.classList.add('hide')
        Alert.classList.remove('alert')
    }, 2000)
}
// save configuration
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const cpuOverload = parseInt(document.getElementById('cpu-overload').value)
    const notifyInterval = parseInt(document.getElementById('alert-frequency').value)
    ipcRenderer.send('settings:set', { cpuOverload, notifyInterval })
})

