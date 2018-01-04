function stationNearUser(userLatitude, userlongitude, type, map){
	$.ajax({
		url:"http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getCrdntPrxmtSttnList?gpsLati="+userLatitude+"&gpsLong="+userlongitude+"&ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D&numOfRows=15",
		type:"get",
		dataType:"xml",
		success:function(xml){
			xml=xml.responseText;
			var userNearStNm = $(xml).find("item").eq(0).find("nodenm").text();
			var userNearStId = $(xml).find("item").eq(0).find("nodeid").text();
			var userNearStLati = $(xml).find("item").eq(0).find("gpslati").text();
			var	userNearStNmLong = $(xml).find("item").eq(0).find("gpslong").text();
						
			if(type == "버스정류장"){
				// Header에 가장 가까운 정류소 표시
				$("#mainHeader h1").html(userNearStNm+"<span class='nodeID'>"+userNearStId+"</span>");
				
				var parent = $("#busListView");
				stationInfo(userNearStId, parent);
			}else{
				var HOME_PATH = window.HOME_PATH || '.';
				var location = new naver.maps.LatLng(userNearStLati, userNearStNmLong);
				
				var stationMarker = new naver.maps.Marker({
				    position: location,
				    map: map,
				    title: 'userMarker',
				    icon: HOME_PATH +"/img/busStation.png",
				    animation: naver.maps.Animation.BOUNCE
				});
				
				return stationMarker;
			}
			
			
			
		}
	})
}