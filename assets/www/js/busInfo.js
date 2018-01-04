function stationInfo(stationId, parent){
	parent.empty();
	
	//정류장 버스정보 받아오기.
	$.ajax({
		url:"http://openapi.tago.go.kr/openapi/service/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?cityCode=22&nodeId="+stationId+"&ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D",
		type:"get",
		dataType:"xml",
		success:function(xml){
			xml = xml.responseText;
			console.log(xml);
			
			//정류장 버스정보 나타내기
			$(xml).find("item").each(function(i,obj){
				var busNo=$(obj).find("routeno").text();//버스 번호
				var asc=$(obj).find("arrprevstationcnt").text();//정류장까지 남은 정류장개수
				var busType = $(obj).find("routetp").text(); // 버스 종류
				var busRouteId=$(obj).find("routeid").text();
				
				//버스번호 중복 걸러내기
				for(var j=0 ; j<i+1 ; j++){
					if($(".busNo").eq(j).text()==busNo+" 버스"){
						return;
					}
				}
				parent.append("<li><a href='#routePage'>" +
						"<p class='busNo'>"+ busNo +" 버스</p>" +
						"<p class='busPosition'>"+ asc + " 정류장 전</p>" +
						"<p class='busType'>"+ busType + "</p>" +
						"<p class='busRoute'>"+ busRouteId + "</p></a>" +
						"<div class='onOffDiv'><input type='checkbox' class='onOff' data-role='flipswitch'></div></li>");
			});
			parent.listview("refresh");
			
			//onoff버튼 유지
			$("#busListView li .busNo").each(function(i,obj){
				for(var j=0;j<item.length;j++){
					if($(obj).text()==item[j]){
						$(obj).parent().parent().find(".onOff").prop("checked","true");
					};
				}
				
			});
			
			$(".onOff").flipswitch().flipswitch("refresh");

			
			
			// 숨겨져 있던 Header와 Footer 보이도록 CSS 처리
			$("#mainHeader").css("display", "block");
			$("#mainFooter").css("display", "block");
			$("#Main").css("background-color", "white");
			$("#Main").addClass(".ui-page-theme-a");
			
			// 로딩화면 종료
			stopLoading($("#mainContent"));
			
			vibration();
		}
	});
}

// 버스정류장 위치를 가져와서 BookMark.html 내 Map 영역에 표시하는 함수
function stationLocation(stationNo, parent){
	
	$.ajax({
		url:"http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getSttnNoList?cityCode=22&nodeNo="+stationNo+"&ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D",
		type:"get",
		dataType:"xml",
		success:function(xml){
			xml = xml.responseText;
			console.log(xml);
			
			// 정류장 위도, 경도 가져오기
			var stationX = $(xml).find("item").find("gpslati").text();
			var stationY = $(xml).find("item").find("gpslong").text();
			
			var mapDiv = document.getElementById("bookMarkMap");
			var map = new naver.maps.Map(mapDiv);	
			
			var HOME_PATH = window.HOME_PATH || '.';
			var location = new naver.maps.LatLng(stationX, stationY);
			
			map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
			map.setZoom(12); // 지도의 줌 레벨을 변경합니다.
			
			var stationMarker = new naver.maps.Marker({
			    position: location,
			    map: map,
			    title: 'stationMarker',
			    icon: HOME_PATH +"/img/busStation.png",
			    animation: naver.maps.Animation.BOUNCE
			});
			
			stopLoading(parent);			

		}
	});
}

