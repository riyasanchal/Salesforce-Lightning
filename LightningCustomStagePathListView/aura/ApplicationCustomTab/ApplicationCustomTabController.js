({    
    doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        helper.getApplicationStageValues(component);
    },
    
    changeView : function(component, event, helper) {
        // first get the div element. by using aura:id
      	var isKanban = component.get('v.isKanban');
        component.set('v.isKanban', !isKanban);
	},  
    
    showActions : function(component, event, helper) {
        helper.toggleElement(component);
	},
    
    doMassAction : function(component, event, helper){
        helper.toggleElement(component);
        var selectedItem = event.currentTarget;
        var actionEvent = $A.get("e.c:ApplicationMassActionEvent");
        actionEvent.setParams({"doAction" : selectedItem.dataset.action});
        actionEvent.fire();
        
    },
    
    rejectSelected : function(component, event, helper){
        var actionEvent = $A.get("e.c:RejectSelectedRecordsEvent");
        actionEvent.fire();
        
    },
})