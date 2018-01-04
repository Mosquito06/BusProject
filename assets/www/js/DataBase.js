var db = null;

function openDB(){
	db = window.openDatabase("BusProject", "1.0", "대구버스", 1024*1024);
}

function createTable(){
	db.transaction(function(tr){
		var createBusStation = "create table if not exists BusStation(Id integer primary key autoincrement, stName text, stId text, stNo text)";
		// var createStartEnd = "create table if not exists StartEnd(Id integer primary key autoincrement, stStartName text, stStartId text, stEndName text, stEndId text)";
		var userStation = "create table if not exists UserStation(Id integer primary key autoincrement, stName text, stId text, stNo text)";
		
		tr.executeSql(createBusStation);
		// tr.executeSql(createStartEnd);
		tr.executeSql(userStation);
	})
}

function dropTable(){
	db.transaction(function(tr){
		var dropBusStation = "drop table BusStation";
		// var dropStartEnd = "drop table StartEnd";
		var dropUserStation = "drop table UserStation";
		
		tr.executeSql(dropBusStation);
		// tr.executeSql(dropStartEnd);
		tr.executeSql(dropUserStation);
		
		alert("삭제 완료");
	})
}

function insertDB(selectTable){
	switch(selectTable){
		case "BusStation" :
			var parent = $("#mainContent");
			startLoading(parent, "버스 정류장 정보를 가져오는 중입니다.", "white");
			
			$.ajax({
				url:"http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getSttnNoList?ServiceKey=rMcvUqjxQmgvYV415othO9E%2F2VyefZFKM7mamzxWQvB2m%2Fb1attoU9XXfNeXBudaEEMlpDgrkWtKFn9%2BsgxCeg%3D%3D&cityCode=22&numOfRows=4660&pageNo=1",
				type:"get",
				dataType:"xml",
				success:function(xml){
					xml = xml.responseText;
					var xmlSize = $(xml).find("item").size();
					
					db.transaction(function(tr){
						$(xml).find("item").each(function(i, obj){
							var insertSQL = "insert into BusStation(stName, stId, stNo) values(?, ?, ?)";
							tr.executeSql(insertSQL, [$(obj).find("nodeNm").text(), $(obj).find("nodeid").text(), $(obj).find("nodeNo").text()], function(tr, rs){
								console.log("insert success");
								if(i == xmlSize-1){
									// DB 로딩화면 멈춤
									stopLoading(parent);
									
									// DB 생성 후 사용자 위치 확인
									getMyLocation(parent, "버스정류장", "가장 가까운 정류소를 찾는 중입니다.");
								}
							}, function(tr, err){
								console.log("error : " + err.code + err.message);
							});
						})
					})
				}
			});
			break;
		case "UserStation" :
			var stName = $("h1").find(".nodeName").text(); // 정류소 이름
			var stId = $("h1").find(".nodeID").text(); // 정류소 ID
			var stNo = $("h1").find(".nodeNo").text(); // 정류소 No
			
			db.transaction(function(tr){
				// 즐겨찾기 목록에서 데이터를 가져와서 저장할 데이터와 비교
				// 즐겨찾기의 목록을 모두 가져와서 비교하기 때문에 성능이 느려질 수 있음
				// 다른 알고리즘 생각할 필요가 있음
				var selectSQL = "select * from UserStation";
				tr.executeSql(selectSQL, [], function(tr, rs){
					
					for(var i = 0; i < rs.rows.length; i ++){
						if(stId == rs.rows[i].stId){
							alert("이미 저장된 정류소입니다.");
							return;
						}
					}
					
					var insertSQL = "insert into UserStation(stName, stId, stNo) values(?, ?, ?)";
					tr.executeSql(insertSQL, [stName, stId, stNo], function(tr, rs){
							console.log("insert success");
							alert("즐겨찾는 정류장으로 등록하였습니다.");
						
						}, function(tr, err){
							console.log("error : " + err.code + err.message);
						});
									
				}, function(tr, err){
					console.log("error : " + err.code + err.message);
				})
							
			})
			break;
	}
}

function selectDB(selectTable){
	switch(selectTable){
		case "checkUserStation" :
			var selectSql = "select * from UserStation";
			db.transaction(function(tr){
				tr.executeSql(selectSql, [], function(tr, rs){
					
					// 즐겨찾기에 저장된 정류장이 없을 경우에는 selectDB()함수를 재귀호출
					if(rs.rows.length == 0){
						selectDB("checkBusStation");
					}else{
					// 즐겨찾기에 저장된 정류장이 있을 경우에는 즐겨찾기 페이지로 바로 이동
						location.replace("BookMark.html");
					
					// 저장된 정보를 가져온 뒤 리스트에 추가
						$(rs.rows).each(function(i, obj) {
							var stNm = obj.stName;
							var stId = obj.stId;
							var stNo = obj.stNo;
							
							$("div#BookMarContent ul#stationListView").append("<li class='stationInfo'><a href='#BookMarkSub'>"+
									stNm+"</a><span class='nodeID'>"+
									stId+"</span><span class='nodeNo'>"+
									stNo+"</span></li>");
						});
					
					// 리스트 갱신
						$("div#BookMarkMain div#BookMarContent ul#stationListView").listview("refresh");
					}
				}, function(tr, err){
					console.log("errorCode : " + err.code + "errorMessage : " + err.message);
				})
			})
			break;
		case "checkBusStation" :
			var selectSql = "select * from BusStation";
			var parent = $("#mainContent");
						
			db.transaction(function(tr){
				tr.executeSql(selectSql, [], function(tr, rs){
					
					// BusStation 테이블에 데이터가 있는지 확인
					var checkDbSize = rs.rows.length;
					
					if(checkDbSize > 0){
						// getMyLocation(parent, "지도용", "사용자 위치를 파악 중입니다.");
						
						// DB에 데이터가 있을 시 사용자의 위치에서 가장 가까운 정류소 파악
						getMyLocation(parent, "버스정류장", "가장 가까운 정류소를 찾는 중입니다.");
						
					
					}else{
						// DB에 데이터가 없을 시 정류장 데이터 삽입
						insertDB("BusStation");
					}
					
				}, function(tr, err){
					console.log("errorCode : " + err.code + "errorMessage : " + err.message);
				});
			})
			break;
		case "searchBusStation":
			var findNm=$("#searchStationTextField").val();
			$("#stationListView").empty();
			
			db.transaction(function(tr){
				var selectSQL = "select * from BusStation where stName like ?";
				
				tr.executeSql(selectSQL, ["%"+findNm+"%"], function(tr, rs){
					console.log(rs);
					
					if(rs.rows.length == 0){
						alert("일치하는 정류장이 없습니다.");
						return;
					}
					
					$(rs.rows).each(function(i, obj) {
						var stNm = obj.stName;
						var stId = obj.stId;
						var stNo = obj.stNo;
						
						$("#stationListView").append("<li class='stationInfo'><a href='#StationBusInfo'>"+
								stNm+"</a><span class='nodeID'>"+
								stId+"</span><span class='nodeNo'>"+
								stNo+"</span></li>");
					});
					
					$("#stationListView").listview("refresh");
					
				}, function(tr, err){
					console.log(err.code+', '+err.message);
				});
			})
			break;
		case "searchUserStation":
			$("div#BookMarContent ul#stationListView").empty();
			
			db.transaction(function(tr){
				var selectSQL = "select * from UserStation";
				
				tr.executeSql(selectSQL, [], function(tr, rs){
					console.log(rs);
					
					if(rs.rows.length == 0){
						alert("즐겨찾는 정류소가 존재하지 않습니다.");
					}					
					
					$(rs.rows).each(function(i, obj) {
						var stNm = obj.stName;
						var stId = obj.stId;
						var stNo = obj.stNo;
						
						$("div#BookMarContent ul#stationListView").append("<li class='stationInfo'><a href='#BookMarkSub'>"+
								stNm+"</a><span class='nodeID'>"+
								stId+"</span><span class='nodeNo'>"+
								stNo+"</span></li>");
					});
					
					$("div#BookMarkMain div#BookMarContent ul#stationListView").listview("refresh");
				}, function(tr, err){
					console.log(err.code+', '+err.message);
				});
			})
			
			break;
		case "alarmStationNode":
			db.transaction(function(tr){
				var selectSQL="select stNo from BusStation where stId=?";
				var parent = $("#BookMarkMapDiv");
				
				tr.executeSql(selectSQL,[stNodeId],function(tr,rs){
					console.log(rs);
					
					stNodeNo=rs.rows[0].stNo;
					
					if(stNodeNo == "" || stNodeNo == null){
						if(btnType == 1){
							alert("정류장 위치를 표시할 수 없는 정류장입니다.");
							stopLoading(parent);
							location.replace("#routePage");
							return;
						}else{
							alert("도착알림을 받을 수 없는 정류장입니다.");
							clearInterval(intervalId);
							$(".arriveOnOff").prop("checked",false);
							$(".arriveOnOff").flipswitch().flipswitch("refresh");
							return;
						}
						
					}
					
					if(btnType == 1){
						stationLocation(stNodeNo, parent);
					}else{
						alarmStationLocation();
					}
					
				},function(tr,err){
					alert(err.code+', '+err.message);
				})
			});
			break;
	}
}

function deleteDB(){
	var deleteId=$("#stName").find(".nodeID").text();
	db.transaction(function(tr){
		var deleteSQL="delete from UserStation where stId=?";
		tr.executeSql(deleteSQL,[deleteId],function(tr,rs){
			alert("즐겨찾기에서 삭제 되었습니다.");
			$("div#BookMarkMain div#BookMarContent ul#stationListView").listview("refresh");
			location.href="#BookMarkMain";
			location.reload();
		});
	});
}

function updateDB(){
	
}


