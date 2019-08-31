({
    doInit : function(component, event, helper) {
        helper.getApplicationStageValues(component, event, helper);
        helper.getLongListTableFieldSet(component, event, helper);
        helper.getApplicationTableFieldSet(component, event, helper);
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
            }
        });
        // execute server side action
        $A.enqueueAction(action);   
    },
    
    getLongListTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.longListsObjectName"),
            fieldSetName: component.get("v.longListfieldSetName")
    	});
 
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                var fieldSetObj = JSON.parse(response.getReturnValue());
                component.set("v.longListfieldSetValues", fieldSetObj);
                //Call helper method to fetch the records
                helper.getLongListRecords(component, event, helper);
            }
        })
        $A.enqueueAction(action);
    },
    
    getLongListRecords : function(component, event, helper){
        var action = component.get("c.getRecords");
        var fieldSetValues = component.get("v.longListfieldSetValues");
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
            sObjectName: component.get("v.longListsObjectName"),
            parentFieldName: component.get("v.parentFieldName"),
            parentRecordId: component.get("v.recordId"),
            fieldNameJson: JSON.stringify(arrfieldNames),
            filterField: "Status__c", //component.get("v.filterField"),
            filterValue: "New"//component.get("v.filterValue")             
        });
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                var list = JSON.parse(response.getReturnValue());
                component.set("v.longListtableRecords", list);
            }
        })
        $A.enqueueAction(action);
    },
    
    getApplicationTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.applicationsObjectName"),
            fieldSetName: component.get("v.applicationfieldSetName")
    	});
 
        action.setCallback(this, function(response) {
            var state =   response.getState();
            if(state === "SUCCESS"){
                var fieldSetObj = JSON.parse(response.getReturnValue());
                component.set("v.applicationfieldSetValues", fieldSetObj);
                //Call helper method to fetch the records
                helper.getApplicationRecords(component, event, helper);
            }
        })
        $A.enqueueAction(action);
    },
    
    getApplicationRecords : function(component, event, helper){
        var action = component.get("c.getRecords");
        var fieldSetValues = component.get("v.applicationfieldSetValues");
        
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
		var myObjectMap = [];        
        setfieldNames.forEach(v => arrfieldNames.push(v));
        action.setParams({
            sObjectName: component.get("v.applicationsObjectName"),
            parentFieldName: component.get("v.parentFieldName"),
            parentRecordId: component.get("v.recordId"),
            fieldNameJson: JSON.stringify(arrfieldNames),
            filterField: component.get("v.filterField"),
            filterValue: component.get("v.filterValue")            
        });
        action.setCallback(this, function(response) {
            var state =   response.getState();
            var stages = component.get("v.stages");
            if(state === "SUCCESS"){
                var list = JSON.parse(response.getReturnValue());
                for(var j=0; j<stages.length; j++){
                    var temp = { "key": stages[j], "list": [] };
                    myObjectMap.push(temp);
                }
                console.log('************* myObjectMap.length == '+myObjectMap.length);
                for(var j=0; j<stages.length; j++){
                	for(var i=0; i<list.length; i++) {                    
                        var myRecord = list[i];
                        var myKey = stages[j];
                        var found = false;
                        for(var x=0; x<myObjectMap.length; x++) {
                            if("key" in myObjectMap[x] && myObjectMap[x]["key"] == myKey && myRecord.Stage__c == myKey) {
                                if(myObjectMap[0]["list"].length == 0){
                                    console.log('************* Need to delete== ');
                                    myObjectMap[x]["list"][0] = myRecord;
                                }else{
                                	myObjectMap[x]["list"].push(myRecord);
                                }
                                found = true;
                                break;
                            }
                        }
                        if(!found && myRecord.Stage__c == myKey) {
                            var temp = { "key": myKey, "list": [myRecord] };
                            myObjectMap.push(temp);
                        }
                    } 
                }
             	component.set("v.listOfApplicationRecordsByStage", myObjectMap);
            }
        })
        $A.enqueueAction(action);
    },    
    
    updateApplicationStages: function(component, event, helper) {
        var selectedStage = event.getParam("doAction");
        var selctedApplicationRec = '';
        var selctedLongListRec = '';
        var longlistRecords = component.get("v.longListtableRecords");
        var applicationRecords = component.get("v.listOfApplicationRecordsByStage");
        
        var getCheckAllApplicationId = component.find("cboxRow");  
        console.log('************* getCheckAllApplicationId== '+getCheckAllApplicationId.length);
        for (var i = 0; i < getCheckAllApplicationId.length; i++) {  
            console.log('************* Class == '+getCheckAllApplicationId[i].get("v.class"));
            if(getCheckAllApplicationId[i].get("v.value") == true && getCheckAllApplicationId[i].get("v.class") != 'cBoxLongList'){
                if(selctedApplicationRec == '' && getCheckAllApplicationId[i].get("v.text") != 'undefined'){
                    selctedApplicationRec = getCheckAllApplicationId[i].get("v.text");
                }else if(getCheckAllApplicationId[i].get("v.text") != 'undefined'){
                    selctedApplicationRec = selctedApplicationRec +','+ getCheckAllApplicationId[i].get("v.text");
                }
            }else if(getCheckAllApplicationId[i].get("v.value") == true && getCheckAllApplicationId[i].get("v.class") == 'cBoxLongList'){
                if(selctedLongListRec == '' && getCheckAllApplicationId[i].get("v.text") != 'undefined'){
                    selctedLongListRec = getCheckAllLongListId[i].get("v.text");
                }else if(getCheckAllApplicationId[i].get("v.text") != 'undefined'){
                    selctedLongListRec = selctedLongListRec +','+ getCheckAllLongListId[i].get("v.text");
                }
            }
        } 
 		console.log('************* selctedApplicationRec == '+selctedApplicationRec);
		console.log('************* selctedLongListRec == '+selctedLongListRec);        
        if(selctedApplicationRec == '' && selctedLongListRec ==''){
            component.set("v.isError", 'true');
            helper.doInit(component, event, helper);            
            return;
        }
        var action = component.get("c.kanbanMassAction"); 
    	action.setParams({
            strStage: selectedStage,
            setApplicationIds: selctedApplicationRec,
            setLongListIds: selctedLongListRec
        });
       
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
    },
    
    rejectSelectedApplication: function(component, event, helper) {
        var selctedApplicationRec = '';
        var applicationRecords = component.get("v.listOfApplicationRecordsByStage");
        if(applicationRecords != ''){
            var getCheckAllApplicationId = component.find("cboxRow");
            
            for (var i = 0; i < getCheckAllApplicationId.length; i++) {             
                if(getCheckAllApplicationId[i].get("v.value") == true && getCheckAllApplicationId[i].get("v.class") != 'cBoxLongList'){
                    if(selctedApplicationRec == ''){
                        selctedApplicationRec = getCheckAllApplicationId[i].get("v.text");
                    }else{
                        selctedApplicationRec = selctedApplicationRec +','+ getCheckAllApplicationId[i].get("v.text");
                    }
                }
            } 
        }
        if(selctedApplicationRec == ''){
            component.set("v.isError", 'true');
            helper.doInit(component, event, helper);            
            return;
        }
        var action = component.get("c.rejectSelected"); 
    	action.setParams({
            setApplicationIds: selctedApplicationRec
        });
       
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
    },
    
    rejectApplication: function(component, event, helper) {
        
        console.log(event.currentTarget.getAttribute("data-recId"));
		console.log('Reject calling');
        var selctedApplicationRec = event.currentTarget.getAttribute("data-recId");
        
        var action = component.get("c.rejectSelected"); 
    	action.setParams({
            setApplicationIds: selctedApplicationRec
        });
       
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