({
	toggleElement : function(component) {
      var changeElement = component.find("mActionMenu");
        // by using $A.util.toggleClass add-remove slds-hide class
      $A.util.toggleClass(changeElement, "slds-hide");
	},
    
    getApplicationStageValues: function(component) {
        // get server side method
        var action = component.get("c.getApplicationStageValues"); 
        // set the callback function        
        action.setCallback(this, function(response) {
            if(response.getState() === "SUCCESS"){
                component.set("v.stages", response.getReturnValue());
            }
        });
        // execute server side action
        $A.enqueueAction(action);   
    },
})