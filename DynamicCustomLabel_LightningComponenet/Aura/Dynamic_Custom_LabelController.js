({
	doInit : function(component, event, helper) {
        try{
            var ns = ''+component.get("v.nameSpace");
            var cLabel= '$Label.';
            cLabel += (!$A.util.isEmpty(ns))? ns+'.' : 'c.';
            cLabel += ''+component.get("v.label");
            //console.log('cLabel>>', cLabel);           
            component.set("v.labelText", $A.getReference(cLabel));
        }catch(err) {
            console.log(err.message);
        }
        
		
	}
})