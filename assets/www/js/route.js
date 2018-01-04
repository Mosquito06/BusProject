$(function(){
	var routeId="";
	var busNumber="";
	var startStation="";
	var endStation="";
	var reversNum=0;
	var direction=0;//정방향=0, 역방향=1
	var parent = null; // 로딩화면에 나타나기 위한 부모 태그
	var stNode=[];//도착알림을 위한 정류장nodeID
		
	$(document).on("click","#busListView li",function(){
		// 로딩화면 추가
		parent = $("#routeContent");
		startLoading(parent, "노선 정보를 가져오는 중입니다.", "black");
		
		busNumber=$(this).find(".busNo").text();
		routeId=$(this).find(".busRoute").text();
		startEndRoute();
	});
	
	$("#btnBackNode").click(function(){
		direction=0;
	});
	
	$("#btnReverse").click(function(){
		$("#routeListView").empty(); // ul 태그 내 노선 정보를 삭제
		startLoading(parent, "노선 정보를 가져오는 중입니다.", "black");
		searchRoute(direction);
	});
	
	function searchRoute(directionNum){
		$.ajax({
			url:"http://openapi.tago.go.kr/openapi/service/BusRouteInfoInqireService/getRouteAcctoThrghSttnList?cityCode=22&routeId="+routeId+"&ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D&numOfRows=200",
			type:"get",
			dataType:"xml",
			success:function(xml){
				xml=xml.responseText;
				console.log(xml);
				var routeStationName=[];
				var cnt=0;
				
				//버스정류장들 배열에 넣기
				$(xml).find("item").each(function(i,obj){
					routeStationName.push($(obj).find("nodenm").text());
					stNode.push($(obj).find("nodeid").text());
				});
				
				switch(directionNum){
				case 0://정방향
					for(var k=0;k<routeStationName.length;k++){
						if(cnt==2){
							reverseNum=k;
							routeStationName.splice(0,routeStationName.length);
							direction=1;
							return;
						}
						


						$("#routeListView").append("<li><span class='routeStationName'>"+routeStationName[k]+
								"</span><span class='nodeID'>"+stNode[k]+"</span>"+
								"<div class='routeBtnDiv'><input type='checkbox' class='arriveOnOff' data-role='flipswitch' data-mini=true'>" +
								"<input class='locationInput' type='button' data-icon='location' data-iconpos='notext'></div>" +
								"</li>");
						
						if(routeStationName[k]==startStation || routeStationName[k]==endStation){
							cnt++;
							
						}
						$("#routeListView").listview("refresh");
						$("#routeListView input.locationInput").button().button("refresh");
						$("#routeListView input.arriveOnOff").flipswitch().flipswitch("refresh");
						stopLoading(parent);
					}
					
					
					
					break;
				case 1://역방향
					startLoading(parent, "노선 정보를 가져오는 중입니다.", "black");
					/*$("#routeListView").empty();*/ // 이미 ul 태그 내 자료가 삭제되었기 때문에 주석처리
					for(var k=reverseNum;k<routeStationName.length;k++){
						
						
						$("#routeListView").append("<li><span class='routeStationName'>"+routeStationName[k]+
								"</span><span class='nodeID'>"+stNode[k]+"</span>"+
								"<div class='routeBtnDiv'><input type='checkbox' class='arriveOnOff' data-role='flipswitch' data-mini=true'>" +
								"<input class='locationInput' type='button' data-icon='location' data-iconpos='notext'></div>" +
								"</li>");
						
					}
					$("#routeListView").listview("refresh");
					$("#routeListView input.locationInput").button().button("refresh");
					$("#routeListView input.arriveOnOff").flipswitch().flipswitch("refresh");
					
					routeStationName.splice(0,routeStationName.length);
					direction=0;
					stopLoading(parent);
					break;
				}
				
				
				
			}
		});
	}
	
	function startEndRoute(){
		$("#routeListView").empty();
		$.ajax({
			url:"http://openapi.tago.go.kr/openapi/service/BusRouteInfoInqireService/getRouteInfoIem?cityCode=22&routeId="+routeId+"&ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D&numOfRows=200",
			type:"get",
			dataType:"xml",
			success:function(xml){
				xml=xml.responseText;
				
				$("#routeHeader h1").text(busNumber+" 노선");
				
				startStation=$(xml).find("item").find("startNodeNm").text();
				endStation=$(xml).find("item").find("endNodeNm").text();
				
				searchRoute(direction);
			}
		});
	}
});