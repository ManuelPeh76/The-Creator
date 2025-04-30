(function(root) {

    /* helpers */
    const attributes = {global:["accesskey","class","contenteditable","contextmenu","data-*","dir","draggable","dropzone","hidden","id","itemprop","lang","slot","spellcheck","style","tabindex","title"],accept:["form","input"],"accept-charset":["form"],action:["form"],align:["applet","caption","col","colgroup","hr","iframe","img","table","tbody","td","tfoot","th","thead","tr"],alt:["applet","area","img","input"],async:["script"],autocomplete:["form","input"],autofocus:["button","input","keygen","select","textarea"],autoplay:["audio","video"],autosave:["input"],bgcolor:["body","col","colgroup","marquee","table","tbody","tfoot","td","th","tr"],border:["img","object","table"],buffered:["audio","video"],cellpadding:["table"],cellspacing:["table"],challenge:["keygen"],charset:["meta","script"],checked:["command","input"],cite:["blockquote","del","ins","q"],code:["applet"],codebase:["applet"],color:["basefont","font","hr"],cols:["textarea"],colspan:["td","th"],content:["meta"],controls:["audio","video"],coords:["area"],crossorigin:["audio","img","link","script","video"],data:["object"],datetime:["del","ins","time"],default:["track"],defer:["script"],dirname:["input","textarea"],disabled:["button","command","fieldset","input","keygen","optgroup","option","select","textarea"],download:["a","area"],enctype:["form"],for:["label","output"],form:["button","fieldset","input","keygen","label","meter","object","output","progress","select","textarea"],formaction:["input","button"],headers:["td","th"],height:["canvas","embed","iframe","img","input","object","svg","video"],high:["meter"],href:["a","area","base","link"],hreflang:["a","area","link"],"http-equiv":["meta"],icon:["command"],integrity:["link","script"],ismap:["img"],keytype:["keygen"],kind:["track"],label:["track"],language:["script"],list:["input"],loop:["audio","bgsound","marquee","video"],low:["meter"],manifest:["html"],max:["input","meter","progress"],maxlength:["input","textarea"],media:["a","area","link","source","style"],method:["form"],min:["input","meter"],multiple:["input","select"],muted:["video"],name:["button","form","fieldset","iframe","input","keygen","object","output","select","textarea","map","meta","param"],novalidate:["form"],open:["details"],optimum:["meter"],pattern:["input"],ping:["a","area"],placeholder:["input","textarea"],poster:["video"],preload:["audio","video"],preserveAspectRatio:["svg"],radiogroup:["command"],readonly:["input","textarea"],rel:["a","area","link"],required:["input","select","textarea"],reversed:["ol"],rows:["textarea"],rowspan:["td","th"],sandbox:["iframe"],scope:["th"],scoped:["style"],seamless:["iframe"],selected:["option"],shape:["a","area"],size:["input","select"],sizes:["link","img","source"],span:["col","colgroup"],src:["audio","embed","iframe","img","input","script","source","track","video"],srcdoc:["iframe"],srclang:["track"],srcset:["img"],start:["ol"],step:["input"],summary:["table"],target:["a","area","base","form"],type:["button","input","command","embed","object","script","source","style","menu"],usemap:["img","input","object"],value:["button","option","input","li","meter","progress","param"],width:["canvas","embed","iframe","img","input","object","svg","video"],wrap:["textarea"],xmlns:["svg"]};
    const events = ["ondevicemotion","ondeviceorientation","ondeviceorientationabsolute","onabort","onblur","onfocus","oncancel","onauxclick","onbeforeinput","onbeforetoggle","oncanplay","oncanplaythrough","onchange","onclick","onclose","oncontentvisibilityautostatechange","oncontextlost","oncontextmenu","oncontextrestored","oncopy","oncuechange","oncut","ondblclick","ondrag","ondragend","ondragenter","ondragexit","ondragleave","ondragover","ondragstart","ondrop","ondurationchange","onemptied","onended","onformdata","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onloadeddata","onloadedmetadata","onloadstart","onmousedown","onmouseenter","onmouseleave","onmousemove","onmouseout","onmouseover","onmouseup","onwheel","onpaste","onpause","onplay","onplaying","onprogress","onratechange","onreset","onresize","onscroll","onscrollend","onsecuritypolicyviolation","onseeked","onseeking","onselect","onslotchange","onstalled","onsubmit","onsuspend","ontimeupdate","onvolumechange","onwaiting","onselectstart","onselectionchange","ontoggle","onpointercancel","onpointerdown","onpointerup","onpointermove","onpointerout","onpointerover","onpointerenter","onpointerleave","ongotpointercapture","onlostpointercapture","onmozfullscreenchange","onmozfullscreenerror","onanimationcancel","onanimationend","onanimationiteration","onanimationstart","ontransitioncancel","ontransitionend","ontransitionrun","ontransitionstart","onwebkitanimationend","onwebkitanimationiteration","onwebkitanimationstart","onwebkittransitionend","onerror","onafterprint","onbeforeprint","onbeforeunload","onhashchange","onlanguagechange","onmessage","onmessageerror","onoffline","ononline","onpagehide","onpageshow","onpopstate","onrejectionhandled","onstorage","onunhandledrejection","onunload","ongamepadconnected","ongamepaddisconnected"];
    const each = (i,c)=>{try{i.constructor===Object?Object.entries(i).forEach(([k,v],n)=>c(k,v,n)):[...i].forEach((k,n)=>c(k,n))}catch(e){console.warn(e)}}
    const toCamelCase = s=>s.replace(/-(\w)/g,(e,f)=>f.toUpperCase());


    /* tag */

    /**
     * Create DOM elements or DOM trees from an object or string
     *
     * Examples:
     * =========
     * const result = tag({ div: { class: "divClass", data: { id: "1" }, children: [{ div: {...} }, { br: {} }, { div: {...} }], ...}, parent: document.body });
     * @param  {object}         div         Any html tag
     * @param  {string}         class       A className or classList
     * @param  {object}         data        A key/value pair object (above example results in <div class="divClass" data-id="1"></div>)
     * @param  {array}          children    Array of child elements
     * @param  {Element}        parent      optional: The parent element for the created element
     * @return {Element}        result      The DOM element, or, in case there where multiple elements, the last one
     *                                      (to get back all, wrap them in a div container like child elements)
     *
     * const result = tag('<div class="divClass" data-id="1"><span>Hello World</span></div>');
     * @param  {string}         argument    A string consisting of html source code
     * @return {Element}        result      The parsed DOM element
     *
     * const result = tag("div");
     * @param  {string}         argument    A string consisting of html source code
     * @return {Element}        result      The parsed DOM element
     *
     */

    function throwError(tag, expected, gotten) {
        throw new Error(`Error in tag.js: '${tag}' must be of type ${expected} (got '${gotten}').`);
    }

    function tag() {
        if (!arguments.length) throwError("arguments", "String or Object", "null");
        const args = Array.isArray(arguments[0]) ? arguments[0] : [...arguments];
        let element, parent, p, attr, el;

        // handle a string as argument ( tag("div#id.classname"), or tag("<div><p>...</p></div>"), or tag("<div>") etc. )
        if (args.length === 1 && typeof args[0] === "string") return fromString(args[0]);

        each(args, (arg, i) => {
            arg = Object.keys(arg);
            attr = args[i][arg[0]];
            if (arg[1]) {
                p = parent = args[i][arg[1]];
                if (typeof p === "string") p = document.querySelector(p);
                if (!(p instanceof Element)) return throwError("parent", "string or element", parent);
                if (arg[0] === "text") return p.appendChild(document.createTextNode(args[i][arg[0]]));
                if (arg[0] === "comment") return p.appendChild(document.createComment(args[i][arg[0]]));
            }
            element = document.createElement(arg[0]);
            attr && each(attr, (key, value) => {
                key === "class" && (key = "className");
                key === "children" ? Array.isArray(value) ? each(value, child => child.constructor.name === "Object" ? tag({ ...child, parent: element }) : element.append(child)) : throwError("children", "array", typeof value) :
                key === "data" ? value.constructor === Object ? each(value, (k, v) => element.dataset[k] = v) : throwError("data", "object", typeof value) :
                key === "text" ? typeof value === "string" ? element.appendChild(document.createTextNode(value)) : throwError("text", "string", typeof value) :
                key === "comment" ? typeof value === "string" ? element.appendChild(document.createComment(value)) : throwError("comment", "string", typeof value) :
                key === "html" ?  typeof value === "string" ? element.innerHTML += value : throwError("html", "string", typeof value) :
                key === "for" ?  typeof value === "string" ? element.htmlFor = value : throwError("for", "string", typeof value) :
                key === "attr" ?  value.constructor === Object ? each(value, (key, val) => element.setAttribute(key, val)) : throwError("attr", "object", typeof value) :
                key === "style" ?
                    typeof value === "object" ? each(value, (k, v) => element.style[k] = v) :
                    typeof value === "string" ? each(value.split(";"), entry => element.style[([k, v] = entry.split(":").map(e => e.trim()), toCamelCase(k))] = v) : throwError("style", "string or object", typeof value) :
                attributes.global.includes(key) || attributes[key]?.includes(arg[0]) ? element.setAttribute(key, value) : element[key] = value;

            });
            parent && parent.appendChild(element);
        });
        function fromString(str) {
            let el, result = {}, name = "", className = "", id = "", isClass = 0, isId = 0;
            return str.startsWith("<") ? (
                el = document.createElement('div'),
                el.innerHTML = str,
                el.childElementCount === 1 ? el.firstElementChild : [...el.children]
            ) : (
                each(str, char => {
                    char === "." ? (isClass = 1, isId = 0, className.length && (className += " ")) :
                    char === "#" ? (isClass = 0, isId = 1) :
                    isClass ? className += char : isId ? id += char : name += char;
                }),
                result[name] = {},
                id && (result[name].id = id),
                className && (result[name].className = className),
                tag(result)
            );

        }
        return element;
    }

    /**
     * Create a stringified object of a DOM-Element
     *
     * const str = tag.stringify(element, parent, beautify)
     * @param  {Element}          element     Any DOM Element
     * @param  {Element}          parent      e.g. 'document.body' to add the new element to the body
     * @param  {Boolean/String}   beautify    Set to true or pass in a string of whitespaces if the result should be beautified
     * @return {String}           str         The stringified output object of the DOM Element
     */
    tag.stringify = function(element, parent, beautify){
        let str = beautify ? JSON.stringify(domToObj(element, parent), null, typeof beautify === "string" || typeof beautify === "number" ? beautify : "  ") : JSON.stringify(domToObj(element, parent));
        str = str.replace(/"([$a-zA-Z0-9_]+)":/g, "$1:"); // remove quotes from object names if possible
        str = str.replace(/"?parent"?: ?"(.*?)"/g, "parent:$1"); // remove quotes from the parent
        str = str.substring(1, str.length - 1); // remove the unnecessary array braces enclosing the result
        
        function domToObj(element, parent, iterate) {
        	const nodes = element.childNodes ? [...element.childNodes] : [];
        	let arr = [], obj = {}, nodeName = "";
        	each(nodes, el => {
        	    [3, 8].includes(el.nodeType) ? // text or comment node
        		(el.nodeValue || el.textContent || el.innerText).trim() && arr.push({ [el.nodeName.substring(1)]: el.nodeValue || el.textContent || el.innerText }) : (
        			nodeName = el.nodeName.toLowerCase(),
        			obj[nodeName] = {},
        			obj[nodeName].children = []
        		);
        		el.attributes?.length && (
        			each(el.attributes, ({name, value}) => {
        				name === "class" && (name = "className");
        				name.substring(0, 5) === "data-" ? obj[nodeName].data = { ...obj[nodeName].data, [name.substring(5)]: value } :
        				obj[nodeName][name] = value;
        			})
        		)
                        each(events, ev => el[ev] && (obj[nodeName][ev] = el[ev].toString()));
        		el.childNodes?.length && (obj[nodeName].children = domToObj(el, parent, 1));
        		Object.keys(obj).length && (
                    (obj[nodeName].children.length === 1 && obj[nodeName].children[0].text ? (
                        obj[nodeName].text = obj[nodeName].children[0].text,
                        delete obj[nodeName].children
                    ) : !obj[nodeName].children.length && delete obj[nodeName].children
                    ), !iterate && parent && (obj.parent = parent),
        			arr.push(obj),
        			obj = {}
        		);
        	});
        	return arr;
        }
        return str;
    }

    /*!
     * Get an existing DOM Element
     * const element = tag.get(queryString)
     * @param  {String}       queryString   A query string, "div[.example]" returns all div elements of the "example" class
     * @return {Element}      element       The returning DOM element/s
     */
    tag.get = str => {
        if (typeof str !== "string") return false;
        const b = str.match(/(\w+)\[(.*?)\]/);
        return b?.length === 3 ? document.querySelectorAll(b[1] + b[2]) : document.getElementsByTagName(str);
    };


    /* Main function for 'tag.stringify' */


    root.tag = tag;

})(window);
