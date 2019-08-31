({
	fetchPickListVal: function(component, fieldName, elementId,ObjectName) {
       
        var opts = [];
        var action = component.get('c.getselectOptions');
        action.setParams({
            ObjectName : ObjectName,
            fld : fieldName
        });
        
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
               
                for (var i = 0; i < allValues.length; i++) {
                    opts.push(
                        allValues[i]
                    );
                }
                console.log(opts);
                component.set(elementId, opts);
            }
            else{
                  console.dir('error1'+response.getError());
              }
        });
        $A.enqueueAction(action);
    },
    getshiftValues: function(component) {
        var opts = [];
        var action = component.get('c.getshiftValues');
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 				for (var i = 0; i < allValues.length; i++) {
                    opts.push(
                        allValues[i]
                    );
                }
                console.dir(opts);
                component.set('v.shiftOptions', opts);
            }
            else{
                  console.dir('error1'+response.getError());
              }
        });
        $A.enqueueAction(action);
    },
    getDefaultSettings: function(component) {
        var opts = [];
        var action = component.get('c.getOrgDefaults');
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var result = response.getReturnValue();
                component.set('v.PeriodBasedShift',result.isPeriodBasedShifts);
                component.set('v.singleDaySlotList', result.singleDaySlotList);
                component.set('v.singleDaySlot',JSON.stringify(result.singleDaySlotList[0]));
                component.set('v.timeslotWrapperList', result.timeslotWrapperList);
                component.set('v.timeslotWrapper',JSON.stringify(result.timeslotWrapperList[0]));
                var isperiodEnabled = component.get('v.PeriodBasedShift');
                var shiftcl = component.find('shiftcol');
               if(!isperiodEnabled){
                    alert(false);
                    $A.util.addClass(shiftcl, 'hide');
                }
                
            }
            else{
                  console.dir('error1'+response.getError());
              }
        });
        $A.enqueueAction(action);
    },
})