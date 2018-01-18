({
	doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    
    selectAllLongList: function(component,event, helper){
        //alert(event.getSource().getLocalId());
        var slctCheck = event.getSource().get("v.value");        
        var getCheckAllId = component.find("cboxLonglistRow");
        var totalCountDiv = component.find("longListCount");
        var totalCount = 0;
        if (slctCheck == true) {
            for (var i = 0; i < getCheckAllId.length; i++) {
                component.find("cboxLonglistRow")[i].set("v.value", true); 
                totalCount = totalCount + 1;
            }
        } else {
            for (var i = 0; i < getCheckAllId.length; i++) {
                component.find("cboxLonglistRow")[i].set("v.value", false);
            }
            totalCount = 0;
        }
        component.find("longListCount").set("v.value", totalCount);
    },
    
    changeSelectAllLongList:function(component,event, helper){
        var slctCheckRow = event.getSource().get("v.value");
        var getCheckAllId = component.find("cboxLongList");
        var totalSelected = component.find("longListCount").get("v.value");
        //alert('************** totalSelected == '+totalSelected);
        if(slctCheckRow == false) {
            component.find("cboxLongList").set("v.value", false);
            totalSelected = totalSelected - 1;
        }else{
			totalSelected = totalSelected + 1;            
        }
        component.find("longListCount").set("v.value", totalSelected);
    },
    
    selectAllApplication: function(component,event, helper){         
        var slctCheck = event.getSource().get("v.value"); 
        var stagename = event.getSource().get("v.text");
        var totalCountByStage = component.get("v.selectedFromApplicationByStage");
        
        var getCheckAllId = component.find("cboxRow");
        if (slctCheck == true) {
            var integerCount = 0;
            for (var i = 0; i < getCheckAllId.length; i++) {
                if(event.getSource().get("v.text") == component.find("cboxRow")[i].get("v.name")){
                	component.find("cboxRow")[i].set("v.value", true);
                    var myKey = event.getSource().get("v.text");
                    var found = false;
                    integerCount = integerCount + 1;
                    for(var x=0; x<totalCountByStage.length; x++) {
                        if("key" in totalCountByStage[x] && totalCountByStage[x]["key"] == myKey) {
                            totalCountByStage[x]["count"] = integerCount;
                            found = true;
                            break;
                        }
                    }
                    
                    if(!found) {
                        var temp = { "key": myKey, "count": [integerCount] };
                        totalCountByStage.push(temp);
                    }
                }
            }
        } else {
            for (var i = 0; i < getCheckAllId.length; i++) {
                if(event.getSource().get("v.text") == component.find("cboxRow")[i].get("v.name")){
                	component.find("cboxRow")[i].set("v.value", false);
                }
            }
        }
        //alert('************** integerCount == '+integerCount);
        //alert('************** totalCountByStage == '+totalCountByStage);
        component.set("v.selectedFromApplicationByStage",totalCountByStage)
    },
    
    changeSelectApplicationList:function(component,event, helper){
        var slctCheckRow = event.getSource().get("v.name");
        var slctCheckRowValue = event.getSource().get("v.value");
        var getCheckAllId = component.find("cbox");
        for(var i = 0; i < getCheckAllId.length; i++){
            if(slctCheckRowValue == false && slctCheckRow == component.find("cbox")[i].get("v.text")) {
                component.find("cbox")[i].set("v.value", false);
            }
    	}
    },
    
    getSelectedIds:function(component,event, helper){
		helper.updateApplicationStages(component, event, helper);
    },
    
    rejectSelectedApplication:function(component,event, helper){
		helper.rejectSelectedApplication(component, event, helper);
    },
})