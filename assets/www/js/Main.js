$(function(){
	// 장비 사용 준비가 완료되면 statusbar의 색상 변경
	document.addEventListener("deviceready", onDeviceReady, false);
	
	// screen 화면 설정
	var screenHeight = screen.height;
	var headerHeight = $("#BookMarkMapHeader").css("height").replace("px", "");
	var contentHeight = screenHeight - headerHeight;
	$("#bookMarkMap").css("height", contentHeight + "px"); 
	
	var height = screen.height;
	$("#Main").css("height", height + "px");
	
	// 어플 시작과 동시에 DB 생성
	openDB(); // DB 생성
	createTable(); // 테이블 생성
	// dropTable();
	// 메인 로고 애니메이션 및 출력 후 콜백함수
	$("#JDlogo").fadeIn(1300).css("margin", "70% 22%").fadeOut(1600, function(){
		$("#JDlogo").remove();
		$("#MainText").fadeIn(1800).fadeOut(1500, function(){
			
			// 메인 화면으로 이동
			location.replace("#Main");
			

			// 위치 사용여부 잠시 주석 처리
			// checkAvailability();
			
			selectDB("checkUserStation");
			
		});
	});
	
	$(document).on("click", "#routeListView input.locationInput", function(){
		// 노선정보 맵 페이지로 이동
		location.href = "#BookMarkMap";
		
		// 정류장 이름 map h1에 표기
		var stationName = $(this).parent().parent().parent().find(".routeStationName").text();
		$("#BookMarkStationLocationHeader").text(stationName);
		
		btnType = 1; // onoff 버튼과 구별하기 위한 btnType 설정
		$("#bookMarkMap").empty();
		$("#BookMarkMapDiv").find(".loading").remove();
		
		var parent = $("#BookMarkMapDiv");
		startLoading(parent, "정류장 위치를 찾는 중입니다.", "black");
		
		stNodeId=$(this).parent().parent().parent().find(".nodeID").text();
		selectDB("alarmStationNode");
	})
})

function onDeviceReady(){
	// console.log(StatusBar);
	window.StatusBar.backgroundColorByHexString("#79bd9a");
}