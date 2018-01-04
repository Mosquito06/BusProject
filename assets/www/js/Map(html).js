$(function(){
	var screenHeight = screen.height;
	var headerHeight = $("#mapHeader").css("height").replace("px", ""); // **px로 결과가 반환됨, px을 replace 함수로 삭제 후 반환
	var contentHeight = screenHeight - headerHeight; // 스크린의 높이에서 헤더의 높이를 뺌
	$("#map").css("height", contentHeight + "px"); // contentHeigh를 map에 적용
	
	// 초기 화면 시 생성되는 제이쿼리 모바일 로딩 삭제
	$(".ui-icon-loading").remove();
		
	// Map page가 나타나면 실행되는 콜백함수
	$("#MapPage").ready(function(){
		
		var parent = $("#mapContent");
		getMyLocation(parent, "현재위치", "사용자 위치를 파악 중입니다.");
	})
	
})