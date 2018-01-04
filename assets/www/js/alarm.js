var userLati;
var userLongi;
var stNodeId="";
var stNodeNo="";
var stationLati="";
var stationLongi="";
var ourCoords=null;
var countNum=0;

$(function(){
	$(document).on("change",".arriveOnOff",function(){		
		clearInterval(intervalId);
				
		if($(this).prop("checked") == true){
			countNum++;
			
			//마지막에 on누른것만 on상태로 두기.
			if(countNum==2){
				$(".arriveOnOff").prop("checked",false);
				$(this).prop("checked",true);
				$(".arriveOnOff").flipswitch().flipswitch("refresh");
				alert("도착알림은 하나의 정류장만 선택 가능합니다.");
				countNum=1;
			}
			btnType = 2;
			stNodeId=$(this).parent().parent().parent().find(".nodeID").text();
			intervalId=setInterval(function(){
				selectDB("alarmStationNode");//선택한 정류장 nodeNo검색해서 stNodeNo변수에 저장
			},30000);
			
		}else{
			countNum = 0;
		}
	});
});

//정류장 좌표 받아오기.
function alarmStationLocation(){
	$.ajax({
		url:"http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getSttnNoList?cityCode=22&nodeNo="+stNodeNo+"&ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D",
		type:"get",
		dataType:"xml",
		success:function(xml){
			xml = xml.responseText;
			stationLati=$(xml).find("gpslati").text();
			stationLongi=$(xml).find("gpslong").text();
			
			ourCoords = { //정류장 좌표
				    latitude : stationLati,  //위도
				    longitude : stationLongi  //경도
				};
			getUserLocation();
		}
	});
}


	

	function getUserLocation() {

	     // navigator.geolocation 없다면 null을 반환하고 조건식의 결과는 false
	    if (navigator.geolocation) {
	        
	        navigator.geolocation.getCurrentPosition(displayLocation, displayError); 
	    } else {
	        alert("내 위치 정보제공 설정을 확인해 주세요.");
	    }
	}

	//
	function displayLocation(position) {

	    userLati = position.coords.latitude;
	    userLongi = position.coords.longitude;

	    //사용자위치와 정류장 위치 직선거리 구함.
	    var distance = computeDistance(position.coords, ourCoords);
	    distance=Math.floor(distance*10)/10;//소수점 첫째자리까지 표현
	    
	    //사용자와 정류장 직선거리가 200이하라면 clearinterval, 진동울림, off상태로 돌림.
	    if(distance <= 0.2){
	    	clearInterval(intervalId);
	    	intervalId=null;
	    	countNum=0;
	    	navigator.vibrate([700, 200,700,200,700]);
	    	
	    	$(".arriveOnOff").prop("checked",false);
	    	
	    	$(".arriveOnOff").flipswitch().flipswitch("refresh");
	    	
	    }
	    
	                        
	}

	function displayError(error) {
	    var errorTypes = {
	        0: "알려지지 않은 에러",
	        1: "사용자가 권한 거부",
	        2: "위치를 찾을 수 없음",
	        3: "요청 응답 시간 초과"
	    };
	    var errorMessage = errorTypes[error.code];
	    if (error.code == 0 || error.code == 2) {
	        errorMessage = errorMessage + " " + error.message;
	    }
	    $("#location").html(errorMessage);        
	}


	// 구면 코사인 법칙(Spherical Law of Cosine) 으로 두 위도/경도 지점의 거리를 구함
	// 반환 거리 단위 (km)
	function computeDistance(startCoords, destCoords) {
	    var startLatRads = degreesToRadians(startCoords.latitude);
	    var startLongRads = degreesToRadians(startCoords.longitude);
	    var destLatRads = degreesToRadians(destCoords.latitude);
	    var destLongRads = degreesToRadians(destCoords.longitude);

	    var Radius = 6371; //지구의 반경(km)
	    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
	                    Math.cos(startLatRads) * Math.cos(destLatRads) *
	                    Math.cos(startLongRads - destLongRads)) * Radius;

	    return distance;
	}

	function degreesToRadians(degrees) {
	    radians = (degrees * Math.PI)/180;
	    return radians;
	}