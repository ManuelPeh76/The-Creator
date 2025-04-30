
    (function(root) {

        if (root.consoleLoaded) return;

        root.__objs || (root.__objs = {});
        root.togglerIsMoved = 0;
        root.addEventListener("error", onError);

        const tag = function(e){const t={global:["accesskey","class","contenteditable","contextmenu","data-*","dir","draggable","dropzone","hidden","id","itemprop","lang","slot","spellcheck","style","tabindex","title"],accept:["form","input"],"accept-charset":["form"],action:["form"],align:["applet","caption","col","colgroup","hr","iframe","img","table","tbody","td","tfoot","th","thead","tr"],alt:["applet","area","img","input"],async:["script"],autocomplete:["form","input"],autofocus:["button","input","keygen","select","textarea"],autoplay:["audio","video"],autosave:["input"],bgcolor:["body","col","colgroup","marquee","table","tbody","tfoot","td","th","tr"],border:["img","object","table"],buffered:["audio","video"],cellpadding:["table"],cellspacing:["table"],challenge:["keygen"],charset:["meta","script"],checked:["command","input"],cite:["blockquote","del","ins","q"],code:["applet"],codebase:["applet"],color:["basefont","font","hr"],cols:["textarea"],colspan:["td","th"],content:["meta"],controls:["audio","video"],coords:["area"],crossorigin:["audio","img","link","script","video"],data:["object"],datetime:["del","ins","time"],default:["track"],defer:["script"],dirname:["input","textarea"],disabled:["button","command","fieldset","input","keygen","optgroup","option","select","textarea"],download:["a","area"],enctype:["form"],for:["label","output"],form:["button","fieldset","input","keygen","label","meter","object","output","progress","select","textarea"],formaction:["input","button"],headers:["td","th"],height:["canvas","embed","iframe","img","input","object","svg","video"],high:["meter"],href:["a","area","base","link"],hreflang:["a","area","link"],"http-equiv":["meta"],icon:["command"],integrity:["link","script"],ismap:["img"],keytype:["keygen"],kind:["track"],label:["track"],language:["script"],list:["input"],loop:["audio","bgsound","marquee","video"],low:["meter"],manifest:["html"],max:["input","meter","progress"],maxlength:["input","textarea"],media:["a","area","link","source","style"],method:["form"],min:["input","meter"],multiple:["input","select"],muted:["video"],name:["button","form","fieldset","iframe","input","keygen","object","output","select","textarea","map","meta","param"],novalidate:["form"],open:["details"],optimum:["meter"],pattern:["input"],ping:["a","area"],placeholder:["input","textarea"],poster:["video"],preload:["audio","video"],preserveAspectRatio:["svg"],radiogroup:["command"],readonly:["input","textarea"],rel:["a","area","link"],required:["input","select","textarea"],reversed:["ol"],rows:["textarea"],rowspan:["td","th"],sandbox:["iframe"],scope:["th"],scoped:["style"],seamless:["iframe"],selected:["option"],shape:["a","area"],size:["input","select"],sizes:["link","img","source"],span:["col","colgroup"],src:["audio","embed","iframe","img","input","script","source","track","video"],srcdoc:["iframe"],srclang:["track"],srcset:["img"],start:["ol"],step:["input"],summary:["table"],target:["a","area","base","form"],type:["button","input","command","embed","object","script","source","style","menu"],usemap:["img","input","object"],value:["button","option","input","li","meter","progress","param"],width:["canvas","embed","iframe","img","input","object","svg","video"],wrap:["textarea"],xmlns:["svg"]},a=(e,t)=>{try{e.constructor===Object?Object.entries(e).forEach((([e,i],l)=>t(e,i,l))):[...e].forEach(((e,i)=>t(e,i)))}catch(e){console.warn(e)}},r=e=>e.replace(/-(\w)/g,((e,t)=>t.toUpperCase()));function n(){const e=Array.isArray(arguments[0])?arguments[0]:[...arguments];let i,l,c,s,d,p,u;return 1===e.length&&"string"==typeof e[0]?e[0].startsWith("<")?(u=document.createElement("div"),u.innerHTML=e[0],1===u.childElementCount?u.firstElementChild:u.children):n.fromString(e[0]):(a(e,((u,m)=>{if(u=Object.keys(u),s=e[m][u[0]],"parent"===u[1]){if(c=l=e[m][u[1]],"string"==typeof c&&(c=document.querySelector(c)),!c)return console.error("Error in tag.js: Unknown parent: "+l);if("text"===u[0])return c.appendChild(document.createTextNode(e[m][u[0]]));if("comment"===u[0])return c.appendChild(document.createComment(e[m][u[0]]))}i=document.createElement(u[0]),s&&a(s,((e,l)=>{"children"===e?a(l,(e=>"Object"===e.constructor.name?n({...e,parent:i}):i.append(e))):"data"===e?a(l,((e,t)=>i.dataset[e]=t)):"text"===e?i.appendChild(document.createTextNode(l)):"comment"===e?i.appendChild(document.createComment(l)):"html"===e?i.innerHTML+=l:"for"===e?i.htmlFor=l:"attr"===e?a(l,((e,t)=>i.setAttribute(e,t))):"style"===e?"object"==typeof l?a(l,((e,t)=>i.style[e]=t)):a(l.split(";"),(e=>i.style[([d,p]=e.split(":").map((e=>e.trim())),r(d))]=p)):t.global.includes(e)||t[e]&&t[e].includes(u[0])?i.setAttribute(e,l):i[e]=l})),l&&l.appendChild(i)})),i)}function o(e,t,i){const l=[...e.childNodes];let c=[],s={},d="";return a(l,(e=>{[3,8].includes(e.nodeType)?(e.nodeValue||e.textContent||e.innerText).trim()&&c.push({[e.nodeName.substring(1)]:e.nodeValue||e.textContent||e.innerText}):(d=e.nodeName.toLowerCase(),s[d]={},s[d].children=[]),e.attributes?.length&&a([...e.attributes],(({name:e,value:t})=>{"class"===e&&(e="className"),"data-"===e.substring(0,5)?s[d].dataset={...s[d].dataset,[e.substring(5)]:t}:s[d][e]=t})),e.childNodes?.length&&(s[d].children=o(e,t,1)),Object.keys(s).length&&(1===s[d].children.length&&s[d].children[0].text?(s[d].text=s[d].children[0].text,delete s[d].children):!s[d].children.length&&delete s[d].children,!i&&t&&(s.parent=t),c.push(s),s={})})),c}n.stringify=function(e,t,i){let l=i?JSON.stringify(o(e,t),null,"string"==typeof i||"number"==typeof i?i:"  "):JSON.stringify(o(e,t));return l=l.replace(/"([$a-zA-Z0-9_]+)":/g,"$1:"),l=l.replace(/"?parent"?: ?"(.*?)"/g,"parent:$1"),l=l.substring(1,l.length-1),l},n.get=e=>{if("string"!=typeof e)return!1;const t=e.match(/(\w+)\[(.*?)\]/);return 3===t?.length?document.querySelectorAll(t[1]+t[2]):document.getElementsByTagName(e)},n.parse=n,n.fromString=e=>{let t={},i="",l="",c="",s=0,d=0;return a(e,(e=>{"."===e?(s=1,d=0,l.length&&(l+=" ")):"#"===e?(s=0,d=1):s?l+=e:d?c+=e:i+=e})),t[i]={},c&&(t[i].id=c),l&&(t[i].className=l),n(t)};return n}(root);

        const originalRoot = root,
            originalConsole = console,
            doc = document,
            isTouch = "ontouchstart" in doc,
            css = () => `c-toggler{position:fixed;top:0;left:0;display:flex;height:40px;width:40px;background-color:#99f;align-items:center;justify-content:center;user-select:none;transform-origin:center;border-radius:50%;color:#fff;box-shadow:-2px 2px 8px rgba(0,0,0,.4);z-index:25}c-object{color:#9999ff;text-decoration:underline}c-toggler:active{box-shadow:-1px 1px 4px rgba(0,0,0,.4)}c-line{display:block}c-console{box-sizing:border-box;overflow-y:auto;position:absolute;bottom:0;left:0;height:17vh;width:50vw;background-color:#313131;z-index:1;color:#eeeeee;font-family:"Roboto",sans-serif;transition:height 400ms}c-console br:last-of-type{display:none}c-console textarea{color:white;caret-color:currentColor !important;background-color:inherit;transition:height 400ms}c-input{display:contents;position:sticky;bottom:0;left:0;width:50vw}c-input::before{position:fixed;width:25px;text-align:right;bottom:0;color:#000;font-weight:bold;font-size:14px;content:">>";background-color:#444;height:20px;padding-bottom:11px;transition:opacity 400ms}#__c-input{position:fixed;left:25px;bottom:0;width:calc(50vw - 25px);border:none;background:#444;overflow:auto;height:30px;outline:none;box-sizing:border-box;transition:all 400ms}c-message{position:relative;display:flex;border-bottom:solid 1px rgba(204,204,204,0.4);margin-bottom:5px;font-size:.7rem;flex-wrap:wrap}c-message:last-of-type{margin-bottom:32px}c-code{position:relative;color:rgb(214,211,211);font-size:.8em;font-family:"Courier New",Courier,monospace;overflow-x:auto;white-space:pre;margin-bottom:0;border:none}c-code::after{content:"use";background-color:#666;color:inherit;border-radius:4px;padding:0 0.4rem;font-size:0.6rem}c-code::before{content:">>";padding:0 5px;font-style:italic}c-key{font-size:0.9rem;color:#cc66ff}c-message[log-level=error]{border-bottom:solid 1px rgba(255,255,255,0.4);background-color:#422;color:inherit}c-message[log-level=error]::after{background-color:#cc4343;color:inherit}c-message[log-level=warn]{border-bottom:solid 1px rgba(255,255,255,0.4);background-color:#dd8b13;color:#000}c-message[log-level=warn]::after{background-color:#ff8b13;color:#000}c-stack:not(:empty){content:attr(data-stack);font-family:Verdana,Geneva,Tahoma,sans-serif;display:flex;height:20px;align-items:center;justify-content:space-between;width:50vw;background-color:inherit;padding:0 5px;box-sizing:border-box;font-size:.7rem;color:inherit}c-text{padding:2px;white-space:pre;font-family:Verdana,Geneva,Tahoma,sans-serif;overflow:auto;box-sizing:border-box;max-width:50vw;font-size:0.7rem;width:100%;padding-left:10px}c-text.__c-boolean{color:rgb(130,80,177)}c-text.__c-number{color:rgb(97,88,221)}c-text.__c-symbol{color:rgb(111,89,172)}c-text.__c-function{color:rgb(145,136,168);font-family:"Courier New",Courier,monospace;font-size:0.7rem}c-text.__c-function::before{content:"ƒ";margin:0 2px;font-style:italic;color:#9999ff}c-text.__c-object,c-text.__c-undefined{color:rgb(118,163,118)}c-text.__c-string{color:rgb(59,161,59)}c-text.__c-string:not(.no-quotes)::before{content:'"';margin-right:2px}c-text.__c-string:not(.no-quotes)::after{content:'"';margin-left:2px}c-message.error c-text{overflow:unset;white-space:pre-wrap;word-break:break-word;color:white}c-message[log-level=warn] c-text{color:#000;font-weight:bold}c-group{display:none;margin-left:14px}c-type[type="body-toggler"].__show-data+c-group{display:block}c-type[type="body-toggler"]::before{display:inline-block;content:"▸";margin-right:2.5px}c-type[type="body-toggler"]::after{content:"{...}"}c-type[type="body-toggler"].__show-data::before{content:"▾"}c-type[type="body-toggler"].__show-data::after{display:none}c-table{display:table;width:100%;border-collapse:collapse;border-spacing:0;font-size:0.7rem;color:rgb(214,211,211);border:solid 1px rgba(204,204,204,0.4)}c-table c-row{display:table-row;border-bottom:solid 1px rgba(204,204,204,0.4)}c-table c-row:last-child{border-bottom:none}c-table c-row:first-child{font-weight:bold}c-table c-cell{display:table-cell;padding:5px;border-bottom:solid 1px rgba(204,204,204,0.4)}c-table c-cell:not(:last-child){border-left:solid 1px rgba(204,204,204,0.4)}c-date{margin-left:1px}@keyframes --page-transition{0%{opacity:0;transform:translate3d(0,50%,0)}100%{opacity:1;transform:translate3d(0,0,0)}}`,
            toStore = (item, value) => window.localStorage ? (localStorage[item] = JSON.stringify(value), true) : false,
            fromStore = item => window.localStorage ? (function(w, i) { try { return JSON.parse(w.localStorage[i]); } catch(e) { return false; }})(window, item) : false,
            $inputMemory = fromStore("console_Memory") || [],
            $console = tag({ "c-console": { className: "console-bg", attr: { title: "Console" }, onclick: e => e.target.getAttribute("action") === "use code" && ($input.value = e.target.getAttribute("data-code"), $input.focus())}}),
            $inputContainer = tag({ "c-input": { style: { position: "sticky", bottom: 0, left: 0 }}, parent: $console}),
            $input = tag({ textarea: { id: "__c-input", onblur: () => setTimeout(() => isFocused = false, 0) }, parent: $inputContainer}),
            toggler = tag({ "c-toggler": { onclick: toggleConsole, [isTouch ? "ontouchstart" : "onmousedown"]: togglestart, html: ">", style: `transform: translate(2px, ${innerHeight / 2}px)`},  parent: document.body }),
            $style = tag({ style: { textContent: css() }, parent: document.head }),
            Scroll = () => $console.scrollTo(0, 1e7),
            createTextContainer = type => (type = type === "bigint" ? "number" : type === "object" ? "undefined" : type, tag({"c-text": { class: `__c-${type} no-quotes` }})),
            objValue = (obj, ...keys) => keys.reduce((acc, key) => acc[key], obj),
            parse = data => data.toString().replace(/^function\s+[\w_$\d]+\s*/, "").replace(/({).*(})/, "$1...$2").replace(/\s*/g, ""),
            escapeHTML = str => str.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
            counter = {},
            timers = {};

        let $inputPosition = $inputMemory.length - 1, isFocused = false, inputStyle;

        assignCustomConsole();

        doc.body.appendChild(toggler);

        function throwTypeError(err) {
          throw new TypeError(err);
        }

        function throwError(err) {
          throw new Error(err);
        }

        function assignCustomConsole() {
            window.console = {
                container: $console,
                setRoot: (newRoot) => (root.removeEventListener("error", onError), root = newRoot, root.addEventListener("error", onError)),
                assert: (condition, msg, ...substituion) => !condition && log("error", msg, ...substituion),
                clear: () => ($console.innerHTML = "", $console.appendChild($inputContainer), isFocused && $input.focus()),
                count: (hash = "default") => (counter[hash] ? ++counter[hash] : counter[hash] = 1, log("log", `${hash}: ${counter[hash]}`)),
                countReset: (hash) => delete counter[hash],
                debug: (...args) => log("log", ...args),
                dir: (...args) => log("log", ...args),
                dirxml: (...args) => log("log", ...args),
                error: (...args) => (originalConsole.error(...args), log("error", ...args)),
                getStack: getStack,
                group: (...args) => log("log", ...args),
                groupCollapsed: (...args) => log("log", ...args),
                groupEnd: (...args) => log("log", ...args),
                info: (...args) => (originalConsole.info(...args), log("info", ...args)),
                log: (msg, ...substituion) => (originalConsole.log(msg,...substituion), log("log", msg, ...substituion)),
                table: (...args) => log("log", ...args),
                trace: (...args) => log("trace", ...args),
                warn: (msg, ...substituion) => (originalConsole.warn(msg, ...substituion), log("warn", msg, ...substituion)),
                time: (label = "default") => (typeof label !== "string" ? () => throwTypeError("label must be a string") : timers[label] = new Date().getTime(), undefined),
                timeEnd: (label = "default") => typeof label !== "string" ? () => throwTypeError("label must be a string") : timers[label] ? (log("log", `${label}: ${new Date().getTime() - timers[label]}ms`), delete timers[label], undefined) : () => throwError(`No such label: ${label}`),
                timeLog: (label = "default") => typeof label !== "string" ? () => throwTypeError("label must be a string") : timers[label] ? (log("log", `${label}: ${new Date().getTime() - timers[label]}ms`), undefined) : () => throwError(`No such label: ${label}`)
            };
            //window.Console = window.console;
        }

        function togglestart() {
            if (toggler.classList.contains("blur")) return;
            doc.addEventListener(isTouch ? "touchmove" : "mousemove", togglemove);
            doc[isTouch ? "ontouchend" : "onmouseup"] = toggleend;
        }

        function toggleend() {
          doc.removeEventListener(isTouch ? "touchmove" : "mousemove", togglemove);
          doc[isTouch ? "ontouchend" : "onmouseup"] = null;
          setTimeout(() => toggler.classList.remove("is-moving"), 100);
        }

        function togglemove(e) {
          e.preventDefault();
          toggler.style.transform = "translate(" + ((e.touches ? e.touches[0].clientX : e.clientX) - 20) + "px, " + ((e.touches ? e.touches[0].clientY : e.clientY) - 20) + "px)";
          toggler.classList.contains("is-moving") || toggler.classList.add("is-moving");
        }

        function toggleConsole(err) {
            if (toggler.classList.contains("is-moving") || toggler.classList.contains("blur")) return;
            inputStyle || (inputStyle = tag({ style: {type: "text/css" }, parent: document.head }));
            if($console.isConnected) {
                if (err === 1) return;
            	$input.removeEventListener("keydown", codeInput);
                $console.style.height = "0px";
                $input.style.opacity = 0;
                inputStyle.innerHTML = "c-input::before { transition: opacity 400ms; opacity: 0; }";
                return setTimeout(() => $console.remove(), 350);
            }
            $console.style.height = "0px";
            $input.style.opacity = 0;
            inputStyle.innerHTML = "c-input::before { transition: opacity 400ms; opacity: 0; }";
            document.body.appendChild($console);
            setTimeout(() => {
                $console.style.height = "17vh";
                setTimeout(() => {
                    $input.style.opacity = 1;
                    inputStyle.innerHTML = "c-input::before { transition: opacity 400ms; opacity: 1; }";
                }, 150);
            }, 1);
            $input.addEventListener("keydown", codeInput);
        }

        function codeInput(e) {
            const key = e.keyCode || e.which;
            isFocused = true;
            let style = getComputedStyle(this);
            if ([38, 40].indexOf(key) > -1 && $inputMemory.length && (this.value === "" || $inputMemory[$inputPosition] === this.value)) {
                key === 38 && (this.value && $inputPosition--);
                key === 40 && ($inputPosition++);
                $inputPosition >= $inputMemory.length ? (this.value = "", $inputPosition--, this.style.height = "") : (
                    $inputPosition < 0 && ($inputPosition = 0),
                    this.value = $inputMemory[$inputPosition],
                    this.style.height = Math.min((30 + parseInt(style.fontSize) * (this.value.trim().split("\n").filter(e => e).length - 1)), 150) + "px"
                );
            }
            if(key === 27) return (this.style.height = "", isFocused = false, this.blur());
            if(key === 13) {
                let code = this.value;
                if(code.trim() === "") return this.style.height = "";
            	const opener = /[\[\{\(]/g;
            	const closer = /[\)\}\]]/g;
            	let isOdd = (code.match(opener)?.length || 0) - (code.match(closer)?.length || 0);
            	if(isOdd > 0 || (code.length && code[code.length - 1].match(closer))) {
            		let row = code.split("\n"), i = -1;
            		if([")", "]", "}"].indexOf(row[row.length - 1].trim()[0]) > -1) {
            			let temp = code.split("\n");
            			temp[temp.length - 1] = temp[temp.length - 1].replace(/  /, "");
            			this.value = code = temp.join("\n");
            		}
            		row = row[row.length - 1];
            		let add = 2 * (row.length - row.replace(opener, "").length) + 2 * (row.replace(closer, "").length - row.length);
            		while(row[++i] == " ") {}
            		i += add;
            		i < 0 && (i = 0);
            		if (isOdd > 0) return setTimeout(function() { $input.value += " ".repeat(i); }, 1);
            	}
                //$input.blur();
                //isFocused = false;
                $inputMemory.push(code.trim());
                $inputPosition = $inputMemory.length - 1;
                toStore("console_Memory", $inputMemory);
                this.style.height = "";
            	e.preventDefault();
            	e.stopPropagation();
            	e.stopImmediatePropagation();
            	log("code", code);
            	this.value = "";
            	const res = execute(code);
                typeof res.value === "string" && (res.value = res.value.replace(/</g, "&lt;").replace(/>/g, "&gt;"));

            	log(res.type === "error" ? "error" : "log", res.value);
            }
        }

        function getBody(obj, ...keys) {
            if (obj instanceof Promise && !("[[PromiseStatus]]" in obj)) obj = getPromiseStatus(obj);
            let value = objValue(obj, ...keys);
            const $group = tag("c-group");
            const $toggler = tag({ "c-type": { attr: { type: "body-toggler" }, text: (value ? value.constructor.name : value + ""), style: "cursor: pointer" }});

            if(typeof value === "object" || typeof value === "function"){

              $toggler.onclick = function(){
                if (this.classList.contains("__show-data")) {
                  this.classList.remove("__show-data");
                  $group.textContent = null;
                  return;
                }
                this.classList.toggle("__show-data");
                const possibleKeys = [];
                for(let key in value) possibleKeys.push(key);
                possibleKeys.push(...[...Object.keys(value), ...Object.getOwnPropertyNames(value), ...Object.keys(value["__proto__"] || {})]);
                value.__proto__ && possibleKeys.push("__proto__");
                value.prototype && possibleKeys.push("prototype");
                [...new Set(possibleKeys)].forEach(key => $group.append(appendProperties(obj, ...keys, key)));
              };
            } else {
              const $val = createTextContainer(value);
              $val.textContent = (value || "").toString();
              $group.append($val);
            }

            return [$toggler, $group];
        }

        function appendProperties(obj, ...keys) {
            const key = keys.pop();
            const value = objValue(obj, ...keys);
            const getter = value.__lookupGetter__(key);
            const $key = tag({ "c-key": { text: key + ":" }});
            let $val;
            if(getter){

              $val = tag({ "c-span": { style: "text-decoration: underline; color: #39f; margin: 0 10px; cursor: pointer;", text: `...`, onclick: function() {
                const $val = getVal(value[key]);
                this.parentElement.replaceChild($val, this);
              }}});
            } else $val = getVal(value[key]);

            return tag({ "c-line": { children: [$key, $val] }});

            function getVal(val) {
              const type = typeof val;
              const $val = createTextContainer(type);
              type === "object" && val !== null ? $val.append(...getBody(obj, ...keys, key)) : (
                type === "function" && (val = parse(val)),
                $val.textContent = val + ""
            );
              return $val;
            }
        }

        function getPromiseStatus(obj) {
            if (obj.info) return;
            let status = "pending";
            let value;
            let result = obj.then(val => { status = "resolved"; value = val; }, val => { status = "rejected"; value = val; });

            Object.defineProperties(result, {
              "[[PromiseStatus]]": { get: () => status },
              "[[PromiseValue]]": { get: () => value },
            });

            return result;
        }

        function log(mode, ...args) {
            const options = mode === "code" ? {} : getStack();
            let location = options.location || "Console", $msg;
            const $messages = tag({ "c-message": { attr: { "log-level": mode }}});

            args = format(args);

            if(args.length === 1 && args[0] instanceof Error) args.unshift(args[0].message);
            location && tag({"c-stack": { html: `<c-date>${new Date().toLocaleString()}</c-date><c-trace>${location}</c-trace>` }, parent: $messages});
            for (let arg of args) {
              const argType = typeof arg;
              //arg = arg || "";
              mode === "code" ? $msg = tag({ "c-code": { text: (arg.length > 50 ? arg.substring(0, 50) + "..." : arg), attr: { "data-code": arg, action: "use code" }}}) : (
                  $msg = createTextContainer(argType),
                  argType === "object" ? $msg.append(...getBody(arg)) :
                  argType === "function" ? (
                      $msg.innerHTML = escapeHTML(arg.toString()),
                      tag({ "c-line": { children: [...getBody(arg)] }, parent: $msg})
                  ) : $msg.innerHTML = arg
              );
              $messages.appendChild($msg);
            }
            $console.insertBefore($messages, $inputContainer);
            while ($console.childElementCount > 100) $console.firstElementChild.remove();
            setTimeout(Scroll, 0);
            isFocused && $input.focus();
        }

        function format(args) {
            if (args.length <= 1) return args;

            let msg = args.splice(0, 1)[0];
            if (typeof msg !== "string") return [...args];

            const matchRegex = str => str.matchAll(/(?<!%)%[oOsdifc]/g);
            const originalArgs = [...args];
            const styles = [];

            let matched = matchRegex(msg);
            let match;

            while ((match = matched.next())) {
              if (match.done) break;
              let value = "", d;
              const specifier = match.value[0];
              const pos = match.value.index;

              args.length ? (
                value = args.splice(0, 1)[0],
                [undefined, null].includes(value) && (value = value + ""),
                specifier === "%c" ? (styles.push({ value, pos }), value = "") :
                specifier === "%s" ? typeof value === "object" && (value = value.constructor.name) :
                specifier === "%o" || specifier === "%O" ? (d = new Date().getMilliseconds() + "", window.__objs[d] = value, value = `<c-object onclick="console.log(window.__objs[${d}])">Object</c-object>`) :
                specifier === "%d" || specifier === "%i" ? value = parseInt(value) :
                specifier === "%f" && (value = parseFloat(value))
              ) : value = specifier;

              msg = msg.substring(0, pos) + value + msg.substring(pos + 2);
              matched = matchRegex(msg);
            }

            if(styles.length){
              const toBeStyled = [];
              let remainingMsg = msg;
              styles.reverse().forEach((style, i) => {
                toBeStyled.push(remainingMsg.substring(style.pos));
                remainingMsg = msg.substring(0, style.pos);
                i === styles.length - 1 && toBeStyled.push(msg.substring(0, style.pos));
              });
              msg = toBeStyled.map((str, i) => {
                if(i === toBeStyled.length - 1) return str;
                const {value} = styles[i];
                return `<c-span style="${value}">${str}</c-span>`;
              }).reverse().join("");
            }

            msg.replace(/%%[oOsdifc]/g, "%");

            args.unshift(msg);
            return args;
        }

        function getStack(){
            const error = new Error();
            let stack = error.stack.split("\n").filter(e => e !== "");
            stack.splice(1, 1);
            const regex = /<(.*)>:(\d+):(\d+)/.exec(stack[1]) || [];
            const location = regex[1];
            const lineno = regex[2];
            const colno = regex[3];
            let src = "", res;
            location && lineno ? src = escapeHTML(`${location}: ${lineno}${colno ? ": " + colno : ""}`) : (
              res = /\((.*)\)/.exec(stack[1]),
              src = res && res[1] ? res[1] : ""
            )
            const index = src.indexOf(")");
            src = src.split("/").pop().substring(0, index < 0 ? undefined : index);
            return { location: src, stack: stack.join("\n") };
        }

        function execute(code) {
              let res = null;
              try {
                res = { type: "result", value: root.eval(code) };
              } catch (error) {
                res = { type: "error", value: error };
              }
              return res;
        }

        function onError(err) {
            const error = err.error;
            log("error", error);
        }

    })(window);
