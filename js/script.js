var debug = false;
var num=[],mynum=[],ans=[];
var tempi,tempj,lasti=-1,lastj=-1;
var gameCanvas,context;
var count;
var n=[1,2,3,4,5,6,7,8,9];
var music_switch_flag=0;
var degree_index=1,guanka_index=1;//默认难度为1的第1关，hard=1-3表示3种难度

function init(){
	gameCanvas = document.getElementById("gameCanvas");
	context = gameCanvas.getContext('2d');
	draw();
	initArray();
	dateInit();
	display9num();
	gameCanvas.onclick=function(e){
		play(e);
	}
	settingBtn = document.getElementById("settingBtn");
	settingBtn.onclick=function(e){
		showSetPanel();
	}
	show_rank = document.getElementById("show_rank");
	show_rank.onclick=function(e){
		showRankPanel();
	}
	setInterval(refreshTime, 1000);
}	

var playtime = 0;
//计时
function refreshTime(){
	playtime ++;
	usetime_1 = document.getElementById("usetime");
	usetime_1.innerHTML = playtime;
}

function play(e){
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/50);
	var j=Math.floor(y/50);
	context.save();
	//清楚原有的背景颜色
	context.fillStyle="#fff";//#fff是白色
	context.fillRect(0,0,450,450);
	tempi=i;tempj=j;
	
	//如果点击的是同一地方，且为mynum，则擦除该数
	if(lasti==i && lastj==j && num[i][j]==0 && mynum[i][j]!=0){
		context.fillStyle="#fff";
		mynum[i][j]=0;
		context.fillRect(50*i+1,50*j+1,48,48);
	}
	
	//如果不是数字，则背景颜色是绿色
	else if(num[i][j]==0 && mynum[i][j]==0){		
		context.fillStyle="#0f0";
		context.fillRect(50*i+1,50*j+1,48,48);			
	}
	//如果是数字，则该数字显示红色，其他相同数字显示黄色
	else{
		var clickNum=num[i][j]+mynum[i][j];
		context.fillStyle="#f00";
		context.fillRect(50*i+1,50*j+1,48,48);
		for(var ii=0;ii<9;ii++){
			for(var jj=0;jj<9;jj++){
				if ( (clickNum==num[ii][jj] || clickNum==mynum[ii][jj]) && !(i==ii && j==jj) ){
					context.fillStyle="#ff0";
					context.fillRect(50*ii+1,50*jj+1,48,48);
				}
			}
		}
	}
	lasti=i;lastj=j;
	context.restore();
	draw();
	dateInit();
	//addDate();
	showMyNum();
}

function draw(){
	gameCanvas = document.getElementById("gameCanvas");
	context = gameCanvas.getContext('2d');
	context.beginPath();
	context.strokeStyle = '#666';
	//画粗线条
	context.lineWidth='4';
	for(var i=0;i<4;i++){
		context.moveTo(i*150,0);
		context.lineTo(i*150,450);
		context.moveTo(0,i*150);
		context.lineTo(450,i*150);
	}
	context.stroke();
	//画细线条
	context.lineWidth='2';
	for(var i=0;i<3;i++){
		context.moveTo(i*150+50,0);
		context.lineTo(i*150+50,450);
		context.moveTo(i*150+100,0);
		context.lineTo(i*150+100,450);
		context.moveTo(0,i*150+50);
		context.lineTo(450,i*150+50);
		context.moveTo(0,i*150+100);
		context.lineTo(450,i*150+100);
	}
	context.stroke();	
}

function dateInit(){	
	//设定关卡
	level(degree_index,guanka_index);
	context.font="900 30px Verdana";
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if (0!=num[i][j]){
				context.fillText(num[i][j]+"", 15+i*50, 35+j*50);
			}
		}
	}
}

function initArray(){
	for(var i=0;i<9;i++){
		num[i]=[];
		mynum[i]=[];
		ans[i]=[];
		for(var j=0;j<9;j++){
			num[i][j]=0;
			mynum[i][j]=0;
			ans[i][j]=0;
		}
	}
}

function display9num(){
	numCanvas = document.getElementById("numCanvas");
	context2 = numCanvas.getContext('2d');
	context2.strokeStyle = '#666';
	//画竖线
	context.lineWidth='4';
	for(var i=0;i<=9;i++){
		context2.moveTo(i*50,0);
		context2.lineTo(i*50,50);
	}	
	//画横线
	for(var i=0;i<=1;i++){
		context2.moveTo(0,i*50);
		context2.lineTo(450,i*50);
	}
	context2.stroke();
	//显示数字
	context2.font="bold 28px 微软雅黑";
	for(var i=0;i<9;i++){
		context2.fillText(n[i]+"", 15+i*50, 35);
	}
	numCanvas.onclick=function(e){
		add9num(e);
	}
}

function add9num(e){
	var x=e.offsetX;
	var i=Math.floor(x/50);
	//如果是给玩家填的数
	if(num[tempi][tempj]==0){
		if(mynum[tempi][tempj]==0){
			context.font="100 28px Verdana";	
			context.fillText(n[i]+"", 15+tempi*50, 35+tempj*50);
			mynum[tempi][tempj]=n[i];	
			//改背景颜色
			context.save();
			context.fillStyle="#f00";
			context.fillRect(50*tempi+1,50*tempj+1,48,48);
			for(var ii=0;ii<9;ii++){
				for(var jj=0;jj<9;jj++){
					if ( (n[i]==num[ii][jj] || n[i]==mynum[ii][jj]) && !(tempi==ii && tempj==jj) ){
						context.fillStyle="#ff0";
						context.fillRect(50*ii+1,50*jj+1,48,48);
					}
				}
			}
			context.restore();
			dateInit();
			showMyNum();
			if(debug || isWin()){
				//alert("win");
				showSetName();
			}
		}
	}
}

function isWin(){
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if(mynum[i][j] != ans[i][j])
				return false;
		}
	}
	return true;
}

function showMyNum(){
	context.save();
	context.font="100 28px Verdana";
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if (0!=mynum[i][j]){
				context.fillText(mynum[i][j]+"", 15+i*50, 35+j*50);
			}
		}
	}
	context.restore();	
}

function showSetPanel(){
	settingPanel = document.getElementById("settingPanel");
	settingPanel.style.display="block";
	//设置背景音乐
	var audio = document.getElementsByTagName("audio")[0];
	music_switch = document.getElementById("music_switch");
	music_switch.onclick=function(){
		if(music_switch_flag == 0){
			music_switch.src="image/on_music.jpg";
			music_switch_flag=1;
			audio.play();
		}
		else{
			music_switch.src="image/off_music.jpg";
			music_switch_flag=0;
			audio.pause();
		}		
	}
	//取消
	cancel = document.getElementById("cancel");
	cancel.onclick=function(){
		settingPanel.style.display="none";
	}
	//确定
	confirm = document.getElementById("confirm");
	confirm.onclick=function(){
		//选择难度和关卡
		degree = document.getElementById("degree");
		var degree_index_temp=degree.selectedIndex+1;
		guanka = document.getElementById("guanka");
		var guanka_index_temp=guanka.selectedIndex+1;
		//如果改变难度
		if(degree_index!=degree_index_temp || guanka_index!=guanka_index_temp){
			degree_index=degree_index_temp;
			guanka_index=guanka_index_temp;
			restart();
		}
		settingPanel.style.display="none";
	}
}

function showRankPanel(){
	rankPanel = document.getElementById("rankPanel");
	rankPanel.style.display="block";
	//加载排行数据
	loadRankData();
	//关闭
	close_rank = document.getElementById("close_rank");
	close_rank.onclick=function(){
		rankPanel.style.display="none";
	}
	
}

//设置名字
function showSetName(){
	setNamePanel = document.getElementById("setNamePanel");
	setNamePanel.style.display="block";
	//取消
	cancel = document.getElementById("input_name_cancel");
	cancel.onclick=function(){
		setNamePanel.style.display="none";
	}
	//确定
	confirm = document.getElementById("input_name_confirm");
	confirm.onclick=function(){
		//获取名字
		input_name = document.getElementById("input_name");
		name = input_name.value;
		if (isEmpty(name)) {
			alert("请输入名字！")
			return;
		}
		sendScore3(name);
		//alert(name + ",time:"+playtime);
		setNamePanel.style.display="none";
		restart();
	}
}

//字符串判空
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj.length == ""){
		console.log("no input")
        return true;
    }else if(obj.match(/^[ ]+$/)){
		console.log("all space")
        return true;
    }else if(obj.match(/^\s+$/)){
		console.log("all space or \\n")
        return true;
    }else{
        return false;
    }
}

//发送请求
function sendScore(){
	var xmlhttp;
	if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.withCredentials = true; // 设置运行跨域操作
	xmlhttp.open("POST","http://139.224.13.102:89/insert",true);
	xmlhttp.send("name=rs&usetime=32");
	//监听服务端
    xmlhttp.onreadystatechange=function () {
		if (xmlhttp.readyState ==4 && xmlhttp.status ==200){
			alert(xmlhttp.responseText);
			alert(typeof xmlhttp.responseText)
		} else {
			alert("请求失败");
		}
	}
}

function sendScore2(){
	console.log("33333333333");  
	$.get("http://139.224.13.102:89/insert?name=rs&usetime=32",function(data,status){
		alert("Data: " + data + "\nStatus: " + status);
	});
	
	$.post("http://139.224.13.102:89/insert",{
		name:"Donald Duck",
		usrtime:23
	},function(data,status){
		alert("Data: " + data + "\nStatus: " + status);
	});
	
	$.ajax({  
		url : 'http://139.224.13.102:89/insert?name=rs&usetime=32',  
		xhrFields: {  
		withCredentials: true // 设置运行跨域操作  
	},  
	success : function(data) {  
		console.log(data);  
	}  
	});
  
}

function sendScore3(name) {    
	$.ajax({          
		type:  'GET',
		url:   "http://47.104.244.239:5000/api/insert/" + name + "/" + playtime,
		dataType: 'script',              
		success: function(res){
			alert('上传成功');
		}
	 });
}

function loadRankData(){
	$.ajax({          
		type:  'GET',
		url:   'http://47.104.244.239:5000/api/rank',
		dataType: 'jsonp',
		jsonpCallback:"showData",
		jsonpCallback: "handleCallback",        
		success: function(res){
			showData(res);
		},
		error: function(res){
			console.log("error" + res.name);
		}
	 });
}

//回调函数
 function showData (result) {
	var data = JSON.stringify(result); //json对象转成字符串
	console.log(data);
	
	setNamePanel = document.getElementById("rank_content");
	var content = "";
	var lenght = result.data.length;
	for(var i=0; i<lenght; i++) {
		//console.log("name:" + result[i].name);
		//console.log("time:" + result[i].usetime);
		content = content + result.data[i].name + ":" + result.data[i].score + "<br />";
		console.log(content);
		setNamePanel.innerHTML = content;
	}
 }

function restart(){
	context.clearRect(0,0,450,450);
	draw();
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			mynum[i][j] = 0;
		}
	}
	dateInit();
	playtime = 0;
}

window.onload = function(){
	init();
};

