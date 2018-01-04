var btnType = 0;

$(function(){
	// screen 화면 설정
	var screenHeight = screen.height;
	var headerHeight = $("#BookMarkMapHeader").css("height").replace("px", "");
	var contentHeight = screenHeight - headerHeight;
	$("#bookMarkMap").css("height", contentHeight + "px"); 
	
	// 임시 DB open
	openDB();
	
	// 즐겨찾기 목록 검색
	$("#MapPage").ready(function(){
		selectDB("searchUserStation");
		
	});
	
	// 정류장 버스 정보 보기
	$(document).on("click","#stationListView li",function(){
		stationInfo($(this).find(".nodeID").text(), $("#busListView"));
		$("#stName").html("<span class='nodeName'>" + $(this).find("a").text() + 
				"</span><span class='nodeID'>"+$(this).find("span.nodeID").text() + "</span>" +
				"<span class='nodeNo'>" + $(this).find("span.nodeNo").text() + "</span>");
	});
	
	// 즐겨찾기 위치보기 버튼
	$("#stationLocation").click(function(){
		$("#bookMarkMap").empty();
		
		
		// 맵 페이지 Header h1 태그 내에 정류소 이름 표시
		var stationName = $("#BookMarkSub #mainHeader h1#stName span.nodeName").text();
		var stationNo = $("#BookMarkSub #mainHeader h1#stName span.nodeNo").text();
		var parent = $("#BookMarkMapDiv");
		
		$("#BookMarkStationLocationHeader").text(stationName);
		
		startLoading(parent, "정류장 위치를 찾는 중입니다.", "black");
		getStationLocation(stationNo, parent);
		
		// a 태그의 href를 변경
		$("#BookMarkMapHeader a").attr("href", "#BookMarkSub");
	
	})
	
	//즐겨찾기에서 정류장 삭제
	$("#deleteStation").click(function(){
		deleteDB();
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
		
		// 두 번 호출을 막기위해 어쩔 수 없이 주석처리
		selectDB("alarmStationNode");
		
		// a 태그의 href를 변경
		$("#BookMarkMapHeader a").attr("href", "#routePage");
	})
	
})




