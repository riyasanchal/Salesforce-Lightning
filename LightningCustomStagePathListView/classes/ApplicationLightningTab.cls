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
        return '['+result+']';
    }
    
    @AuraEnabled
    public static String getRecords(String sObjectName, String parentFieldName, String parentRecordId, String fieldNameJson, String filterField, string filterValue){
        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        try{
            List<String> fieldNames = (List<String>) JSON.deserialize(fieldNameJson, List<String>.class);
            Set<String> setFieldNames = new Set<String>();
            String query = 'SELECT Id, Rejected_Stage__c, ' + String.join(fieldNames, ',') + ' FROM ' + sObjectName;
            if(parentFieldName != NULL && parentFieldName != '' && parentRecordId != NULL){
                query += ' WHERE ' + parentFieldName + '= \'' +  parentRecordId + '\'';
            }
            if(filterField != null && filterField != '' && filterValue != null && filterValue != ''){
            	query += ' AND ' + filterField + '= \'' +  filterValue + '\'';
            }
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
        Schema.DescribeFieldResult fieldResult = V2_Application__c.Stage__c.getDescribe();
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
                List<V2_Application__c> lstApplications = new List<V2_Application__c>();
                for(string strAppId: lstAllPllicationIds){  
                    V2_Application__c app = new V2_Application__c();
                    app.Id = strAppId;
                    app.Stage__c = strStage;    
					lstApplications.add(app);                    
                }                    
                update lstApplications;
            }
        }        
    }    
    
    public static string getLongList(string jobId){
        string strResult = '';
        List<Opportunity_Discussed__c> lstLongList = [Select Id, Candidate__c, Candidate__r.Name, Candidate__r.Phone, Candidate__r.Email from Opportunity_Discussed__c where Job__c =: jobId];
        if(lstLongList.size() > 0) {
            strResult = JSON.serialize(lstLongList);
        }
        return strResult;
    }
}