define(["dojo/_base/declare", "dijit/_WidgetBase", 	"dojo/_base/lang"], function(declare, WidgetBase, lang){
	/*=====
		WidgetBase = dijit._WidgetBase;
		declare = dojo.declare;
	=====*/

	return declare("dojox.mvc.Group", [WidgetBase], {
		// summary:
		//		A simple model-bound container widget with single-node binding to a data model.
		//
		// description:
		//		A group is usually bound to an intermediate dojo.Stateful node in the data model.
		//		Child dijits or custom view components inside a group inherit their parent
		//		data binding context from it.
		startup: function(){
			// This code needed for ticket 14423 is using removeRepeatNode on a repeat to work with mobile.lists
			// this.select and this.onCheckStateChanged are called by ListItem so they need to be set
			// but it seems like a bit of a hack.
			var parent = null;
			if(lang.isFunction(this.getParent)){
				if(this.getParent() && this.getParent().removeRepeatNode){
					this.select = this.getParent().select;
					this.onCheckStateChanged = this.getParent().onCheckStateChanged;
				}
			}			
			this.inherited(arguments);
		},
		
	});
});
