public class ApplicationLightningTab {
    @AuraEnabled
    public static String getFieldSet(String sObjectName, String fieldSetName) {
        String result = '';
        try{
            SObjectType objToken = Schema.getGlobalDescribe().get(sObjectName);
            Schema.DescribeSObjectResult d = objToken.getDescribe();
            Map<String, Schema.FieldSet> FsMap = d.fieldSets.getMap();
            if(FsMap.containsKey(fieldSetName))
                for(Schema.FieldSetMember f : FsMap.get(fieldSetName).getFields()) {
                    if(result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + f.getLabel() + '",';
                    jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired()) + '",';
                    jsonPart += '"type":"' + (f.getType()) + '",';
                    jsonPart += '"name":"' + f.getFieldPath() + '"';
                    jsonPart += '}';
                    result += jsonPart;
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
            return null;
        }
        system.debug('************** result == '+result);
        return '['+result+']';
    }
    
    @AuraEnabled
    public static String getRecords(String sObjectName, String parentFieldName, String parentRecordId, String fieldNameJson, String filterField, string filterValue){
        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        try{
            List<String> fieldNames = (List<String>) JSON.deserialize(fieldNameJson, List<String>.class);
            Set<String> setFieldNames = new Set<String>();
            string strFieldsetFields = String.join(fieldNames, ',');
            String query = 'SELECT Id, ' + String.join(fieldNames, ',') ;
            if(sObjectName == 'Application_V2__c'){
                query += ' ,Reject__c ';
                if(! strFieldsetFields.contains('Stage__c')){
                	query += ' ,Stage__c ';
                }
            }
            
            query += ' FROM ' + sObjectName;
            if(parentFieldName != NULL && parentFieldName != '' && parentRecordId != NULL){
                query += ' WHERE ' + parentFieldName + '= \'' +  parentRecordId + '\'';
            }
            if(filterField != null && filterField != '' && filterValue != null && filterValue != ''){
            	query += ' AND ' + filterField + '= \'' +  filterValue + '\'';
            }
            system.debug('************** query == '+query);
            for(sObject s : Database.query(query)){
                lstResult.add(s);
            }
            if(lstResult.size() > 0) {
                result = JSON.serialize(lstResult);
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        return result;
    }
    
    @AuraEnabled
    public static String[] getApplicationStageValues(){
        List<String> options = new List<String>();
        Schema.DescribeFieldResult fieldResult = Application_V2__c.Stage__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry f : fieldResult.getPicklistValues()){ 
          options.add(f.getLabel());
        }       
       return options;
    }
    
    @AuraEnabled
    public static void updateApplicationStatus(string strStage, string setApplicationIds){
        if(setApplicationIds != null && setApplicationIds != ''){
            list<string> lstAllPllicationIds = setApplicationIds.split(',');
            if(lstAllPllicationIds.size() > 0){
                List<Application_V2__c> lstApplications = new List<Application_V2__c>();
                for(string strAppId: lstAllPllicationIds){  
                    Application_V2__c app = new Application_V2__c();
                    app.Id = strAppId;
                    app.Stage__c = strStage;    
					lstApplications.add(app);                    
                }                    
                update lstApplications;
            }
        }        
    }  
    
    @AuraEnabled
    public static void kanbanMassAction(string strStage, string setApplicationIds, string setLongListIds){
        system.debug('********* strStage == '+strStage);
        system.debug('********* setApplicationIds == '+setApplicationIds);
        system.debug('********* setLongListIds == '+setLongListIds);    
        if(setLongListIds != '' && setLongListIds != null){
            list<string> lstLongListIds = setLongListIds.split(',');
            if(lstLongListIds.size() > 0){
                
                List<Opportunity_Discussed__c> lstLongList = new List<Opportunity_Discussed__c>();
                for(string strLongListId: lstLongListIds){  
                    Opportunity_Discussed__c objLongList = new Opportunity_Discussed__c();
                    objLongList.Id = strLongListId;
                    objLongList.Status__c = 'Converted';    
					lstLongList.add(objLongList);                    
                }                    
                update lstLongList;
                lstLongList = [Select Id, Candidate__c, Job__c from Opportunity_Discussed__c where Id IN:lstLongListIds];
                List<Application_V2__c> lstApplicationsToCreate = new List<Application_V2__c>();
                for(Opportunity_Discussed__c objLongList: lstLongList){
                    Application_V2__c newApplication = new Application_V2__c();
                    newApplication.Opportunity_Discussed__c = objLongList.Id;
                    newApplication.Applicant__c = objLongList.Candidate__c;
                    newApplication.Job__c = objLongList.Job__c;
                    newApplication.Stage__c = strStage;
                    lstApplicationsToCreate.add(newApplication);
                }
                insert lstApplicationsToCreate;
            }
            
        }
        
        if(setApplicationIds != null && setApplicationIds != ''){
            list<string> lstAllPllicationIds = setApplicationIds.split(',');
            if(lstAllPllicationIds.size() > 0){
                List<Application_V2__c> lstApplications = new List<Application_V2__c>();
                for(string strAppId: lstAllPllicationIds){  
                    Application_V2__c app = new Application_V2__c();
                    app.Id = strAppId;
                    app.Stage__c = strStage;    
					lstApplications.add(app);                    
                }                    
                update lstApplications;
            }
        }
    }
    
    @AuraEnabled
    public static void rejectSelected(string setApplicationIds){
        if(setApplicationIds != null && setApplicationIds != ''){
            list<string> lstAllPllicationIds = setApplicationIds.split(',');
            List<Application_V2__c> lstApplications = new List<Application_V2__c>();
            for(string strId : lstAllPllicationIds){
                Application_V2__c app = new Application_V2__c();
                app.Id = strId;
                app.reject__c = true;    
                lstApplications.add(app);   
        	}  
            update lstApplications;
    	}
    }
}