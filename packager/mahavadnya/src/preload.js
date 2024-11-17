// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
console.log(process)
document.addEventListener('open-url',function(event){
    console.log('open-url',event)
})