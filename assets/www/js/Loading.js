// 로딩 시작 함수
// 로딩 화면을 추가할 곳의 부모와 로딩 아래에 표시한 텍스트를 매개변수로 받음
function startLoading(parent, text, textColor){
	var $div = $("<div>");
	$div.addClass("loading");
	
	var $span = $("<span>");
	$span.addClass("ouro ouro3");
	
	var $span1 = $("<span>");
	$span1.addClass("left");
	
	var $span2 = $("<span>");
	$span2.addClass("anim");
	
	var $span3 = $("<span>");
	$span3.addClass("right");
	
	var $span4 = $("<span>");
	$span4.addClass("anim");
	
	var $p = $("<p>");
	if(textColor == "white"){
		$p.text(text);
	}else{
		$p.css("color", "#3b8686");
		$p.text(text);
	}
	
	$span1.append($span2);
	$span3.append($span4);
	$span.append($span1).append($span3);
	
	$div.append($span).append($p);
	
	parent.prepend($div);
}

// 로딩 끝 함수
// 로딩 화면을 호출하고 있는 부모 태그를 매개변수로 받음
function stopLoading(parent){
	parent.find(".loading").remove();
}