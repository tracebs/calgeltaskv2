define(['jquery'], function($){
	//====================================================
	//calgelvidget2
    var CustomWidget = function () {
    	var self = this;

    	var ddnumber;
		var daynum;
		var monthnum;
		var yearnum;
		var zfullname;
		var wdays;
		var zprice;
		var requisite;


		this.callbacks = {
			render: function(){
				//console.log('render'); test 7zip
				w_code = self.get_settings().widget_code; //в данном случае w_code='new-widget'
				var template = '<div><div class="whitebackground"><div class="widgetback1">'+
					'Описание задачи'+
					'</div><hr>'+
					'<textarea id="linkfield26" class="widgetta1"></textarea><br />'+					
					'<div>'+
					'Ответственный:&nbsp;'+
					'<select size="1" name="people2601" id="people2601">'+
					'<option>Алексей Козлов</option>'+
					'<option>Марина Холупцева</option>'+
					'</select>'+
					'</div>'+
					'Дата:&nbsp;'+
					'<div class="card-cf-value-wrapper cf-readonly js-cf-readonly">'+
					'<div class="">'+
					'<span class="date_field_wrapper card-cf-common">'+
					'<span class="date_field_wrapper--calendar icon icon-calendar-2"></span>'+
					'<input class="date_field" id="widgetdate26" type="text" name="datainput"  value="" placeholder="Дата" />'+
					'</span></div></div>'+
					'Укажите время:</br>'+
					'<table id="widgettable2"><tr>'+
					'<td>Начало</td><td><input type="text" class="widgettime1class" id="timeh1" size="2" maxlength="2" value="10">:'+
					'<select class="widgettime1class" id="timem1" size="1"><option>00</option><option>30</option></select></td>'+
					'</tr><tr>'+
					'<td>Окончание</td><td><input type="text" class="widgettime1class" id="timeh2" size="2" maxlength="2" value="10">:'+
					'<select class="widgettime1class" id="timem2" size="1"><option>00</option><option>30</option></select></td>'+					
                    '</tr></table>'+
					'<center><button class="button-input" class="widgetbutton1" id="createtaskv2btn">Создать задачи</button></center>'+											
					'</div>'+
                    '<div id="parsehtml26"></div>'+
                    '</div>'+	
					'<a href="https://calgelacademy.amocrm.ru/contacts/detail/27773516">Задачи</a>'+
					'<link type="text/css" rel="stylesheet" href="/upl/'+w_code+'/widget/style.css" >';

                self.render_template({
                    caption:{
                        class_name:'js-ac-caption',
                        html:''
                    },
                    body:'',
                    render :  template
                });
				//простановка версии виджета в div id=#parsehtml
				$jsonurl = '/upl/'+w_code+'/widget/manifest.json';
				$.getJSON( $jsonurl, function( data ) {
					vers19011 = data.widget.version;
					$('#parsehtml26').html('v.'+vers19011);					
				});
				return true;
			},
			init: function(){

				return true;
			},
			bind_actions: function(){
				$('#createtaskv2btn').on('click', function(){
					//id контакта к которому нужно привязать 27773516 имя "Занятость"
					contactid = "27773516";
					self.callbacks.getData();
					console.log('createtaskv2');
					//console.log('OnClick-Send-Post data ddnumber -'+self.ddnumber+":");
					//task_type = 1 - follow up
					//var date = new  Date(2015, 11, 25, 23, 59, 59); //всегда помним что в JS месяцев с 0 по 11 иначе уносит в будущее:)
					
					console.log('Start-OnClick-createtaskv2 - readyto send post');
					//создаем задачу followup c датой из виджета и временем = время начала из виджета
					var jsonstr = "";
					var norefresh = false;
					tasks1 = "";
					//Текст задачи
					tasktext = $('#linkfield26').val();
					
					//Ответственный
					ruserid = $('#people2601').val();
					console.log('createtaskv2 - people2601:'+ruserid);
					if (ruserid=='Алексей Козлов') {
						ruserid ='622965';
					} else if (ruserid=='Марина Холупцева') {
						ruserid ='622977';
					} 
					//дата из виджета
					var widgetdate = new Date();
					amodatestr=$('#widgetdate26').val();
					amodate = amodatestr.split(".");
					var intValue3 = parseInt(amodate[1]);
					amodate[1]=""+(intValue3-1);
					//время начала из виджета
					var time1h = $('#timeh1').val();
					var time1m = $('#timem1').val();
					var intValue = parseInt(time1h);
					if (isNaN(intValue)) {
						alert("Время начала должно быть числом!");
						return false;
					}
					if ((intValue>=0)&&(intValue<24)) {
						
					} else {						
						alert("Время начала: Часы должны быть в диапазоне от 0 до 23!");
						return false;
					}
					//время окончания из виджета
					var time2h = $('#timeh2').val();
					var time2m = $('#timem2').val();
					var intValue2 = parseInt(time2h);
					if (isNaN(intValue2)) {
						alert("Время окончания должно быть числом!");
						return false;
					}
					if ((intValue2>=0)&&(intValue2<24)) {
						
					} else {						
						alert("Время окончания:Часы должны быть в диапазоне от 0 до 23!");
						return false;
					}
					if (time2m=='30') {
						if (intValue2>=intValue) {
						} else {
							alert("Время окончания Должно быть больше начала.");
							return false;
						}	
					} else {
						if (intValue2>intValue) {
						} else {								
							alert("Время окончания Должно быть больше начала.");
							return false;
						}
					}
					console.log('createtaskv2 time NEW4:'+time1h+time1m+" - "+time2h+time2m);
					//формируем дату - время для followup
					var today = new Date();					
					var followupdate = new Date(amodate[2],amodate[1],amodate[0],time1h,time1m);
					followupdate.setMinutes(followupdate.getMinutes()+30);
					console.log("followup dt:"+followupdate.toString());
					var tilltime = Math.round(followupdate.getTime()/1000);
					//tilltime = tilltime - 10800+86399;
					//тип задачи занятость = 184236
					tasks1 = tasks1 + '{"element_id":'+contactid+',"element_type":1,"task_type":1,"text":"'+ tasktext+'","responsible_user_id":'+ruserid+',"complete_till":'+ tilltime+'},';
					//tasks1 = tasks1 + '{"element_id":'+self.leadid+',"element_type":2,"task_type":1,"text":"'+ tasktext+'","responsible_user_id":'+ruserid+',"complete_till":'+ tilltime+'},';
					//tasks1 = tasks1 + '{"task_type":1,"text":"'+ tasktext+'","responsible_user_id":'+ruserid+',"complete_till":'+ tilltime+'},';
					//Отрезаем запятую с конца
					intleng = tasks1.length - 1;
					tasks1 = tasks1.substring(0,intleng);
					tasks1 = '{"request":{"tasks":{"add":['+tasks1+']}}}';
					//console.log("OnClick-createtaskv2:" + tasks1);
					jobj = JSON.parse(tasks1);
					//console.log("Start POST new2");
					strjdon12 = "" + JSON.stringify(jobj);
					console.log("OnClick-createtaskv2:" + strjdon12);
					//создание задач пачкой
					$.post(
						"https://calgelacademy.amocrm.ru/private/api/v2/json/tasks/set",
						jobj,
						function( data ) {
							console.log( 'Res:'+JSON.stringify(data) );
						},
						"json"
					);
					
					//создаем задачи с типом занятость c датой из виджета и временем = от время начала из виджета до время окончания из виджета
					tasks2 = "";
					var followupdate2 = new Date(amodate[2],amodate[1],amodate[0],time2h,time2m); //окончание
					dateflag = true;
					addmin = 30;
					i26 = 1;
					while (dateflag==true) {
						
						followupdate.setMinutes(followupdate.getMinutes()+30);
						str2=followupdate2.toString();
						//console.log( 'date2:'+str2 );
						str1=followupdate.toString();
						console.log( 'getminutes:'+followupdate.getMinutes()+'minutes:'+addmin+" str1:"+str1+" str2:"+str2 );
						//console.log( 'date1:'+str1 );
						var tilltime = Math.round(followupdate.getTime()/1000);
						//tasktext = ""+i26;
						tasktext = "x";
						tasktype = '184758'; //Завершить
						tasktype = '184761'; //Занятость
						tasks2 = tasks2 + '{"element_id":'+contactid+',"element_type":1,"task_type":'+tasktype+',"text":"'+ tasktext+'","responsible_user_id":'+ruserid+',"complete_till":'+ tilltime+'},';
						//tasks2 = tasks2 + '{"element_id":'+self.leadid+',"element_type":2,"task_type":184761,"text":"'+ tasktext+'","responsible_user_id":'+ruserid+',"complete_till":'+ tilltime+'},';
						if (str1==str2) {
							dateflag=false;
						} else {
							i26 = i26 + 1;
							addmin = addmin + 30;
						}
						if (addmin>600) {
							dateflag=false;
						}
						
					}
					intleng1 = tasks2.length - 1;
					tasks2 = tasks2.substring(0,intleng1);
					tasks2 = '{"request":{"tasks":{"add":['+tasks2+']}}}';
					//console.log("OnClick-createtaskv2:" + tasks1);
					jobj2 = JSON.parse(tasks2);
					//создание задач пачкой
					$.post(
						"https://calgelacademy.amocrm.ru/private/api/v2/json/tasks/set",
						jobj2,
						function( data2 ) {
							console.log( 'Res2:'+JSON.stringify(data2) );
						},
						"json"
					);
					//tasks1 = tasks1 + '{"element_id":'+self.leadid+',"element_type":2,"task_type":184236,"text":"'+ tasktext+'","responsible_user_id":'+ruserid+',"complete_till":'+ tilltime+'},';
					console.log('Finish-createtaskv2 res='+followupdate.toString());
					alert('Задачи созданы.');
					//var msg   = $('#task').serialize();
					//$.ajax({
					//	type: 'POST',
					//	url: 'https://calgelacademy.amocrm.ru/ajax/todo/multiple/add/',
					//	data: msg,
					//	success: function(data1) {
					//		console.log( 'SendTask:'+JSON.stringify(data1) );            
					//	},
					//	error:  function(xhr, str){
					//		alert('Возникла ошибка: ' + xhr.responseCode);
					//	}        
					//});
					//console.log('Finish-createtaskv2 final');

				});

				//console.log(self.system().area);


				return true;
			},
			settings: function(){

				return true;
			},
			onSave: function(){

				return true;
			},
			destroy: function(){

			},
			contacts: {
					//select contacts in list and clicked on widget name
					selected: function(){

					}
				},
			leads: {
					//select leads in list and clicked on widget name
					selected: function(){

					}
				},
			tasks: {
					//select taks in list and clicked on widget name
					selected: function(){

					}
				},
			getData: function(){
					console.log('StartGetData');
					self.ddnumber = $('input[name="CFV[813270]"]').val();
					var today = new Date();
					self.daynum = "" + today.getDate();
					self.monthnum = "" + (today.getMonth()+1); //January is 0!
					self.yearnum = "" + today.getFullYear();
					self.startdogdate = $('input[name="CFV[685758]"]').val(); //дата начала обучения
					
					self.leadid = $('input[name="lead_id"]').val(); //id сделки lead_id
					
					self.zfullname = $('input[name="contact[NAME]"]').val();
					tmpwdays = $('input[name="CFV[813354]"]').val();
					if (tmpwdays=='1948330') {
						self.wdays = 2;
						self.zprice = 7800;
					} else if (tmpwdays=='1948332') {
						self.wdays = 10;
						self.zprice = 25800;
					} else if (tmpwdays=='1948334') {
						self.wdays = 21;
						self.zprice = 45800;
					} else {

					}
					self.requisite = $('textarea[name="CFV[813368]"]').val();
					console.log('FinishGetData');
			},
			updateTextarea: function(txt, msg){
				console.log('UpdateTextArea');
				$('#send_result').html("");
				var restxt =txt+" ";
				restxt = restxt+" : ";
				restxt = restxt+msg.dl_link;
				$('.note-edit__body > textarea').trigger('focusin').val(restxt);
				$('.note-edit__actions__submit').removeClass('button-input-disabled').trigger('click');
			},
			updateLink: function(msg){
				console.log('UpdateLink v1:');
				$('#send_result').html("");
				var restxt = "" + msg.dl_link;
				console.log('UpdateLink v2:' + restxt);
				$('input[name="CFV[813398]"]').val(restxt);
			},
			checkdate2812: function(dat1,jsonstr) {
				//console.log( 'checkdate2812  dat1: ' + dat1 + ' json: '+jsonstr);
				var mnum1 = "" + (dat1.getMonth()+1);
				var ynum1 = "" + dat1.getFullYear();
				//console.log( 'checkdatestart mnum: ' + mnum1 + ' ynum: ' + ynum1);
				obj = $.parseJSON( jsonstr );
				//console.log( 'checkdatefor1:'+JSON.stringify(obj.data["2003"]["1"]));
				sourcestr1 = JSON.stringify(obj.data[ynum1][mnum1]);
				searchstr1 = '"'+ dat1.getDate() + '":{"isWorking":2}';
				if(sourcestr1.indexOf(searchstr1)>=0) {
					return false;
					//console.log( 'dat1 - выходной');
				} else {
					//return true;
					//console.log( 'dat1 - рабочий день');
					if ((dat1.getDay()==0) || (dat1.getDay()==6)) {
						//это вокресенье или суббота
						return false;
						//console.log( 'dat1 - рабочий день');
					} else {
						return true;
						//console.log( 'dat1 - рабочий день');
					}
				}
				//console.log( 'checkdate2812  finish');
			},
			getnext2812: function(dat2,jsonstr) {
				//console.log( 'getnext2812:'+ dat2.getDay()); //sunday = 0
				dat2.setDate(dat2.getDate() + 1);
				var mnum2 = "" + (dat2.getMonth()+1);
				var ynum2 = "" + dat2.getFullYear();

				obj2 = $.parseJSON( jsonstr );
				//console.log( 'checkdatefor1:'+JSON.stringify(obj2.data["2003"]["1"]));
				sourcestr2 = JSON.stringify(obj2.data[ynum2][mnum2]);
				searchstr2 = '"'+dat2.getDate()+'":{"isWorking":2}';
				if(sourcestr2.indexOf(searchstr2)>=0) {
					newdat = self.callbacks.getnext2812(dat2,jsonstr);
					return newdat;
					//console.log( 'dat2 - выходной');
				} else {
					if ((dat2.getDay()==0) || (dat2.getDay()==6)) {
						//это вокресенье или суббота
						newdat = self.callbacks.getnext2812(dat2,jsonstr);
						return newdat;
						//console.log( 'dat2 - рабочий день');
					} else {
						return dat2;
						//console.log( 'dat2 - рабочий день');
					}
				}

			}
		};
		return this;
    };


return CustomWidget;
});