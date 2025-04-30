(function(root, factory) {

	root.ContextMenu = factory();

})(this, function() {

	const each = (items, cb) => items.constructor === Object ? Object.entries(items).forEach(([key, value], index) => cb(key, value, index)) : [...items].forEach((key, index) => cb(key, index));

	const tag = this.tag || function() {
        const args = Array.isArray(arguments[0]) ? arguments[0] : [...arguments];
        let element, k, v;

        args.length === 1 && typeof args[0] === "string" && (args[0] = { [args[0]]: {} });

        each(args, (arg, i) => {
            let parent;
            arg = Object.keys(arg);
            const attr = args[i][arg[0]];
			if (arg[1])  {
				parent = args[i][arg[1]];
            	if (arg[0] === "text") return parent.appendChild(document.createTextNode(args[i][arg[0]]));
	            if (arg[0] === "comment") return parent.appendChild(document.createComment(args[i][arg[0]]));
			}
            element = document.createElement(arg[0]);
            attr && each(attr, (key, value) => {
                key === "children" ? each(value, child => child.constructor.name === "Object" ? tag({ ...child, parent: element }) : element.append(child)) :
                key === "dataset" ? each(value, (k, v) => element.dataset[k] = v) :
                key === "text" ? element.appendChild(document.createTextNode(value)) :
                key === "comment" ? element.appendChild(document.createComment(value)) :
                key === "html" ? element.innerHTML += value :
                key === "for" ? element.htmlFor = value :
                key === "style" ? typeof value === "object" ?
                    each(value, (k, v) => element.style[k] = v) :
                    each(value.split(";"), entry => element.style[toCamelCase(([k, v] = entry.split(":").map(e => e.trim())), k)] = v) :
					element[key] = value;
            });
            parent && parent.appendChild(element);
        });

        return element;
    }

	const toCamelCase = str => str.replace(/-(\w)/g, (e, f) => f.toUpperCase());

	const rect = element => element.getBoundingClientRect();

	class cm {

		constructor(arr) {
			this.originalArray = arr;
			this.init();
		}

		elements = [];
		originalArray = null;
		menuElement = null;
		subElements = [];
		parents = [];
		isInit = false;
		styleElement = null;

		destroy = function() {
			const menu = document.querySelector("menu");
			document.oncontextmenu = null;
			document.onkeydown = null;
			menu && menu.remove();
			this.styleElement.remove();
			this.elements = [];
			this.subElements = [];
			this.parents = [];
			this.menuElement = null;
			this.styleElement = null;
			this.isInit = false;
		};

		keysOn = function() {
			document.onkeydown = this.events("keys");
		};

		keysOff = function() {
			document.onkeydown = null;
		};

		addChild = function(menu, child) {
			let parent;
			(child === null || child === undefined) ? (
				parent = this.menuElement,
				child = menu
			 ) : parent = this.parents[menu];
			const element = this.addItem(child);
			parent.appendChild(element);
			child.length > 3 && (child === menu ? this.elements.push(element) : this.subElements.push(element));
		};

		removeChild = function(menu, item) {
			let parent, child;
			if (typeof menu === "string" && !item && document.getElementById("" + menu)) {
				child = document.getElementById("" + menu);
				if (this.elements.includes(child)) this.elements.splice(this.elements.indexOf(child), 1);
				else this.subElements.splice(this.subElements.indexOf(child), 1);
			} else if (typeof menu === "number" && !item) {
				child = this.elements.length > menu && menu >= 0 ? this.elements[menu] : null;
				if (!child) return;
				this.elements.splice(menu, 1);
			} else {
				child = this.parents.length > menu && menu >= 0 && this.parents[menu].children.length > item && item >= 0 ? this.parents[menu].children[item] : null;
				if (!child) return;
				this.subElements.splice(this.subElements.indexOf(child), 1);
			}
			child && child.parentElement.removeChild(child);
		};

		init() {
			if (!this.originalArray) return;
			this.menuElement = this.createContextMenu(this.originalArray, document.body);
			this.styleElement = tag({ style: { text: this.style() }, parent: document.head });
			this.menuElement.style.top = "-300px";
			document.oncontextmenu = this.events("contextmenu");
			document.onkeydown = this.events("keys");
			this.isInit = true;
		};

		events(e) {
			return e === "contextmenu" ? event => this.onContextMenu.call(this, event) :
			e === "contextmenuout" ? event => this.onContextmenuOut.call(this, event) :
			e === "keys" ? event => this.onKey.call(this, event) :
			e === "keyson" ? event => this.keysOn.call(this, event) :
			e === "keysoff" ? event => this.keysOff.call(this, event) : null;
		}

		addItem(item) {
			const [content, id, cl, title, onclick, key] = item;
			return tag({ li: { id: `cm_${id}`, classList: "cm-item", title, onclick, children: [
				{ button: { id, classList: "cm-btn " + cl, children: [
					{ i: { classList: "cm-i " + id }},
					{ span: { classList: "cm-text", html: content }},
					{ span: { classList: "cm-key", text: key || "" }}
				]}}
			]}});
		};

		addSubItem(item) {
			const [content, cl, arr] = item;
			const parent = tag({ li: { classList: "cm-item submenu", children: [{ button: { classList: "cm-btn", children: [{ i: { classList: "cm-i " + cl }}, { span: { classList: "cm-text", html: content }}]}}]}});
			const subMenu = this.createContextMenu(arr, parent);
			this.parents.push(subMenu);
			parent.append(subMenu);
			return parent;
		}

		addSeparator() {
			return tag({ li: { classList: "cm-separator" }});
		}

		createContextMenu(arr, parent) {
			const menu = tag({ menu: { classList: "cm" }, parent});
			each(arr, args => {
				const child = [0, this.addSeparator, 0, this.addSubItem, this.addItem, this.addItem, this.addItem][args.length].call(this, args);
				args.length > 3 && (parent === document.body ? this.elements.push(child) : this.subElements.push(child));
				menu.append(child);
			});
			return menu;
		}

	    showMenu(e) {
	        const box = rect(this.menuElement),
	            submenus = this.parents,
	            doc = document.compatMode && document.compatMode == "CSS1Compat" ? document.documentElement : document.body;

	        let left, top, boxWidth, boxHeight;

	        // CALCULATE THE POSITION FOR THE CONTEXTMENU TO SHOW UP
			boxWidth = e.screenX + box.width > innerWidth - 30 ? e.screenX + box.width - innerWidth : 0;
			boxHeight = e.y + box.height > innerHeight - 20 ? e.y + box.height - innerHeight : 0;
	        left = parseInt(e.screenX - boxWidth + doc.scrollLeft),
	        top = parseInt(e.y - boxHeight + doc.scrollTop),

	        // SET THE POSITION OF THE MENU BOX
	        this.menuElement.style.top = top + "px";
	    	this.menuElement.style.left = left + "px";

	        // AND DON'T WE FORGET ABOUT THE SUBMENU BOXES, THEY ALSO NEED TO BE POSITIONED
	        each(submenus, a => {
				let subbox = rect(a);
	            a.style.top = e.y + subbox.height > innerHeight - 20 ? "unset" : "-10px";
	            a.style.left = e.screenX + box.width + subbox.width > innerWidth - 30 ? "unset" : "96%";
	            a.style.right = e.screenX + box.width + subbox.width > innerWidth - 20  ? (box.width - 10) + "px" : "unset";
	            a.style.bottom = e.y + subbox.height > innerHeight - 20 ? "-10px" : "unset";
				// Check if a submenu is larger than top or bottom or the screen and correct its position if needed
				let s = rect(a);
				(s.top < 0 || s.height + s.top > innerHeight) && (
					a.style.top    = boxHeight ? "unset" : `-${s.top}px`,
					a.style.bottom = boxHeight ? `${s.bottom - innerHeight}px` : "unset"
				);
	        });
			// ...and finally show the contextmenu
	        this.menuElement.classList.add("show-cm");
	    }

		onContextMenu(e) {
			e.preventDefault();
			this.showMenu(e);
			document.onclick = this.events("contextmenuout");
			this.events("keyson");
		}

		onContextmenuOut(e) {
			// CHECK IF THE CONTEXTMENU NEEDS TO BE CLOSED OR NOT
			(e.target.closest("button") && e.target.closest("button").id || !e.target.closest("menu")) && (
				e.preventDefault(),
				e.stopPropagation(),
				document.querySelector(".show-cm")?.classList.remove("show-cm"),
				document.onclick = null,
				this.events("keysoff")
			);
		}

		onKey(e) {
			if (!this.menuElement?.classList.contains("show-cm")) return;
			e.preventDefault();
			e.stopPropagation();
			const key = e.key;
			const [element] = [...this.menuElement.querySelectorAll(".cm-key")].filter(el => el.textContent === key);
			element && element.closest("li").onclick && element.closest("li").onclick();
			this.menuElement.classList.remove("show-cm");
			document.onclick = null;
		}
		style() {
			return [
				".cm{position:absolute;min-width:150px;padding:2px;margin:0;border:1px solid #bbb;background-color:#eee;background-image:linear-gradient(to bottom,#fff 0%,#e5e5e5 100px,#e5e5e5 100%);z-index:20000000001;border-radius:3px;box-shadow:1px 1px 4px rgba(0,0,0,.2);opacity:0;transition:transform 0.1s ease-out,opacity 0.1s ease-out;pointer-events:none;z-index:2147483647;}",
				".cm-item{display:block;position:relative;margin:0;padding:0;white-space:nowrap;}",
				".cm-btn{line-height:8px;overflow:visible;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;display:flex;width:100%;color:#444;font-family:'Roboto',sans-serif;font-size:13px;text-align:left;align-items:center;cursor:pointer;border:1px solid transparent;white-space:nowrap;padding:8px 8px;border-radius:3px;}",
				".cm-btn::-moz-focus-inner,.cm-btn::-moz-focus-inner{border:0;padding:0;}",
				".cm-text{margin-left:25px;}",
				".cm-btn i{position:absolute;left:8px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);}",
				".cm-item:hover > .cm-btn{color:#fff;outline:none;background-color:#2E3940;background-image:-webkit-linear-gradient(to bottom,#5D6D79,#2E3940);background-image:linear-gradient(to bottom,#5D6D79,#2E3940);border:1px solid #2E3940;}",
				".cm-item.disabled{opacity:.5;pointer-events:none;}",
				".cm-item.disabled .cm-btn{cursor:default;}",
				".cm-separator{display:block;margin:7px 5px;height:0;border-bottom:1px solid #aaa;}",
				".cm-item.submenu::after{content:'';position:absolute;right:6px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);border:5px solid transparent;border-left-color:#808080;}",
				".cm-item.submenu:hover::after{border-left-color:#fff;}",
				".show-cm,.cm-item:hover > .cm{opacity:1;-webkit-transform:translate(0,0) scale(1);transform:translate(0,0) scale(1);pointer-events:auto;}",
				".cm-item:hover > .cm{-webkit-transition-delay:100ms;transition-delay:300ms;}",
				".cm-i{display:inline-block;margin:0;padding:0;height:16px;width:16px;text-align:center;z-index:1;}",
				".cm-key {width:100%;text-align:right;text-transform:uppercase;opacity:0.5;}"
			].join("");
		}
	};
	return cm;
});
