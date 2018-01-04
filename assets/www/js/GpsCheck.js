function checkAvailability(){
    cordova.plugins.diagnostic.isGpsLocationAvailable(function(available){
        console.log("GPS location is " + (available ? "available" : "not available"));
        if(!available){
        	// 위치 정보가 비활성화 상태에서는 설정 여부를 체크 함
           checkAuthorization();
        }else{
        	// 위치 정보가 활성화 된 경우에는 바로 즐겨찾기 정류소를 찾음
        	selectDB("checkUserStation");
            console.log("GPS location is ready to use");
        }
    }, function(error){
        console.error("The following error occurred: "+error);
    });
}

function checkAuthorization(){
    cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
        console.log("Location is " + (authorized ? "authorized" : "unauthorized"));
        if(authorized){
            checkDeviceSetting();
        }else{
            cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
                switch(status){
                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                        console.log("Permission granted");
                        checkDeviceSetting();
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                        console.log("Permission denied");
                        // User denied permission
                        break;
                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                        console.log("Permission permanently denied");
                        // User denied permission permanently
                        break;
                }
            }, function(error){
                console.error(error);
            });
        }
    }, function(error){
        console.error("The following error occurred: "+error);
    });
}

function checkDeviceSetting(){
    cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
        console.log("GPS location setting is " + (enabled ? "enabled" : "disabled"));
        if(!enabled){
            cordova.plugins.locationAccuracy.request(function (success){
                console.log("Successfully requested high accuracy location mode: "+success.message);
                // 여기가 GPS활성화를 했을경우(확인을 선택경우)
                
                // 확인을 클릭 시 즐겨찾기 정류장 여부 확인
                selectDB("checkUserStation");
                       
            }, function onRequestFailure(error){
                //여기는 GPS활성화를 안했을경우(취소를 선택한경우)
                //geolocation API 사용하면 안됨.
            	
            	alert("위치를 활성화시킨 후 다시 시도해주세요.")
            	
                console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
                if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                    if(confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                        cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                }
            }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }
    }, function(error){
        console.error("The following error occurred: "+error);
    });
}