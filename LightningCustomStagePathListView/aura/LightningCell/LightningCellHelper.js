({
    doInit : function(component, event, helper) {
        var record = component.get("v.record");
        var field = component.get("v.field");
        
        component.set("v.cellValue", helper.getFieldData(record, field.name));
        if(field.type == 'DATE'){
            component.set("v.isDateField", true);
        }
        else if(field.type == 'DATETIME'){
            component.set("v.isDateTimeField", true);
        }
        else if(field.type == 'CURRENCY'){
            component.set("v.isCurrencyField", true);
        }
        else if(field.type == 'REFERENCE'){
            component.set("v.isReferenceField", true);
            var relationShipName = '';
            if(field.name.indexOf('__c') == -1) {
                relationShipName = field.name.substring(0, field.name.indexOf('Id'));
            }
            else {
                relationShipName = field.name.substring(0, field.name.indexOf('__c')) + '__r';
                
            }
            if(record != null && relationShipName!= null && relationShipName != '' && relationShipName != undefined && record[relationShipName] != undefined){
                component.set("v.cellLabel", record[relationShipName].Name);
            }
        }else{
            component.set("v.isTextField", true);
        }       
    },
    
    getFieldData: function (record, fieldName){
        var rFields = fieldName.split('.');
        var data = record;
        rFields.forEach(function(prentField) {
            if(data[prentField] != undefined){
            	data = data[prentField];
            }else{
                data = '';
            }
        });
        
        return data;
	}
})