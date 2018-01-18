({
	doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    
    selectAll: function(component,event, helper){         
        var slctCheck = event.getSource().get("v.value"); 
        var stagename = event.getSource().get("v.text");
        var getCheckAllId = component.find("cboxRow");
        var totalCount = 0;
        if (slctCheck == true) {
            for (var i = 0; i < getCheckAllId.length; i++) {
                if(event.getSource().get("v.class") == component.find("cboxRow")[i].get("v.class")){
                	component.find("cboxRow")[i].set("v.value", true);
                    totalCount = totalCount +  1;
                }
            }            
        } else {
            for (var i = 0; i < getCheckAllId.length; i++) {
                if(event.getSource().get("v.class") == component.find("cboxRow")[i].get("v.class")){
                	component.find("cboxRow")[i].set("v.value", false);
                }
            }
            
        }      
        console.log('totalCount == '+totalCount);
        if(event.getSource().get("v.class") == 'cBoxLongList'){
            var x = document.getElementsByClassName("LongListCount");
            for(var i = 0; i < x.length; i++){
                x[i].innerHTML = totalCount;
                if(x[i].innerHTML === ''){
                    x[i].innerHTML = '0';
                }
            }
        }else{
            var x = document.getElementsByClassName(stagename+"Count");
            for(var i = 0; i < x.length; i++){
                x[i].innerHTML = totalCount;
                if(x[i].innerHTML === ''){
                    x[i].innerHTML = '0';
                }
            }
        }
    },
    
    changeSelectAll:function(component,event, helper){
        var slctCheckRow = event.getSource().get("v.class");
        var slctCheckRowValue = event.getSource().get("v.value");
        var getCheckAllId = component.find("cbox");
        var totalCount = 0;
        var stagename = slctCheckRow.slice(4);
        if(event.getSource().get("v.class") == 'cBoxLongList'){
            var x = document.getElementsByClassName("LongListCount");
            for(var i = 0; i < x.length; i++){
               totalCount = x[i].innerHTML;
            }
        }else{
            var x = document.getElementsByClassName(stagename+"Count");
            for(var i = 0; i < x.length; i++){
                totalCount = x[i].innerHTML;
            }
        }
        for(var i = 0; i < getCheckAllId.length; i++){
            if(slctCheckRowValue == false && slctCheckRow == component.find("cbox")[i].get("v.class")) {
                component.find("cbox")[i].set("v.value", false);
                totalCount = totalCount - 1;
            }else if(slctCheckRow == component.find("cbox")[i].get("v.class")){
                var a = parseInt(totalCount);
                totalCount = a + 1;
            }
    	}        
        console.log('totalCount == '+totalCount);
        if(event.getSource().get("v.class") == 'cBoxLongList'){
            var x = document.getElementsByClassName("LongListCount");
            for(var i = 0; i < x.length; i++){
                x[i].innerHTML = totalCount;
                if(x[i].innerHTML === ''){
                    x[i].innerHTML = '0';
                } 
            }
        }else{
            var x = document.getElementsByClassName(stagename+"Count");
            if(x.length > 0){
                for(var i = 0; i < x.length; i++){
                    x[i].innerHTML = totalCount;
                    if(x[i].innerHTML === ''){
                        x[i].innerHTML = '0';
                    }                    
                }
            }
        }
        
    },
    
    getSelectedIds:function(component,event, helper){
		helper.updateApplicationStages(component, event, helper);
    },
    
    rejectSelectedApplication:function(component,event, helper){
		helper.rejectSelectedApplication(component, event, helper);
    },
    
    rejectApplication:function(component,event, helper){
        helper.rejectApplication(component, event, helper);
    },
    showModal : function(component, event, helper) {  
        var recordid = event.currentTarget.getAttribute("data-recId");
        document.getElementById("recordDisplayDiv"+recordid).style.display = "block";
    },
    
    hideModal : function(component,event, helper){
       var recordid = event.currentTarget.getAttribute("data-recId");
       document.getElementById("recordDisplayDiv"+recordid).style.display = "none" ;
   },
})