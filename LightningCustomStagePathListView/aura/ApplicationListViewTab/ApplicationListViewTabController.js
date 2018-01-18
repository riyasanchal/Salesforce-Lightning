({
	doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },
    
    onSelectChange : function(component, event, helper) {
        helper.onSelectChange(component, event, helper);
    },
    
    selectAll: function(component,event, helper){
        var slctCheck = event.getSource().get("v.value");
        var getCheckAllId = component.find("cboxRow");
         
        if (slctCheck == true) {
            for (var i = 0; i < getCheckAllId.length; i++) {
                component.find("cboxRow")[i].set("v.value", true);             
            }
        } else {
            for (var i = 0; i < getCheckAllId.length; i++) {
                component.find("cboxRow")[i].set("v.value", false);
            }
        }
    },
    
    changeSelectAll:function(component,event, helper){
        var slctCheckRow = event.getSource().get("v.value");
        var getCheckAllId = component.find("cbox");
        if(slctCheckRow == false) {
            component.find("cbox").set("v.value", false);
        }
    },
    
    getAllApplicationId : function(component,event,helper) {
       helper.updateApplicationStages(component, event, helper);
    },
    
    rejectSelectedApplication:function(component,event, helper){
		helper.rejectSelectedApplication(component, event, helper);
    },
})