({
	doInit : function(component, event, helper) {
        
		var progress = []; 
        var stages = component.get("v.stages");
        var currentStage = helper.getComponentValue(component.get("v.currentStage")); 
        var rejectedStage = helper.getComponentValue(component.get("v.rejectedStage"));      
        var isComplete = (rejectedStage != '' || currentStage != ''); 
        
        for (var key in stages) { 
            if (stages.hasOwnProperty(key)){
                var step = {
                    "label" : stages[key],
                    "value" : stages[key],
                    "index" : key,
                    "statusClass": ""
                };
                
                
                if(rejectedStage != '' && rejectedStage == step.value){
                    step.statusClass = 'is-incomplete slds-is-lost';
                    isComplete = false;
                }else if(currentStage != null && currentStage == step.value && rejectedStage == ''){
                    step.statusClass = 'is-current';
                    isComplete = false;
                }else if(isComplete == true){
                    step.statusClass = 'is-complete';
                }else if(isComplete == false){
                    step.statusClass = 'is-incomplete';
                } 
 
                progress.push(step);
            }             
        }
        component.set("v.progressSteps", progress);
    }
})