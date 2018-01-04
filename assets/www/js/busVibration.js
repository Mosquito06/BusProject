var intervalId=null;
var item=[];
var bus="";

$(function(){
	
	$(document).on("change",".onOff",function(){
		//item배열 초기화
		item.splice(0,item.length);
		if(intervalId!=null){
			clearInterval(intervalId);
		}
		//onOff버튼 상태 파악해서 on되어있는 버스번호 item배열에 저장
		$("#busListView .onOffDiv input").each(function(i,obj){
			if($(obj).prop("checked")==true){
				item.push($(obj).parents("li").find(".busNo").text());
			};
		});
		
		//정류장 버스정보 갱신
		intervalId=setInterval(function(){
			stationInfo($("#mainHeader").find(".nodeID").text(),$("#busListView"));
		},30000);
		
		$(".onOff").flipswitch().flipswitch("refresh");
		if(item.length==0){
			clearInterval(intervalId);
		}
	});
});

function vibration(){
	var busAsc="";
	
	$("#busListView .onOff").each(function(i,obj){
		//busAsc변수에 남은 정류장 개수 담기.
		busAsc=$(obj).parent().parent().parent().find(".busPosition").text().charAt(0);
		
		//on상태인 것들 진동
		if($(obj).prop("checked")==true){
			switch(busAsc){
			case "1":
				navigator.vibrate([500,100,500,100,500,100,500,100,500,100,500,100]);
				
				//item변수에 아무것도 없으면 clearInterval하고, item초기화
				if(item.length==0){
					clearInterval(intervalId);
					item.splice(0,item.length);
				}else{//item배열에 다른 버스번호 남아있다면 지금 남은 정류장이 1인 버스만 off로 변경, item배열에서 해당 버스번호 빼기.
					$(obj).prop("checked",false);
					$(".onOff").flipswitch().flipswitch("refresh");
					item.splice(i,1);
					break;
				}
			case "2":
				navigator.vibrate([700, 200,700,200,700]);
				break;
			case "3":
				navigator.vibrate([1000,200,1000]);
				break;
			}
		}
	});
}