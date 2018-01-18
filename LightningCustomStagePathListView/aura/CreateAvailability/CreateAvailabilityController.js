({
	doInit : function(component, event, helper) {
		 var today = new Date();
        component.set('v.selectedDate', today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
        component.set('v.noOfRowsSingleDay',0);
        helper.fetchPickListVal(component, 'Type__c', 'v.TypeOptions','Candidate_Availability__c');
        helper.fetchPickListVal(component, 'Start_Time__c', 'v.TimeOptions','Job__c');
        helper.getshiftValues(component);
        helper.getDefaultSettings(component);
        
       /*var action = component.get('c.getsingleDayValues');
        action.setCallback(this, function(response) {
        var state = response.getState();
            if (state === "SUCCESS") {
              //set response value in wrapperList attribute on component.
              component.set('v.singleDaySlotList', response.getReturnValue());
              // "singleRow": JSON.stringify(item)
              component.set('v.singleDaySlot',JSON.stringify(response.getReturnValue()[0]));
              
            }
              else{
                  console.log('error'+response.getError());
              }
        });
        $A.enqueueAction(action); */
        
	},
    showHideDateRange : function(component, event, helper) {
		//component.get('v.isDateRange');
        var selectdateRange =  component.find("selectdateRange").get("v.value");
        component.set('v.isDateRange',selectdateRange);
		console.log(component.get('v.isDateRange')+'%%%%');
        
	},
    save : function(component, event, helper) {
		var slots = component.get('v.singleDaySlotList');
        //var dateStr = (component.get('v.selectedDate')).format(component.get('v.dateFormatStr'));
        var selectedDt = component.get('v.selectedDate');
        alert(selectedDt);
        var action = component.get('c.saveCa');
        action.setParams({
            "exstingArray" : JSON.stringify(slots),
            "contactId"  : component.get('v.recordId'),
            "selectedDateStr"  : selectedDt
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                
            }
            else{
                  console.dir('error1'+response.getError());
              }
        });
        $A.enqueueAction(action);
	},
    addRow : function(component, event, helper) {
        var currentRow = component.get('v.noOfRowsSingleDay')+1;
        component.set('v.noOfRowsSingleDay',currentRow);
        console.dir(currentRow);
        var val = component.get('v.singleDaySlotList');
        var item = component.get('v.singleDaySlot');
        //item.count = component.get('v.noOfRowsSingleDay');
        val.push(JSON.parse(item));
        component.set('v.singleDaySlotList',val);
               
	},
    deleteRow : function(component, event, helper) {
        var slotList = component.get('v.singleDaySlotList');
        var l  = slotList;
        alert(l.length);
        var newList = [];
        var lsize = slotList.indexOf(slotList[(slotList.length)-1]);//component.get('v.noOfRowsSingleDay');
        alert(lsize +'%%%%'+slotList[(slotList.length)-1].type1);
        if (lsize !== -1) {
        	slotList.splice(lsize, 1);
        }
        console.dir(slotList);
        alert(slotList.length);
        //component.set('v.noOfRowsSingleDay',component.get('v.noOfRowsSingleDay')-1);
        //component.set('v.singleDaySlotList',slotList);
         component.find("iteration").set('v.value',slotList);
        alert(component.get('v.singleDaySlotList').length);
        alert(component.get('v.noOfRowsSingleDay')+'rows');
    }
})