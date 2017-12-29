({
	doInit : function(component, event, helper) {
        helper.getTableFieldSet(component, event, helper);
        helper.getApplicationStageValues(component, event, helper);
    },
 
    getTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.sObjectName"),
            fieldSetName: component.get("v.fieldSetName")
    	});
 
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                var fieldSetObj = JSON.parse(response.getReturnValue());
                component.set("v.fieldSetValues", fieldSetObj);
                //Call helper method to fetch the records
                helper.getTableRows(component, event, helper);
            }
        })
        $A.enqueueAction(action);
    },
 
    getTableRows : function(component, event, helper){
        var action = component.get("c.getRecords");
        var fieldSetValues = component.get("v.fieldSetValues");
        var setfieldNames = new Set();
        for(var c=0, clang=fieldSetValues.length; c<clang; c++){             
            if(!setfieldNames.has(fieldSetValues[c].name)) {                 
                setfieldNames.add(fieldSetValues[c].name);
                
                if(fieldSetValues[c].type == 'REFERENCE') {					                    
                    if(fieldSetValues[c].name.indexOf('__c') == -1) {
                        var res = fieldSetValues[c].name.split('__r');
                        setfieldNames.add(fieldSetValues[c].name.substring(0, fieldSetValues[c].name.indexOf('Id')) + '.Name');                          
                    }                     
                    else {
                        setfieldNames.add(fieldSetValues[c].name.substring(0, fieldSetValues[c].name.indexOf('__c')) + '__r.Name');                              
                    }                 
                }             
            }         
        }       
       
        var arrfieldNames = [];         
        setfieldNames.forEach(v => arrfieldNames.push(v));
        action.setParams({
            sObjectName: component.get("v.sObjectName"),
            parentFieldName: component.get("v.parentFieldName"),
            parentRecordId: component.get("v.recordId"),
            fieldNameJson: JSON.stringify(arrfieldNames),
            filterField: component.get("v.filterField"),
            filterValue: component.get("v.filterValue"),
            
        });
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                var list = JSON.parse(response.getReturnValue());
                component.set("v.tableRecords", list);
                if(list == ''){
                    component.set("v.listHasValue", 'False');
                }else{
                    component.set("v.listHasValue", 'True');
                }
            }
        })
        $A.enqueueAction(action);
    },
 
    createTableRows : function(component, event, helper){
 
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
                component.set("v.stages", stage);
                component.set("v.allStages", stage);
            }
        });
        // execute server side action
        $A.enqueueAction(action);   
    },
    
    onSelectChange : function(component, event, helper) {
        //var selectedValue= event.getSource().get("v.value");
        var selectedValue = event.getParam("value");
        if(selectedValue != '' && selectedValue != null && selectedValue != 'ALL'){
            component.set("v.filterField", "Stage__c");
            component.set("v.filterValue", selectedValue);
        }else if(selectedValue == 'ALL'){
            component.set("v.filterField", "");
            component.set("v.filterValue", "");
        }
        
        helper.getTableFieldSet(component, event, helper);
    },
    
    updateApplicationStages: function(component, event, helper) {
        var selectedStage = event.getParam("doAction");
        var getCheckAllId = component.find("cboxRow");
        
        var selctedRec = '';
        for (var i = 0; i < getCheckAllId.length; i++) {             
            if(getCheckAllId[i].get("v.value") == true ){
    			if(selctedRec == ''){
                	selctedRec = getCheckAllId[i].get("v.text");
				}else{
 					selctedRec = selctedRec +','+ getCheckAllId[i].get("v.text");
 				}
            }
        }
        
    	// get server side method
        if(selctedRec == ''){
            alert('Please select atleast one record.');
            return;
        }
        var action = component.get("c.updateApplicationStatus"); 
    	action.setParams({
            strStage: selectedStage,
            setApplicationIds: selctedRec           
        });
        // set the callback function        
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                helper.doInit(component, event, helper);
            }else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        // execute server side action
        $A.enqueueAction(action);   
    }
})