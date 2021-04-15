
amap_api = function(){
	$.ajax({
		url: "https://restapi.amap.com/v3/direction/walking",
		method: "GET",	//method是jquery1.9.0加入的属性，如果使用1.9.0之前的版本，则用type
		async: true,
		data: {
			
			key: "99ef4ceb65c7e636823e45e9de520dc3"
		},
		success: function(result){
			var json = JSON.parse(result)
			console.log(json)
		},
		error: function(result){
			console.log(result)
			alert("无法使用高德API");
		}
	});
}
