({
    doInit : function(component, event, helper) {
        helper.getApplicationStageValues(component, event, helper);
    },
    
	getApplicationStageValues: function(component, event, helper) {
        // get server side method
        var action = component.get("c.getApplicationStageValues"); 
        // set the callback function        
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                var state = response.getState();  
                var stage = response.getReturnValue(); 
                alert('************ Stage == '+stage);
                component.set("v.stages", stage);
            }
        });
        // execute server side action
        $A.enqueueAction(action);   
    },
})