define([
	"require",
	"dojo/_base/kernel",
	"dojo/_base/lang",
	"dojo/has!dojo-parser?:dojo/_base/window",
	"dojo/has",
	"dojo/has!dojo-mobile-parser?:dojo/parser",
	"dojo/has!dojo-parser?:dojox/mobile/parser",
	"dojox/mvc/Element",
	"dojox/mvc/FormElement"
], function(require, kernel, lang, win, has, parser, mobileParser){

	// module:
	//		dojox/mvc/ParserExtension
	// summary:
	//		A extension of Dojo parser that allows data binding without specifying data-dojo-type.

	has.add("dom-qsa", !!document.createElement("div").querySelectorAll);
	try{ has.add("dojo-parser", !!require("dojo/parser"));  }catch(e){}
	try{ has.add("dojo-mobile-parser", !!require("dojox/mobile/parser")); }catch(e){}

	if(has("dojo-parser")){
		var oldConstruct = parser.construct, oldScan = parser.scan;

		parser.scan = /*====== dojo.parser.scan = ======*/ function(/*DOMNode?*/ root, /*Object*/ options){
			// summary:
			//		TODOC

			var list = oldScan.apply(this, lang._toArray(arguments)),
			 dojoType = (options.scope || kernel._scopeName) + "Type",			// typically "dojoType"
			 attrData = "data-" + (options.scope || kernel._scopeName) + "-",	// typically "data-dojo-"
			 dataDojoType = attrData + "type",									// typically "data-dojo-type"
			 dataDojoBind = attrData + "bind";									// typically "data-dojo-bind"

			for(var nodes = has("dom-qsa") ? root.querySelectorAll("[" + dataDojoBind + "]") : root.getElementsByTagName("*"), i = 0, l = nodes.length; i < l; i++){
				var node = nodes[i], foundBindingInAttribs = false;
				if(!node.getAttribute(dataDojoType) && !node.getAttribute(dojoType) && node.getAttribute(dataDojoBind)){
					list.push({
						"type": /^select|input|textarea$/i.test(node.tagName) ? "dojox/mvc/FormElement" : "dojox/mvc/Element",
						node: node
					});
				}
			}

			return list;
		};
	}

	if(has("dojo-mobile-parser")){
		var oldParse = mobileParser.parse;

		mobileParser.parse = /*====== dojox.mobile.parser.parse = ======*/ function(/*DOMNode?*/ root, /*Object*/ options){
			// summary:
			//		TODOC

			var dojoType = ((options || {}).scope || kernel._scopeName) + "Type",		// typically "dojoType"
			 attrData = "data-" + ((options || {}).scope || kernel._scopeName) + "-",	// typically "data-dojo-"
			 dataDojoType = attrData + "type",											// typically "data-dojo-type"
			 dataDojoBind = attrData + "bind",											// typically "data-dojo-bind"
			 nodes = has("dom-qsa") ? (root || win.body()).querySelectorAll("[" + dataDojoBind + "]") : (root || win.body()).getElementsByTagName("*");

			for(var i = 0, l = nodes.length; i < l; i++){
				var node = nodes[i], foundBindingInAttribs = false, bindingsInAttribs = [];
				if(!node.getAttribute(dataDojoType) && !node.getAttribute(dojoType) && node.getAttribute(dataDojoBind)){
					node.setAttribute(dataDojoType, /^select|input|textarea$/i.test(node.tagName) ? "dojox/mvc/FormElement" : "dojox/mvc/Element");
				}
			}

			return oldParse.apply(this, lang._toArray(arguments));
		};
	}

	return parser || mobileParser;
});
