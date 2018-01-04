$(function(){
	// screen 화면 설정
	var screenHeight = screen.height;
	var headerHeight = $("#BookMarkMapHeader").css("height").replace("px", "");
	var contentHeight = screenHeight - headerHeight;
	$("#bookMarkMap").css("height", contentHeight + "px"); 
	
	openDB();
	$("#searchStationTextField").parent().addClass("searchInputWidth");
	
	//정류장list 검색
	$("#btnSearch").click(function(){
		selectDB("searchBusStation");
	});
	
	//정류장 버스 정보 보기
	$(document).on("click","#stationListView li",function(){
		stationInfo($(this).find(".nodeID").text(), $("#busListView"));
		$("#mainHeader h1").html("<span class='nodeName'>" + $(this).find("a").text() + 
				"</span><span class='nodeID'>" + $(this).find("span.nodeID").text() + "</span>" +
				"<span class='nodeNo'>" + $(this).find("span.nodeNo").text() + "</span>");
	});
	
	// 버스정류장 위치보기 버튼
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
	
	
	
	
	$("#addStation").click(function(){
		insertDB("UserStation");
	})
});

