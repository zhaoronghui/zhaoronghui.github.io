//定义tanke类
//x表示横坐标，y表示纵坐标，direct表示方向 规定 0:向上，1表示向右，2表示向下，3表示向左

//为了编程方面，定义两个颜色数组
var heroColor=new Array("#BA9658","#FEF26E");
var EnemyColor=new Array("#00A2B5","#00FEFE");
//其他的敌人坦克
//定义一个炸弹类
function Bomb(x,y){
	this.x=x;
	this.y=y;
	this.isLive=true; //炸弹是否活的，默认true;
	//炸弹有一个生命值
	this.blood=9;
	//减生命值
	this.bloodDown=function(){
		if(this.blood>0){
			this.blood--;
		}else{
			//说明炸弹死亡
			this.isLive=false;
		}
	}
}

//子弹类
//type表示：这颗子弹是敌人的，还是自己的
//tank表示对象，说明这颗子弹，属于哪个坦克.
function Bullet(x,y,direct,speed,type,tank){
	this.x=x;
	this.y=y;
	this.direct=direct;
	this.speed=speed;
	this.timer=null;
	this.isLive=true;
	this.type=type;
	this.tank=tank;
	this.run=function run(){
		//在改变这个子弹的坐标时，我们先判断子弹是否已到边缘
		//子弹不前进，有两个逻辑，1.碰到边界，2. 碰到敌人坦克.
		if(this.x<=0||this.x>=400||this.y<=0||this.y>=300){
			//子弹要停止
			window.clearInterval(this.timer);
			this.isLive=false;
			if(this.type=="enemy"){
				this.tank.bulletIsLive=false;
			}
		}else{
				//这个可以去修改坐标
			switch(this.direct){
				case 0:
					this.y-=this.speed;
					break;
				case 1:
					this.x+=this.speed;
					break;
				case 2:
					this.y+=this.speed;
					break;
				case 3:
					this.x-=this.speed;
					break;
			}
		}
	}
}
//这是坦克类
function Tanke(x,y,direct,color){
	this.x=x;
	this.y=y;
	this.speed=1;
	this.isLive=true;
	this.direct=direct;
	//一个坦克需要两个颜色
	this.color=color;

	this.moveUp=function(){
		this.y-=this.speed;
		this.direct=0;
	}
	this.moveRight=function(){
		this.x+=this.speed;
		this.direct=1;
	}
	this.moveDown=function(){
		this.y+=this.speed;
		this.direct=2;
	}
	this.moveLeft=function(){
		this.x-=this.speed;
		this.direct=3;
	}
}
//定义hero类
function Hero(x,y,direct,color){
	//通过对象冒充达到继承效果
	this.tanke=Tanke;
	this.tanke(x,y,direct,color);
	//增加一个函数射击坦克
	this.shotEnemy=function(){
		//创建子弹，与hero的位置，方向有关系
		//this.x就是当前hero的横坐标 this.y就是当前hero的纵坐标
		switch(this.direct){
			case 0:
				heroBullet=new Bullet(this.x+9,this.y,this.direct,1);
				break;
			case 1:
				heroBullet=new Bullet(this.x+30,this.y+9,this.direct,1);
				break;
			case 2:
				heroBullet=new Bullet(this.x+9,this.y+30,this.direct,1);
				break;
			case 3:
				heroBullet=new Bullet(this.x,this.y+9,this.direct,1);
				break;
		}
		//把这个子弹中放入到数组中->push函数
		heroBullets.push(heroBullet);
		//让子弹飞起来。
		//
		var timer=window.setInterval("heroBullets["+(heroBullets.length-1)+"].run()",50);
		//把这个timer赋给这个子弹(对象是引用传递)
		heroBullets[heroBullets.length-1].timer=timer;
	}
}
//定义一个EnemyTank类
function EnemyTank(x,y,direct,color){
	//通过对象冒充达到继承效果
	this.tanke=Tanke;
	this.count=0;
	this.bulletIsLive=true;
	this.tanke(x,y,direct,color);
	this.run=function run(){
			
			//判断敌人的坦克当前方向
			switch(this.direct){
				
				case 0:
					if(this.y>0){
						this.y-=this.speed;
					}	
					break;
				case 1:
					if(this.x+30<400){
						this.x+=this.speed;
					}
					break;
				case 2:
					if(this.y+30<300){
						this.y+=this.speed;
					}
					break;
				case 3:
					if(this.x>0){
						this.x-=this.speed;
					}
					break;
			}
			//改变方向,走30次，再改变方向
			if(this.count>30){
				this.direct=Math.round(Math.random()*3);//随机生成 0,1,2,3
				this.count=0;
			}
			this.count++;

			//判断子弹是否已经死亡，如果死亡，则增加新的一颗子弹
			if(this.bulletIsLive==false){
				//增子弹,这是需要考虑当前这个敌人坦克的方向，在增加子弹
					switch(this.direct){
						case 0:
						etBullet=new Bullet(this.x+9,this.y,this.direct,1,"enemy",this);
						break;
						case 1:
						etBullet=new Bullet(this.x+30,this.y+9,this.direct,1,"enemy",this);
						break;
						case 2:
						etBullet=new Bullet(this.x+9,this.y+30,this.direct,1,"enemy",this);
						break;
						case 3: //右
						etBullet=new Bullet(this.x,this.y+9,this.direct,1,"enemy",this);
						break;
				}

				//把子弹添加到敌人子弹数组中
				enemyBullets.push(etBullet);
				//启动新子弹run
				var mytimer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",50);
				enemyBullets[enemyBullets.length-1].timer=mytimer;

				this.bulletIsLive=true;
			}

		}
}
//画出自己的子弹,这个函数也可以封装到hero类中
function drawHeroBullet(){
	//画出所有子弹
	for(var i=0;i<heroBullets.length;i++){
		var heroBullet=heroBullets[i];
		if (heroBullet!=null&&heroBullet.isLive) {
			cxt.fillStyle="#FEF26E";
			cxt.fillRect(heroBullet.x,heroBullet.y,2,2);
		}
	}
}
//这里我们还需要添加一个函数，用于画出敌人的子弹,当然，画出敌人的子弹和自己的子弹是可以合并的.
		function drawEnemyBullet(){
			
			//现在要画出所有子弹
				for( var i=0;i<enemyBullets.length;i++){
					var etBullet=enemyBullets[i];
					//这里，我们加入了一句话，但是要知道这里加，是需要对整个程序有把握
					if(etBullet.isLive){
						cxt.fillStyle="#00FEFE";
						cxt.fillRect(etBullet.x,etBullet.y,2,2);
					}
				}
		}
//绘制坦克
function drawTanke(hero){
	if(hero.isLive){
	//考虑方向
	switch(hero.direct){
		case 0://向上
		case 2://向下
			//画出自己的坦克，使用前面的绘图技术
			//设置颜色
			cxt.fillStyle=hero.color[0];
			//先画出左边的矩形（以左上角为参照点，然后画出坦克的其他部分，这样的好处是左上角的坐标变换时，坦克就整体移动）
			//画出图片是比较耗费资源的
			cxt.fillRect(hero.x,hero.y,5,30);
			//画出右边的矩形
			cxt.fillRect(hero.x+15,hero.y,5,30);
			//画出中间的的矩形
			cxt.fillRect(hero.x+6,hero.y+5,8,20);
			//画出坦克的盖子
			cxt.fillStyle=hero.color[1];
			cxt.arc(hero.x+10,hero.y+15,4,0,2*Math.PI,true);
			cxt.fill();
			//画出炮筒（直线）
			cxt.strokeStyle=hero.color[1];//设置颜色
			cxt.lineWidth=1.5;//设置线条宽度
			cxt.beginPath();//开启新路径
			cxt.moveTo(hero.x+10,hero.y+15);//笔的起始点
			if(hero.direct==0){
				cxt.lineTo(hero.x+10,hero.y);//线的终点
			}else if(hero.direct==2){
				cxt.lineTo(hero.x+10,hero.y+30);//线的终点
			}
			cxt.closePath();//
			cxt.stroke();
			break;
		case 1://向右
		case 3://向左
			//画出自己的坦克，使用前面的绘图技术
			//设置颜色
			cxt.fillStyle=hero.color[0];
			//先画出左边的矩形（以左上角为参照点，然后画出坦克的其他部分，这样的好处是左上角的坐标变换时，坦克就整体移动）
			//画出图片是比较耗费资源的
			cxt.fillRect(hero.x,hero.y,30,5);
			//画出上面边的矩形
			cxt.fillRect(hero.x,hero.y+15,30,5);
			//画出中间的的矩形
			cxt.fillRect(hero.x+5,hero.y+6,20,8);
			//画出坦克的盖子
			cxt.fillStyle=hero.color[1];
			cxt.arc(hero.x+15,hero.y+10,4,0,2*Math.PI,true);
			cxt.fill();
			//画出炮筒（直线）
			cxt.strokeStyle=hero.color[1];//设置颜色
			cxt.lineWidth=1.5;//设置线条宽度
			cxt.beginPath();//开启新路径
			cxt.moveTo(hero.x+15,hero.y+10);//笔的起始点
			if(hero.direct==1){
				cxt.lineTo(hero.x+30,hero.y+10);//线的终点
			}else if(hero.direct==3){
				cxt.lineTo(hero.x,hero.y+10);//线的终点
			}
			cxt.closePath();//
			cxt.stroke();
			break;
		}
	}
	}
//编写一个函数，专门用于判断我的子弹，是否击中了某个敌人坦克
function isHitEnemyTank(){
	
		//取出每颗子弹
		for(var i=0;i<heroBullets.length;i++){
			
				//取出一颗子弹
				var heroBullet=heroBullets[i];
				if(heroBullet.isLive){ //子弹是活的，才去判断
				//让这颗子弹去和遍历每个敌人坦克判断
				for(var j=0;j<enemyTanks.length;j++){
					
							var enemyTank=enemyTanks[j];
						
							if(enemyTank.isLive){
							//子弹击中敌人坦克的条件是什么? 很多思路 , 韩老师的思想是
							//(看看这颗子弹，是否进入坦克所在矩形)
							//根据当时敌人坦克的方向来决定
							switch(enemyTank.direct){
								case 0: //敌人坦克向上
								case 2://敌人坦克向下
									if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+20
										&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+30){
										//把坦克isLive 设为false ,表示死亡
										enemyTank.isLive=false;
										//该子弹也死亡
										heroBullet.isLive=false;
										//创建一颗炸弹
										var bomb=new Bomb(enemyTank.x,enemyTank.y);
										//然后把该炸弹放入到bombs数组中
										bombs.push(bomb);
									}
								break;
								case 1: //敌人坦克向右
								case 3://敌人坦克向左
									if(heroBullet.x>=enemyTank.x&&heroBullet.x<=enemyTank.x+30
										&&heroBullet.y>=enemyTank.y&&heroBullet.y<=enemyTank.y+20){
										//把坦克isLive 设为false ,表示死亡
										enemyTank.isLive=false;
										heroBullet.isLive=false;

										//创建一颗炸弹
										var bomb=new Bomb(enemyTank.x,enemyTank.y);
										//然后把该炸弹放入到bombs数组中
										bombs.push(bomb);
									}
								break;

							}

						}


				}//for
			}
		}
}

//画出敌人炸弹 
function drawEnemyBomb(){
	
	for(var i=0;i<bombs.length;i++){
	
		//取出一颗炸弹
		var bomb=bombs[i];
		if(bomb.isLive){


			
			//更据当前这个炸弹的生命值，来画出不同的炸弹图片
			if(bomb.blood>6){  //显示最大炸弹图
				var img1=new Image();
				img1.src="bomb_1.gif";
				var x=bomb.x;
				var y=bomb.y;
				img1.onload=function(){
					cxt.drawImage(img1,x,y,30,30);
				}
			}else if(bomb.blood>3){
				var img2=new Image();
				img2.src="bomb_2.gif";
				var x=bomb.x;
				var y=bomb.y;
				img2.onload=function(){
					cxt.drawImage(img2,x,y,30,30);
				}
			}else {
				var img3=new Image();
				img3.src="bomb_3.gif";
				var x=bomb.x;
				var y=bomb.y;
				img3.onload=function(){
					cxt.drawImage(img3,x,y,30,30);
				}
			}

			//减血
			bomb.bloodDown();
			if(bomb.blood<=0){
				//怎么办?把这个炸弹从数组中去掉
				bombs.splice(i,1);

			}
		}
	}
}