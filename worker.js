onmessage = function (obj){
	postMessage(obj.data)
	console.log("worker")
}