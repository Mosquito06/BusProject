var map = null;
var mapOptions = null;
var map_parent = null;


function createMap(){
	// 아이디 map에 네이버 지도 생성
	map = new naver.maps.Map("map", mapOptions);
} 

function getMyLocation(parent, type, text){
	var posOption = {
			maximumAge: 3000,
			timeout: 10000,
			enableHighAccuracy: true
	}
		
	if(type == "현재위치"){
		startLoading(parent, text, "black");
		navigator.geolocation.getCurrentPosition(onSuccess, onFail, posOption);
		map_parent = parent;
	}else{
		startLoading(parent, text, "white");
		navigator.geolocation.getCurrentPosition(otherSuccess, otherFail, posOption);
	}
	
}

function getStationLocation(stationNo, parent){
	if(stationNo == null || stationNo == ""){
		alert("정류장 위치를 표시할 수 없는 정류장입니다.");
		stopLoading(parent);
		location.replace("BookMark.html");
		return;
	}
		
	stationLocation(stationNo, parent);

}

// 현재위치용 성공 콜백
function onSuccess(position){
	stopLoading(map_parent);
	
	var latitude = position.coords.latitude; // 위도
	var longitude = position.coords.longitude; // 경도
			
	mapOptions = {
		    center: new naver.maps.LatLng(37.3595704, 127.105399),
		    zoom: 10
	};
	
	map = new naver.maps.Map("map", mapOptions);
	stationNearUser(latitude, longitude, "현재위치", map);
	
	var location = new naver.maps.LatLng(latitude, longitude);
	var HOME_PATH = window.HOME_PATH || '.';
	var userMarker = new naver.maps.Marker({
	    position: location,  
	    map: map,
	    title: 'userMarker',
	    icon: HOME_PATH +"/img/currentLocation.png",
	    animation: naver.maps.Animation.BOUNCE
	});
	
	map.setCenter(location); // 얻은 좌표를 지도의 중심으로 설정합니다.
	map.setZoom(10); // 지도의 줌 레벨을 변경합니다.
	
	$("#mapHeader").css("display", "block");
	$("#mapFooter").css("display", "block");
	
	
	
}
//현재위치 실패 콜백
function onFail(e){
	alert("위치를 가져오는데 실패했습니다.");
}



//버스정류장위치 성공 콜백
function otherSuccess(position){
	// 위도
	var latitude = position.coords.latitude;
	// 경도
	var longitude = position.coords.longitude;
	// 내 위치 기반 가장 가까운 정류소를 찾는 함수 호출
	stationNearUser(latitude, longitude, "버스정류장", null);
	
}

//버스정류장위치 실패 콜백
function otherFail(e){
	alert("위치를 가져오는데 실패했습니다.");
	location.replace("Search.html");
}







	 
