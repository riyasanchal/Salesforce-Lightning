({
	getApplications: function(cmp){
    var action = cmp.get("c.getApplications");
    action.setCallback(this, function(response){
        var state = response.getState();
        if (state === "SUCCESS") {
            cmp.set("v.myApplications", response.getReturnValue());
        }
    });
    $A.enqueueAction(action);
}
})