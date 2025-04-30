/*
     ╔══════════════════════════════════════════════════╗
     ║         ╔═══╕                                    ║
     ║         ║     ©2022          ║                   ║
     ║         ║     ╦═╕ ╔══╗ ╒══╗ ═╬═ ╔══╗ ╦═╕         ║
     ║         ║     ║   ╠══╝ ╔══╣  ║  ║  ║ ║           ║
     ║         ╚═══╛ ╨   ╚══╛ ╚══╩  ╨  ╚══╝ ╨           ║
     ╟──────────────────────────────────────────────────╢
     ║             Author: Manuel Pelzer                ║
     ╟──────────────────────────────────────────────────╢
     ║                                                  ║
     ║ > Possible problems and their solutions          ║
     ║                                                  ║
     ║  Console Errors                                  ║
     ║   1. Call to eval() blocked by CSP (in Firefox)  ║
     ║                                                  ║
     ║  Workaround                                      ║
     ║   1. about:config -->                            ║
     ║      security.csp.enableNavigateTo: true         ║
     ║                                                  ║
     ║                                                  ║
     ║                                                  ║
     ╚══════════════════════════════════════════════════╝
*/


//(function(root) {
const root = window;

    String.prototype.parseFunction=function(){ eval(this); }
    Function.prototype.stringify=function(){for(var e,t=/\s/,n=/\(\)|\[\]|\{\}/,s=new Array,r=this.toString(),i=new RegExp("^s*("+(this.name?this.name+"|":"")+"function)[^)]*\\(").test(r),a="start",g=new Array,h=0;h<r.length;++h){var o=r[h];switch(a){case"start":if(t.test(o)||i&&"("!=o)continue;"("==o?(a="arg",e=h+1):(a="singleArg",e=h);break;case"arg":case"singleArg":if(g.length>0&&"\\"==g[g.length-1]){g.pop();continue}if(t.test(o))continue;switch(o){case"\\":g.push(o);break;case"]":case"}":case")":if(g.length>0){n.test(g[g.length-1]+o)&&g.pop();continue}if("singleArg"==a)throw"";s.push(r.substring(e,h).trim()),a=i?"body":"arrow";break;case",":if(g.length>0)continue;if("singleArg"==a)throw"";s.push(r.substring(e,h).trim()),e=h+1;break;case">":if(g.length>0)continue;if("="!=r[h-1])continue;if("arg"==a)throw"";s.push(r.substring(e,h-1).trim()),a="body";break;case"{":case"[":case"(":(g.length<1||'"'!=g[g.length-1]&&"'"!=g[g.length-1])&&g.push(o);break;case'"':g.length<1?g.push(o):'"'==g[g.length-1]&&g.pop();break;case"'":g.length<1?g.push(o):"'"==g[g.length-1]&&g.pop()}break;case"arrow":if(t.test(o))continue;if("="!=o)throw"";if(">"!=r[++h])throw"";a="body";break;case"body":if(t.test(o))continue;r=r.substring(h),h=(r="{"==o?r.replace(/^{\s*(.*)\s*}\s*$/,"$1"):"return "+r.trim()).length;break;default:throw""}}return s=JSON.stringify(s),(i?`function ${this.name}`:`var ${this.name} = `)+`(${s.substring(1,s.length-1).replace(/"/g,"")})`+(i?"":" => ")+`${r}`};
    EventTarget.prototype.addDelegatedListener=function(t,s,l){this.addEventListener(t,function(e){e.target&&e.target.matches(s)&&l.call(e.target,e)})};

    /*
     * Init
     */
    addEventListener("load", function() {
        addScript([
            "console",   				// -> console
            "jquery.1.12.4.min",		// -> jQuery, $
            "jquery.ui.custom",			// -> jQuery.tab
            "locales",					// -> locale
            "tag",						// -> tag, each
            "ace/ace",		            // -> ace
            "ace/modes",                // -> ace
            "ace/themes",
            "ace/workers",
            "beautifier",				// -> beautifier
            "html-minifier-terser",     // -> minifier
            "jszip.min",				// -> JsZip
            "contextmenu",              // -> ContextMenu
            "sizeof"                    // -> getSize

        ], function() {

            addStyle(["style"]);

            useDatabase = ["1", "true", undefined].includes(params.usedb) ? 1 : 0;

            store = root.localStorage && useDatabase ? root.localStorage : scriptStore;

            Locale = params.locale && locale.available.includes(params.locale) ? locale.set(params.locale) : locale.set();

            /**
             @ Contextmenu
             *
             * @param  {string}     item
             * @param  {attribute}  class
             * @param  {array}      submenu
             * @return {Element}    The DOM representation of the contextmenu
             */

            cMenu = [
                [Locale.project, "menu-project", [
                    [Locale.newProject, "new_file", "", Locale.titleStartNewProject, createProject, "n"],
                    [ Locale.saveProject, "save_project", "", Locale.titleSaveProject, saveProject, "s" ],
                    [ Locale.loadProject, "load_project", "", Locale.titleLoadProject, function () { _$("file").click(); } ],
                    [ Locale.emptyThisProject, "reset", "", Locale.titleReset, reset, "r" ],
                    [ Locale.downloadAsHtml, "download_html", "", Locale.titleDownloadAsHtml, download, "d" ]
                ]],
                [Locale.database, "menu-storage", [
                    [ Locale.removeProjectFromDatabase, "delete_project", "", Locale.titleRemoveProjectFromDatabase, removeProject, "x" ],
                    [ Locale.saveDatabaseAsZip, "save_storage", "", Locale.titleSaveDatabaseAsZip, saveStorage, "y" ]
                ]],
                ["separator"],
                ["Ace Editor", "menu-ace", [
                    [ Locale.showKeyboardShortcuts, "show-keyboard-shortcuts", "", "", () => aceShow("keyboardShortcuts"), "k" ],
                    [ Locale.showSettingsMenu, "show-settings-menu", "", "", () => aceShow("settingsMenu"), "s" ],
                    [ Locale.openCommandPallete, "open-command-pallete", "", "", () => aceShow("commandPallete"), "p" ],
                    [ Locale.enableAutocompletion, "enable-autocompletion", "", "", enableAutocompletion ],
                    [ Locale.disableAutocompletion, "disable-autocompletion", "", "", disableAutocompletion ]
                ]],
                ["separator"],
                [Locale.getWebsite, "download_from_url", "", Locale.titleGetWebsite, downloadFromUrl, "u"],
                [Locale.uploadFile, "upload_files", "", Locale.titleUploadFile, function () { _$("upload").click(); } ],
                ["separator"],
                [Locale.selectAll, "text_select_all", "", "", () => copyAndPaste("selectAll")],
                [Locale.cut, "text_cut", "", "", () => copyAndPaste("cut")],
                [Locale.copy, "text_copy", "", "", () => copyAndPaste("copy")],
                [Locale.paste, "text_paste", "", "", () => copyAndPaste("paste")],
                ["separator"],
                [Locale.toggleAutorun, "run_project", "", Locale.titleToggleAutorun, toggleAutoRender, "t" ]
            ];

            // Document creation
            tag(
                { input: { id: "file", type: "file", onchange: loadProject, class: "hide" }, parent: document.body },
                { input: { id: "upload", type: "file", multiple: 1, onchange: upload, class: "hide" }, parent: document.body },
                { div: { class: "work-container", children: [
                    { h1: {}},
                    { div: { id: "selection", class: "selection flex-space-between full-width", children: [
                        { select: { id: "locale-selection", class: "projects-selection locale-selection", onchange: switchLocale }},
                        { div: { id: "create-zip", class: "create-zip full-width"}}
                    ]}},
                    { div: { class: "title-header", children: [
                        { span: { class: "right", text: Locale.project + ":" }},
                        { div: { onclick: focusTitle, id: "title", class: "title", title: Locale.clickToChange, style: { cursor: "pointer" }, text: Locale.unnamedProject }},
                        { span: { style: { float: "right", paddingRight: "20px", position: "relative" }, children: [{ button: { id: "title-button", class: "title-button hide", text: Locale.saveName, onclick: changeTitle }}]}}
                    ]}},
                    { div: { id: "tabs", class: "tabs", children: [
                        { ul: { class: "tabs-headers", children: [
                            { li: { onclick: clickTabHeader, data: { type: "html" }, children: [{ a: { text: "HTML", class: "tab-button", id: "tab-html", data: { title: "HTML5" }, href: "#tabs-1" }}]}},
                            { li: { onclick: clickTabHeader, data: { type: "js" }, children: [{ a: { text: "JS", class: "tab-button", id: "tab-js", data: { title: "Javascript" }, href: "#tabs-2" }}]}},
                            { li: { onclick: clickTabHeader, data: { type: "ts" }, children: [{ a: { text: "TS", class: "tab-button", id: "tab-ts", data: { title: "Typescript" }, href: "#tabs-3" }}]}},
                            { li: { onclick: clickTabHeader, data: { type: "css" }, children: [{ a: { text: "CSS", class: "tab-button", id: "tab-css", data: { title: "CSS3" }, href: "#tabs-4" }}]}},
                            { li: { onclick: clickTabHeader, data: { type: "images" }, children: [{ a: { class: "tab-button", id: "tab-images", data: { title: Locale.images }, href: "#tabs-5", text: Locale.images }}]}},
                            { li: { onclick: clickTabHeader, data: { type: "assets" }, children: [{ a: { class: "tab-button", id: "tab-assets", data: { title: "Assets" }, href: "#tabs-6", text: Locale.assets }}]}},
                            { li: { class: "dummy-li", children: [{ a: { class: "dummy", id: "dummy" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project save_project", onclick: saveProject, data: { title: Locale.titleSaveProject }, children: [{ a: { id: "download-project" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project load_project", onclick: function() {_$("file").click();}, data: { title: Locale.titleLoadProject }, children: [{ a: { id: "upload-project" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project delete_project", onclick: removeProject, data: { title: Locale.titleRemoveProjectFromDatabase }, children: [{ a: { id: "remove-project" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project save_storage", onclick: () => saveStorage(), data: { title: Locale.titleSaveDatabaseAsZip }, children: [{ a: { id: "download-storage" }}]}},
                            { li: { class: "dummy-li", children: [{ a: { class: "dummy", id: "dummy", text: " " }}]}},
                            { li: { class: "ui-state-project ui-corner-top project new_file", onclick: createProject, data: { title: Locale.titleStartNewProject }, children: [{ a: { id: "new-project" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project reset", onclick: reset, data: { title: Locale.titleReset }, children: [{ a: { id: "reset" }}]}},
                            { li: { class: "dummy-li", children: [{ a: { class: "dummy", id: "dummy", text: " " }}]}},
                            { li: { class: "ui-state-project ui-corner-top project download_html", onclick: download, data: { title: Locale.titleDownloadAsHtml }, children: [{ a: { id: "download" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project download_from_url", onclick: downloadFromUrl, data: { title: Locale.titleGetWebsite }, children: [{ a: { id: "download-from-url" }}]}},
                            { li: { class: "dummy-li", children: [{ a: { class: "dummy", id: "dummy", text: " " }}]}},
                            { li: { class: "ui-state-project ui-corner-top project upload_files", onclick: () => _$("upload").click(), data: { title: Locale.titleUploadFile }, children: [{ a: { id: "uupload" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project read_as_auto", onclick: toggleSaveAs, data: { title: Locale.titleSaveAs }, children: [{ a: { id: "read-as" }}]}},
                            { li: { class: "dummy-li", children: [{ a: { class: "dummy", id: "dummy", text: " " }}]}},
                            { li: { class: "ui-state-project ui-corner-top project open_extern", onclick: openExtern, data: { title: Locale.titleOpenExtern }, children: [{ a: { id: "open-extern" }}]}},
                            { li: { class: "ui-state-project ui-corner-top project autorun_project", onclick: () => render(), ondblclick: toggleAutoRender, data: { title: Locale.titleRun }, children: [{ a: { id: "run" }}]}}
                        ]}},
                        { div: {
                            id: "tabs-1", class: "tab", style: "display: contents", children: [
                                { div: { class: "tools-container ace-cobalt border-bottom flex-space-between full-width", children: [
                                    { span: { class: "tools-info" }},
                                    { span: { id: "html_tools" }}
                                ]}},
                                { div: { class: "editor html", data: { mode: "html", id: "html_" }}}
                            ]
                        }},
                        { div: {
                            id: "tabs-2", class: "tab", style: "display: contents", children: [
                                { div: { class: "tools-container ace-cobalt border-bottom flex-space-between", children: [
                                    { span: { class: "tools-info" }},
                                    { span: { id: "js_tools" }}
                                ]}},
                                { div: { class: "editor js", data: { mode: "javascript", id: "js_" }}}
                            ]
                        }},
                        { div: {
                            id: "tabs-3", class: "tab", style: "display: contents", children: [
                                { div: { class: "tools-container ace-cobalt border-bottom flex-space-between", children: [
                                    { span: { class: "tools-info" }},
                                    { span: { id: "ts_tools" }}
                                ]}},
                                { div: { class: "editor ts", data: { mode: "typescript", id: "ts_" }}}
                            ]
                        }},
                        { div: {
                            id: "tabs-4", class: "tab", style: "display: contents", children: [
                                { div: { class: "tools-container ace-cobalt border-bottom flex-space-between", children: [
                                    { span: { class: "tools-info" }},
                                    { span: { id: "css_tools" }}
                                ]}},
                                { div: { class: "editor css", data: { mode: "css", id: "css_" }}}
                            ]
                        }},
                        { div: {
                            id: "tabs-5", class: "tab", style: "display: contents", children: [
                                { div: { class: "tools-container ace-cobalt border-bottom flex-space-between", children: [
                                    { span: { class: "tools-info" }},
                                    { span: { id: "images_tools" }}
                                ]}},
                                { div: { class: "editor images", data: { mode: "json", id: "images_" }}}
                            ]
                        }},
                        { div: {
                            id: "tabs-6", class: "tab", style: "display: contents", children: [
                                { div: { class: "tools-container ace-cobalt border-bottom flex-space-between", children: [
                                    { span: { class: "tools-info" }},
                                    { span: { id: "assets_tools" }}
                                ]}},
                                { div: { class: "editor assets", data: { mode: "json", id: "assets_" }}}
                            ]
                        }},
                        { div: {
                            id: "info", class: "infoline ace-cobalt border-top flex-space-between full-width", children: [
                                { div: { id: "editor-info", class: "editor-info" }},
                                { div: { id: "overall-size", class: "overall-size" }},
                                { div: { id: "db-line", class: "db-line", onclick: showDatabaseEntries, children: [{ span: {class: "db-state", data: { title: Locale.databaseBusyExplanation }}}, { div: { class: "db-info", data: { title: Locale.showDatabaseEntries } }}]}}
                            ]
                        }},
                        { div: { class: "cursor-position ace-cobalt full-width", children: [
                            { span: { class: "row", text: "1" }},
                            { span: { class: "column", text: "1" }}
                        ]}}
                    ]}},
                    { div: { class: "flex-space-between", children: [
                        { div: { id: "sanitize-info", class: "sanitize-info", children: [
                            { input: { type: "checkbox", id: "sanitize" }},
                            { label: { class: "sanitize-label", htmlFor: "sanitize", text: Locale.preventPotientiallyHarmfulContentFromRunning }}
                        ]}},
                        { div: { id: "project-info", class: "project-info" }}
                    ]}}
                ]}, parent: document.body },
                { div: { id: "zip-info", class: "zip-info hide" }, parent: document.body },
                { div: { id: "zip-info-container", class: "zip-info-container hide" }, parent: document.body },
                { div: { id: "container", class: "exec-container" }, parent: document.body }
            );

            ColumnDisplay   = $(".column");
            RowDisplay      = $(".row");
            Container       = _$("container");
            Download        = _$("download");
            DownloadProject = _$("download-project");
            EditorInfo      = _$("editor-info");
            Files           = _$("file");
            LocaleDiv       = _$("locale-selection");
            OverallSize     = _$("overall-size");
            RemoveProject   = _$("remove-project");
            Reset           = _$("reset");
            Run             = _$("run");
            Sanitize        = _$("sanitize");
            SaveStorage     = _$("download-storage");
            SelectContainer = _$("selection");
            Title           = _$("title");
            TitleButton     = _$("title-button");
            Upload          = _$("upload");
            WorkContainer   = $(".work-container");
            Toggler         = $("c-toggler");
            DbState         = $(".db-state");
            DbInfo          = $(".db-info");
            ZipInfo         = _$("zip-info");
            ZipInfoContainer = _$("zip-info-container");

            // Animate the database info line on startup
            function startupDatabaseInfo() {
                if (location.protocol === "file:") return;
                let dotCounter;
                DbState.classList.contains("db-busy") ? (
                  global.dots++ % 20 === 0 && (
                      dotCounter = global.dots2++ % 6,
                      DbInfo.classList.contains("monospace") || DbInfo.classList.add("monospace"),
                      DbInfo.innerHTML = Locale.initializingDatabase + ".".repeat(dotCounter) + "&nbsp;".repeat(6 - dotCounter)
                  ),
                  requestAnimationFrame(startupDatabaseInfo)
              ) : DbInfo.classList.remove("monospace");
            }
            setTimeout(startupDatabaseInfo, 100);

            // Database worker receiver
            worker.addEventListener("message", function({ data }) {
                const resolve = db.queries[data.index][0];
                db.queries[data.index].push("Done");

                // A db.queries entry with the length of 2 means, this Promise has still not resolved.
                // In that case we cannot clear the db.queries array.
                const unresolvedPromises = db.queries.filter(e => e.length === 2).length;

                if (!unresolvedPromises) db.queries = [];
                DbState.classList.remove("db-busy");
                resolve(data.result);
            });

            // Activate the editors
            each($$(".editor"), e => activateEditor(e));

            // Establish database connection
            db.connect(useDatabase).then(projects => {
                let item, _item;
                lastActiveProject = store.lastActiveProject;

                 // Check if the database contains projects, and get the last active project
                projects?.length && (
                    projects = projects.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase()),
                    projects.find(project => project.id == lastActiveProject) || (
                        store.removeItem("lastActiveProject"),
                        lastActiveProject = null
                    ),

                    // Check the url for "?open=(name or id)" and load the specified project from the database.
                    // If the url contains nothing, the last active project is loaded, or a new project is created
                    params.open ? (
                        item = "id", _item = parseInt(params.open).toString() === "NaN" ? (item = "name", params.open) : Number(params.open),
                        Project = projects.find(project => project[item] === _item)
                    ) : lastActiveProject && (Project = projects.find(project => project.id == lastActiveProject)),
                    activateProject(Project, 1)
                );

                // load details of all projects found in the database
                each(projects, project => {
                    const { id, name, created, lastEdit, size } = project;
                    Projects.push({ name, id, created, lastEdit, size });
                    // Push several infos to the database table (for showing infos about the projects)
                    databaseTable.push([name, getSize(project), getCreationDate(project), getLastEditDate(project, "short")]);
                });
                updateUI();
            });

            // Event listeners
            document.addEventListener("contextmenu",     e => (global.lastRightClickElement = e.target, checkDisable(e.target)));
            root    .addEventListener("unload",         () => { Project.id && store.setItem("lastActiveProject", Project.id)});
            Sanitize.addEventListener("change",         () => Iframe.srcdoc = Sanitize.checked ? sanitize(replaceContent(createHtml(Project))) : replaceContent(createHtml(Project)));
            Toggler .addEventListener("click",          toggleConsole);
            window  .addEventListener("keydown",        handleFullscreen);
            window  .addEventListener("mousedown",      () => updateCursorPosition());
            each($$(".tab-button"), (button, index) => button.addEventListener("click", () => editors[index].focus()));

            WorkContainer.style.height = fullHeight;

            Project  || (Project = newProject());

            // if "?usedb=0" is found in the url, no database is used.
            // Local projects are loaded instead, as long as the
            // "creationlist.txt" file is found inside of the creations folder
            useDatabase || getLocalCreations();

            // Activate the tabs to switch between the editors
            jQuery("#tabs").tabs();

            hide(TitleButton);
            updateLocals();
            setTimeout(() => each(editors, editor => editor.resize(1)), 100);
            html_editor.focus();
        });
    });

    /*
     * Constants
     */

     /*!
      * strip-comments <https://github.com/jonschlinkert/strip-comments>
      * Copyright (c) 2014-present, Jon Schlinkert.
      * Released under the MIT License.
      */
    const strip = (function() {
        'use strict';
        class Node {
          constructor(node) {
            this.type = node.type;
            if (node.value) this.value = node.value;
            if (node.match) this.match = node.match;
            this.newline = node.newline || '';
          }
          get protected() {
            return Boolean(this.match) && this.match[1] === '!';
          }
        }
        class Block extends Node {
          constructor(node) {
            super(node);
            this.nodes = node.nodes || [];
          }
          push(node) {
            this.nodes.push(node);
          }
          get protected() {
            return this.nodes.length > 0 && this.nodes[0].protected === true;
          }
        }
        const languages = {
            ada: { LINE_REGEX: /^--.*/ },
            apl: { LINE_REGEX: /^⍝.*/ },
            applescript: { BLOCK_OPEN_REGEX: /^\(\*/, BLOCK_CLOSE_REGEX: /^\*\)/ },
            csharp: { LINE_REGEX: /^\/\/.*/ },
            haskell: { BLOCK_OPEN_REGEX: /^\{-/, BLOCK_CLOSE_REGEX: /^-\}/, LINE_REGEX: /^--.*/ },
            html: { BLOCK_OPEN_REGEX: /^\n*<!--(?!-?>)/, BLOCK_CLOSE_REGEX: /^(?<!(?:<!-))-->/, BLOCK_CLOSE_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>/, BLOCK_CLOSE_STRICT_NEWLINE_REGEX: /^(?<!(?:<!-))-->(\s*\n+|\n*)/, BLOCK_CLOSE_STRICT_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>(\s*\n+|\n*)/ },
            javascript: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            lua: { BLOCK_OPEN_REGEX: /^--\[\[/, BLOCK_CLOSE_REGEX: /^\]\]/, LINE_REGEX: /^--.*/ },
            matlab: { BLOCK_OPEN_REGEX: /^%{/, BLOCK_CLOSE_REGEX: /^%}/, LINE_REGEX: /^%.*/ },
            perl: { LINE_REGEX: /^#.*/ },
            php: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^(#|\/\/).*?(?=\?>|\n)/ },
            python: { BLOCK_OPEN_REGEX: /^"""/, BLOCK_CLOSE_REGEX: /^"""/, LINE_REGEX: /^#.*/ },
            ruby: { BLOCK_OPEN_REGEX: /^=begin/, BLOCK_CLOSE_REGEX: /^=end/, LINE_REGEX: /^#.*/ },
            shebang: { LINE_REGEX: /^#!.*/ },
            hashbang: { LINE_REGEX: /^#!.*/ },
            c: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            csharp: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            css: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            java: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            js: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            less: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            pascal: { BLOCK_OPEN_REGEX: /^\(\*/, BLOCK_CLOSE_REGEX: /^\*\)/ },
            ocaml: { BLOCK_OPEN_REGEX: /^\(\*/, BLOCK_CLOSE_REGEX: /^\*\)/ },
            sass: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            sql: { LINE_REGEX: /^--.*/ },
            swift: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            ts: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            typscript: { BLOCK_OPEN_REGEX: /^\/\*\*?(!?)/, BLOCK_CLOSE_REGEX: /^\*\/(\n?)/, LINE_REGEX: /^\/\/(!?).*/ },
            xml: { BLOCK_OPEN_REGEX: /^\n*<!--(?!-?>)/, BLOCK_CLOSE_REGEX: /^(?<!(?:<!-))-->/, BLOCK_CLOSE_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>/, BLOCK_CLOSE_STRICT_NEWLINE_REGEX: /^(?<!(?:<!-))-->(\s*\n+|\n*)/, BLOCK_CLOSE_STRICT_LOOSE_REGEX: /^(?<!(?:<!-))--\s*>(\s*\n+|\n*)/ }
        };

        const constants = {
          ESCAPED_CHAR_REGEX: /^\\./,
          QUOTED_STRING_REGEX: /^(['"`])((?:\\.|[^\1])+?)(\1)/,
          NEWLINE_REGEX: /^\r*\n/
        };

        const parse = (input, options = {}) => {
          if (typeof input !== 'string') throw new TypeError('Expected input to be a string');
          const cst = new Block({ type: 'root', nodes: [] });
          const stack = [cst];
          const name = (options.language || 'javascript').toLowerCase();
          const lang = languages[name];
          if (typeof lang === 'undefined') throw new Error(`Language "${name}" is not supported by strip-comments`);
          const { LINE_REGEX, BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX } = lang;
          let block = cst;
          let remaining = input;
          let token;
          let prev;
          const source = [BLOCK_OPEN_REGEX, BLOCK_CLOSE_REGEX].filter(Boolean);
          let tripleQuotes = false;
          if (source.every(regex => regex.source === '^"""')) tripleQuotes = true;
          const consume = (value = remaining[0] || '') => {
            remaining = remaining.slice(value.length);
            return value;
          };
          const scan = (regex, type = 'text') => {
            const match = regex.exec(remaining);
            if (match) {
              consume(match[0]);
              return { type, value: match[0], match };
            }
          };
          const push = node => {
            if (prev && prev.type === 'text' && node.type === 'text') {
              prev.value += node.value;
              return;
            }
            block.push(node);
            if (node.nodes) {
              stack.push(node);
              block = node;
            }
            prev = node;
          };
          const pop = () => {
            if (block.type === 'root') throw new SyntaxError('Unclosed block comment');
            stack.pop();
            block = stack[stack.length - 1];
          };
          while (remaining !== '') {
            // escaped characters
            if ((token = scan(constants.ESCAPED_CHAR_REGEX, 'text'))) {
              push(new Node(token));
              continue;
            }
            if (block.type !== 'block' && (!prev || !/\w$/.test(prev.value)) && !(tripleQuotes && remaining.startsWith('"""'))) {
              if ((token = scan(constants.QUOTED_STRING_REGEX, 'text'))) {
                push(new Node(token));
                continue;
              }
            }
            if ((token = scan(constants.NEWLINE_REGEX, 'newline'))) {
              push(new Node(token));
              continue;
            }
            if (BLOCK_OPEN_REGEX && options.block && !(tripleQuotes && block.type === 'block')) {
              if ((token = scan(BLOCK_OPEN_REGEX, 'open'))) {
                push(new Block({ type: 'block' }));
                push(new Node(token));
                continue;
              }
            }
            if (BLOCK_CLOSE_REGEX && block.type === 'block' && options.block) {
              if ((token = scan(BLOCK_CLOSE_REGEX, 'close'))) {
                token.newline = token.match[1] || '';
                push(new Node(token));
                pop();
                continue;
              }
            }
            if (LINE_REGEX && block.type !== 'block' && options.line) {
              if ((token = scan(LINE_REGEX, 'line'))) {
                push(new Node(token));
                continue;
              }
            }
            if ((token = scan(/^[a-zABD-Z0-9\t ]+/, 'text'))) {
              push(new Node(token));
              continue;
            }
            push(new Node({ type: 'text', value: consume(remaining[0]) }));
          }
          return cst;
        };
        const compile = (cst, options = {}) => {
          const keepProtected = options.safe === true || options.keepProtected === true;
          let firstSeen = false;
          const walk = (node, parent) => {
            let output = '';
            let inner;
            let lines;
            for (const child of node.nodes) {
              switch (child.type) {
                case 'block':
                  if (options.first && firstSeen === true) {
                    output += walk(child, node);
                    break;
                  }
                  if (options.preserveNewlines === true) {
                    inner = walk(child, node);
                    lines = inner.split('\n');
                    output += '\n'.repeat(lines.length - 1);
                    break;
                  }
                  if (keepProtected === true && child.protected === true) {
                    output += walk(child, node);
                    break;
                  }
                  firstSeen = true;
                  break;
                case 'line':
                  if (options.first && firstSeen === true) {
                    output += child.value;
                    break;
                  }
                  if (keepProtected === true && child.protected === true) {
                    output += child.value;
                  }
                  firstSeen = true;
                  break;
                case 'open':
                case 'close':
                case 'text':
                case 'newline':
                default: {
                  output += child.value || '';
                  break;
                }
              }
            }
            return output;
          };
          return walk(cst);
        };
        const strip = (input, options) => {
          const opts = { ...options, block: true, line: true };
          return compile(parse(input, opts), opts);
        };
        strip.block = (input, options) => {
          const opts = { ...options, block: true };
          return compile(parse(input, opts), opts);
        };
        strip.line = (input, options) => {
          const opts = { ...options, line: true };
          return compile(parse(input, opts), opts);
        };
        strip.first = (input, options) => {
          const opts = { ...options, block: true, line: true, first: true };
          return compile(parse(input, opts), opts);
        };
        strip.parse = parse;
        return strip;
    })();

    const editors               = [];
    const databaseTable         = [];
    const editorTools           = {};
    const temp                  = {};
    const fullHeight            = "99vh";
    const reducedHeight         = "84vh";
    const params                = Object.fromEntries(new URLSearchParams(window.location.search).entries())
    const worker                = new Worker("./js/dbworker.js");
    const scriptStore           = { store: {}, getItem(item) { return this.store[item]; }, setItem: function(item, value) { return this.store[item] = value; }, removeItem: function(item) { return delete this.store[item]; }};
    const db                    = { connect: query => db.query(["connect", query]), select : query => db.query(["select",  query]), insert : query => db.query(["insert",  query]), update : query => db.query(["update",  query]), remove : query => db.query(["remove",  query]), query: ([action, query]) => { DbState.classList.add("db-busy"); return new Promise(resolve => { const index = db.queries.length; db.queries.push([resolve, index]); worker.postMessage({ action, query, index } )})}, queries: []};

    const jsonParse             = item => item ? (() => { try { return JSON.parse(item); } catch (e) { return item; }})() : null;
    const jsonStringify         = item => JSON.stringify(item, null, "  ");

    const $                     = element => document.querySelector(element);
    const $$                    = element => document.querySelectorAll(element);
    const _$                    = element => document.getElementById(element);

    const clone                 = (obj, type = {}) => extend(type, obj);
    const showWaitForZipMsg     = () => showInfo(ZipInfo, Locale.waitForZipCreationToFinish, 1);
    const show                  = element => (typeof element === "string" ? $(element) : element).classList.remove("hide");
    const hide                  = element => (typeof element === "string" ? $(element) : element).classList.add("hide");

    const each                  = (items, cb) => items.constructor === Object ? Object.entries(items).forEach(([key, value], index) => cb(key, value, index)) : [...items].forEach((key, index) => cb(key, index));
    const getCreationDate       = (project = Project) => project.created ? new Date(project.created).toLocaleString().split(", ")[0] : "---";
    const closeInfo             = () => { unblurContainer(); showInfo("#zip-info", ""); document.onclick = null; }
    const newProject            = () => ({ name: Locale.unnamed, html: "", js: "", ts: "", css: "", assets: "", images: "", created: Date.now(), lastEdit: 0 });
    const projectIsEmpty        = () =>  { for(let i = 0; i < editors.length; i++) if (editors[i].getValue().trim()) return false; return true; }
    const openExtern            = doc => open(URL.createObjectURL(new Blob([replaceContent(createHtml(Project))], {type: "text/html"})), "project-window");
    const removeHtmlComments    = source => strip(source, { language: "html" });
    const removeJsComments      = source => strip(source, { language: "javascript" });

    const Keys = (function() {
        var namedKeys = { 8: "Backspace", 9: "Tab", 13: "Return", 16: "Shift", 17: "Ctrl", 18: "Alt", 19: "Pause", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 44: "Print", 45: "Insert", 46: "Delete", 91: "MetaLeft", 92: "MetaRight", 93: "ContextMenu", 96: "Numpad0", 97: "Numpad1", 98: "Numpad2", 99: "Numpad3", 100: "Numpad4", 101: "Numpad5", 102: "Numpad6", 103: "Numpad7", 104: "Numpad8", 105: "Numpad9", "-13": "NumpadEnter", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "Numlock", 145: "Scrolllock" },
            keys = { 32: " ", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 59: ";", 61: "=", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z", 107: "+", 109: "-", 110: ".", 173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'", 111: "/", 106: "*" },
            map = {...namedKeys, ...keys, Enter: 13, Escape: 27, Del: 46 };
        each(map, e => map[e].length > 1 && (map[map[e]] = Number(e)));
        return map;
    })();

    /*
     * Variables
     */
    let cMenu, contextMenu, databaseDisplayTimeout, databaseInfo, int, lastActiveProject, store, useDatabase,
        ColumnDisplay, Container, DbState, Download, DownloadProject, EditorInfo, Files, Idoc, Iframe, Iwin, Locale, LocaleDiv, OverallSize, Project, Projects = [], Remove, Reset, RowDisplay, Run, Sanitize, SaveStorage, Select, SelectContainer, Upload, WorkContainer, Zip, ZipInfo, ZipInfoContainer,
        global = { activeElement: null, autorendering: 1, rememberChoice: 0, chosen: "", downloadScriptsAndStyles: 0, editorTimeout: 0, backup: {}, renderDelay: 0, interval: 0, interval2: 0, dots: 0, dots2: 0, preventRendering: 0, removeComments: 0, lastRightClickElement: null, logTime: Date.now(), readAs: "auto"},
        _head = `<${"!DOCTYPE html"}><${"html lang='en'"}><${"head"}>`,
        _css = `<${"style id='css_by_creator'"}>`,
        _css0 = `<${"/style"}>`,
        _body = `<${"/head"}><${"body"}>`,
        _js0 = `<${"/script"}>`,
        _js1 = `<${"script type='text/javascript'"}>`,
        _js2 = `<${"script id='js_by_creator' type='text/javascript'"}>`,
        _ts = `<${"script id='ts_by_creator' type='text/typescript'"}>`,
        _ts0 = `<${"/script"}><${"script type='text/javascript'"}>const tsTranspiledEvent=new Event("tsTranspiled"),workerFile=window.URL.createObjectURL(new Blob(["importScripts('" + (parent ? parent.location.protocol + "//" + parent.location.host : location.protocol + "//" + location.host) + "/js/typescript-worker.js', { type: 'text, javascript' });const load=sourceUrl=>{const xhr=XMLHttpRequest?new XMLHttpRequest():ActiveXObject?new ActiveXObject('Microsoft.XMLHTTP'):null;if(!xhr)return '';xhr.open('GET',sourceUrl,false);xhr.overrideMimeType&&xhr.overrideMimeType('text/plain');xhr.send(null);return xhr.status==200?xhr.responseText:''; };onmessage=({data:[sourceUrl,sourceCode]})=>{const raw=sourceCode?sourceCode:load(sourceUrl);const transpiled=ts.transpile(raw);postMessage(transpiled);}"],{type:"text/javascript"}));window.addEventListener("DOMContentLoaded",(async()=>{const e=document.getElementsByTagName("script");let t=[];for(let s=0;s<e.length;s++)if("text/typescript"===e[s].type){const r=e[s].src,n=r?null:e[s].innerHTML;t.push(new Promise((t=>{const o=new Worker(workerFile);o.postMessage([r,n]),o.onmessage=r=>{let n=r.data;const o=document.createElement("script");o.innerHTML=\`window.addEventListener('tsTranspiled', function() { \${n} })\`,e[s].replaceWith(o),t()}})))}await Promise.all(t),window.dispatchEvent(tsTranspiledEvent)}));<${"/script"}>`,
        _html = `<${"/body"}><${"/html"}>`;

    /*
     * Functions
     */

    function clickTabHeader() {
        updateSizes(this.dataset.type);
        this.firstChild.click();
        updateCursorPosition();
    }

    function toggleSaveAs() {
        const choice = [...$$("input[name='read-as']")];
        return choice.length ? (
            global.readAs_Parent.class = "ui-state-project ui-corner-top project read_as_" + {Text: "text", DataURL: "data_url", "ArrayBuffer-8": "array-8", "ArrayBuffer-16": "array-16", auto: "auto"}[global.readAs],
            closeInfo()
        ) : (
            global.backup.readAs = global.readAs,
            global.readAs_Parent = _$("read-as").parentElement,
            showForm(Locale.upload, Locale.uploadFilesAs, [[{
                type: "radio",
                name: "read-as",
                id: "Text",
                value: Locale.text,
                checked: global.readAs === "Text",
                callback: function() {
                    this.checked && (global.readAs = this.id);
                }
            }, {
                type: "radio",
                name: "read-as",
                id: "DataURL",
                value: Locale.dataUrl,
                checked: global.readAs === "DataURL",
                callback: function() {
                    this.checked && (global.readAs = this.id);
                }
            }, {
                type: "radio",
                name: "read-as",
                id: "ArrayBuffer-8",
                value: Locale.arrayBuffer8,
                checked: global.readAs === "ArrayBuffer-8",
                callback: function() {
                    this.checked && (global.readAs = this.id);
                }
            }, {
                type: "radio",
                name: "read-as",
                id: "ArrayBuffer-16",
                value: Locale.arrayBuffer16,
                checked: global.readAs === "ArrayBuffer-16",
                callback: function() {
                    this.checked && (global.readAs = this.id);
                }
            }, {
                type: "radio",
                name: "read-as",
                id: "auto",
                value: Locale.auto,
                checked: global.readAs === "auto",
                callback: function() {
                    this.checked && (global.readAs = this.id);
                }
            }], [{
                type: "button",
                id: "Ok",
                value: Locale.ok,
                callback: toggleSaveAs
            }, {
                type: "button",
                id: "stop",
                value: Locale.cancel,
                callback: () => {
                    global.readAs = global.backup.readAs;
                    closeInfo();
                }
            }]])
        );
    }

    function handleFullscreen(e) {
        global.activeElement = e.target;
        const key = Keys[e.keyCode];
        if (key === "F11") {
            const el = global.activeElement;
            e.preventDefault();
            e.stopPropagation();
            toggleFullscreen(el === Iframe || Iframe.contentDocument.contains(el) ? Iframe : el === console.container || console.container.contains(el) ? console.container : _$("tabs"));
        }
    }

    function switchLocale(e) {
        e.target.value === "new" ? (
            blurContainer(),
            e.target.value = locale.active,
            locale.showAddForm().then(e => {
                unblurContainer();
                e && updateLocals(e);
            })
        ) : e.target.value === "remove" ? (
            blurContainer(),
            e.target.value = locale.active,
            locale.showRemovable().then(e => {
                unblurContainer();
                e && (
                    updateLocals(),
                    !e.contains(locale.active) && (location.href = "?lang=en")
                );
            })
        ) : temp.toZip?.length ? (e.target.value = locale.active, showWaitForZipMsg()) : location.href = "?locale=" + e.target.value;
    }

    function updateLocals(e) {
        remove([...LocaleDiv.children]);
        each((e || locale.available).sort((a, b) => a > b), l => tag({ option: { value: l, text: Locale[l] }, parent: LocaleDiv}));
        tag({ option: { value: "new", text: "[" + Locale.addNewLanguage + "]" }, parent: LocaleDiv });
        tag({ option: { value: "remove", text: "[" + Locale.removeLanguage + "]" }, parent: LocaleDiv });
        LocaleDiv.value = locale.active;
    }

    function toggleConsole(e)  {
        if (document.querySelector("c-toggler").classList.contains("is-moving") || WorkContainer.classList.contains("blur")) return;
        WorkContainer.style.height = WorkContainer.style.height === fullHeight ? reducedHeight : fullHeight;
        setTimeout(() => each(editors, editor => editor.resize()), 400);
    }

    function debug() {
        //if (!params.debug) return;
        console.log(this.Referer);
        const date = Date.now(),
            time = String(Math.floor((date - global.logTime) / 1000) + "s uptime"),
            args = [...arguments];
        function logLine(line, time) {
            let arg;
            typeof line === "string" ? (
                line.length + time.length > 100 && (line.length = (97 - time.length), line += "..."),
                arg = line + " ".repeat(100 - line.length - time.length),
                console.log("%c" + arg + time, "color: yellow;")
            ) : console.log("%c" + line + time, "color: yellow;");

        }
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === "string") {
                if (~args[i].indexOf("\n")) {
                    args[i] = args[i].split("\n");
                    for (let a = 0; a < args[i].length; a++) logLine(args[i][a], time);
                } else logLine(args[i], time);
            } else logLine(args[i], time);
        }
    }

    async function copyAndPaste(action){
        let element = global.lastRightClickElement, text, bg, editor;
        editor = editors.find(e => e.container === element?.closest("div"));
        bg = element ? getComputedStyle(element).backgroundImage : null;
        // The target is one of the editors
        if (editor) {
            const selectedText = editor.getSelectedText() || editor.getValue();
            action === "copy" ? selectedText && copyText(selectedText) :
            action === "paste" ? editor.session.replace(editor.selection.getRange(), await navigator.clipboard.readText()) :
            action === "cut" ? selectedText && editor.session.replace(editor.selection.getRange(), (copyText(selectedText), selectedText), "") :
            action === "selectAll" && editor.selectAll();
            return setTimeout(editor.focus, 10);
        }
        // Target is an image
        if (element && action === "copy") {
            if ((element.tagName && element.tagName=== "IMG") || (bg && ~bg.indexOf("url("))) text = imageToB64(element);
            else if (element.children.length) {
                const children = [...element.children];
                for(let i = 0; i < children.length; i++) {
                    const child = children[i];
                    bg = getComputedStyle(child).backgroundImage;
                    if (child.tagName !== "IMG" && (!bg || bg === "none")) continue;
                    imageToB64(child);
                    break;
                }
            }
        }
        // Target is text or html source
        try {
            let el = element, selection, range, div;
            while (el.parentElement) el = el.parentElement;
            const win = [...document.childNodes].includes(el) ? window : Iframe.contentWindow;
            if (win.getSelection) {
                selection = win.getSelection();
                if (selection.getRangeAt) range = selection.getRangeAt(0);
                else {
                    range = win.document.createRange();
                    range.setStart(selection.anchorNode, selection.anchorOffset);
                    range.setEnd(selection.focusNode, selection.focusOffset);
                }
                selection = range.cloneContents();
                div = document.createElement("div");
                div.appendChild(selection);
                text = div.innerHTML;
            } else if (win.document.selection) text = win.document.selection.createRange().htmlText;
            else return console.log("Action '" + action + "' is not supported by this browser.");
            return text ? copyText(text) : "";
        } catch(err) { return ""; };

        function copyText(text) {
            temp.text = tag({ input: { type: "text", value: text }, parent: document.body });
            temp.text.focus();
            temp.text.select();
            document.execCommand("copy");
            temp.text.remove();
            temp.text = null;
        }

        function fetchElement(src) {
            fetch(src).then(e => e.blob()).then(blob => {
                var reader = new FileReader();
                reader.onload = () => copyText(reader.result);
                reader.readAsDataURL(blob);
            });
        }

        function imageToB64(el) {
            if (el) element = el;
            if (element.src) {
                if (element.src.startsWith("data:image/")) copyText(element.src);
                else fetchElement(element.src);
            } else {
                const bg = getComputedStyle(element).backgroundImage;
                if (~bg.indexOf("url(")) {
                    const url = bg.replace(/url\(('|")?(.*?)('|")?\)/, "$2");
                    if (~url.indexOf("data:image/")) copyText(url);
                    else fetchElement(url);
                }
            }
        }
    }

    function updateSizes(id) {
        id = id || $("li.ui-state-active > a").id.split("-")[1];
        EditorInfo.innerHTML = `${Locale.filesize}: ${getSize(editors.filter(e => e.type === id)[0].getValue())}`;
        OverallSize.innerHTML = `${Locale.projectSize}: ${getSize(Project)}`;
    }

    function updateDatabaseDisplay(returnValue) {
        let val = 0;
        each(Projects, ({ size }) => val += size);
        if (returnValue) return getSize(val);
        $(".db-info").innerHTML = `${Locale.database}: ${Projects?.length ? Projects.length : Locale.none} ${Locale.project}${Projects.length === 1 ? "" : Locale.projectPlural} (${getSize(val)})`;
    }

    function showDatabaseEntries() {
        showForm(Locale.databaseInformation, databaseInfo, [[{
            type: "button",
            id: "ok",
            value: Locale.close,
            callback: closeInfo
        }]]);
    }

    function updateCursorPosition(editor, start, end) {
        let id;
        if (!editors.includes(editor)) {
            id = $("li.ui-state-active > a").id.split("-")[1];
            editor = editors.filter(a => a.type === id)[0];
        }
        if (typeof start === "object" && typeof end === "object" && (start.row !== end.row || start.column !== end.column)) {
            RowDisplay.textContent = "From " + (start.row + 1) + ":" + (start.column + 1) + " to " + (end.row + 1) + ":" + (end.column + 1);
            ColumnDisplay.textContent = " (" + editor.getSelectedText().length + ")";
        } else {
            const {row, column} = editor.getCursorPosition();
            RowDisplay.textContent = "Row: " + (row + 1);
            ColumnDisplay.textContent = " Col: " + (column + 1);
        }
    }

    function activateEditor(e) {
        const _id = e.id = e.dataset.id;
        const __id = _id.split("_")[0];
        const ed = _id + "editor";
        const editor = ace.edit(_id);
        editor.type = __id;

        const bar = tag({ div: { class: "toolbar", children: [
                { div: { class: "toolbar-item minify", id: `${_id}minifyButton`, data: { title: Locale.titleMinifyButton }, onclick: () => editor.execCommand("minify")}},
                { div: { class: "toolbar-item beautify", id: `${_id}beautifyButton`, data: { title: Locale.titleBeautifyButton }, onclick: () => editor.execCommand("beautify") }},
                { div: { class: "toolbar-item remove-comments", id: `${_id}removeCommentsButton`, data: { title: Locale.titleRemoveCommentsButton }, style: "text-decoration: line-through;", onclick: () => editor.execCommand("removeComments") }},
                { div: { class: "toolbar-item save", id: `${_id}saveButton`, data: { title: Locale.titleSaveButton }, onclick: () => editor.execCommand("save") }},
                { div: { class: "toolbar-item load", id: `${_id}loadButton`, data: { title: Locale.titleLoadButton }, onclick: () => editor.execCommand("load") }},
                { div: { class: "toolbar-item undo", id: `${_id}undoButton`, data: { title: Locale.titleUndoButton }, onclick: () => editor.undo() }},
                { div: { class: "toolbar-item redo", id: `${_id}redoButton`, data: { title: Locale.titleRedoButton }, onclick: () => editor.redo() }},
                { div: { class: "toolbar-item fold", id: `${_id}foldAllButton`, data: { title: Locale.titleFoldAllButton }, onclick: () => editor.execCommand("foldall") }},
                { div: { class: "toolbar-item unfold", id: `${_id}unfoldAllButton`, data: { title: Locale.titleUnfoldAllButton }, onclick: () => editor.execCommand("unfoldall") }},
                { div: { class: "toolbar-item search", id: `${_id}searchButton`, data: { title: Locale.titleSearchButton }, onclick: () => editor.execCommand("find") }},
                { div: { class: "toolbar-item replace", id: `${_id}replaceButton`, data: { title: Locale.titleReplaceButton }, onclick: () => editor.execCommand("replace") }}
            ]}, parent: _$(_id + "tools")}
        );

        editorTools[__id] = {
            beautifyButton: _$(`${_id}beautifyButton`),
            minifyButton: _$(`${_id}minifyButton`),
            removeCommentsButton: _$(`${_id}removeCommentsButton`),
            saveButton: _$(`${_id}saveButton`),
            loadButton: _$(`${_id}loadButton`),
            undoButton: _$(`${_id}undoButton`),
            redoButton: _$(`${_id}redoButton`)
        };

        editor.setTheme("ace/theme/cobalt");
        editor.getSession().setMode(`ace/mode/${e.dataset.mode}`);
        editor.setOption("scrollPastEnd", 0.5);
        editor.setOption("enableLiveAutocompletion", true);

        editor.commands.addCommand({ name: "save", exec: saveTab, bindKey: { win: "ctrl-s", mac: "cmd-s" }});
        editor.commands.addCommand({ name: "load", exec: loadTab, bindKey: { win: "ctrl-l", mac: "cmd-l" }});
        editor.commands.addCommand({ name: "minify", exec: minifyTab, bindKey: { win: "ctrl-m", mac: "cmd-m" }});
        editor.commands.addCommand({ name: "beautify", exec: beautifyTab, bindKey: { win: "ctrl-b", mac: "cmd-b" }});
        editor.commands.addCommand({ name: "removeComments", exec: removeComments });
        editor.commands.addCommand({ name: "enableLiveAutocompletion", exec: enableAutocompletion });
        editor.commands.addCommand({ name: "disableLiveAutocompletion", exec: disableAutocompletion });
        editor.commands.bindKey("Ctrl-Alt-F", "foldall");
        editor.commands.addCommand({ name: "showKeyboardShortcuts", bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"}, exec: editor => ace.config.loadModule("ace/ext/keybinding_menu", module => (module.init(editor), editor.showKeyboardShortcuts() ))});

        editor.on("input", () => {
            updateToolbar(__id);
            updateSizes(__id);
        });

        editor.on("changeSelection", function(text, editor) {
            const { start, end } = editor.getSelectionRange();
            updateCursorPosition(editor, start, end);
        });

        editor.on("change", function(text, editor) {
            global.timeout && clearTimeout(global.timeout);
            let timeout = 3000, delay = 400;
            text.lines.length > 4 && (
                timeout = 0,
                delay = 300
            );
            Title.classList.remove("saved");
            global.timeout = setTimeout(() => {
                editorChanged(editor, timeout);
            }, delay);
        });

        editors.push((root[ed] = editor));
        updateSizes(__id);
        setTimeout(() => editor.resize(), 2000);
    }

    function aceShow(choice) {
        const editor = editors[[...$$(".tabs-headers li")].indexOf($(".ui-state-active"))];
        editor.execCommand({ keyboardShortcuts: "showKeyboardShortcuts", settingsMenu: "showSettingsMenu", commandPallete: "openCommandPallete", modeSelect: "modeSelect" }[choice]);
    }

    function updateUI() {
        contextMenu = new ContextMenu(cMenu);
        addProjectsToContextmenu(cMenu);
        checkDisable();
        updateDatabaseDisplay();
        createDatabaseInfos();
        makeProjectsSelection();

    }

    async function getLocalCreations() {
        const projects = [];
        try {
            let resp = await fetch("./creations/creationlist.txt");
            if (resp.status >= 400) return null;
            text = await resp.text();
            let arr = jsonParse(text);
            each(arr, (name, index) => projects.push(name.replace(/\/creations\/json\/(.*?).json/, "$1")));
            chooseFromProjects(projects, Locale.localProjectsFound, function(chosenProjects) {
                const pr = [];
                each(chosenProjects, name => {
                    fetch("./creations/json/" + name + ".json").then(p => p.text()).then(project => {
                        pr.push(jsonParse(project));
                        if (pr.length === chosenProjects.length) return processNewProjects(pr);
                    });
                });
            });
        } catch(e) {};
    }

    async function addProjectsToContextmenu(arr) {
        const menu = await addProjectsToContextArray(arr);
        contextMenu && contextMenu.destroy();
        contextMenu = new ContextMenu(menu);
        global.interval2 && clearInterval(global.interval2);
        global.interval2 = setInterval(() => {
            if (Project?.id && $("#cm_" + Project.id)) {
                clearInterval(global.interval2);
                $(`#cm_${Project.id} i.cm-i`).classList.add("active-menu");
            }
        }, 500);
    }

    function addProjectsToContextArray(menuArr = []) {
        return new Promise(resolve => {
            let menu = [];
            global.interval2 && clearInterval(global.interval2);
            global.interval2 = setInterval(() => {
                if (Select?.children.length > 1) {
                    clearInterval(global.interval2);
                    const selection = [...Select.children].filter(e => e.id).sort((a, b) => a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase());
                    if (!selection.length) resolve(menuArr);
                    let s = [...selection];
                    while(s.length) {
                        let start = selection.indexOf(s[0]) + 1;
                        let index = start + "-" + (s.length < 20 ? selection.length : start + 19);
                        menu.push(addProjectsSectionToContextmenu(s.splice(0, 20), index));
                    }
                    resolve([...menu, ...menuArr]);
                }
            }, 1000);
        });
    }

    function addProjectsSectionToContextmenu(arr, index) {
        const menu = [Locale.projects + (index ? " " + index : ""), "menu-selection"];
        const entries = [];
        each(arr, (item, index) => {
            entries.push([item.textContent, item.id.replace(/project_/, ""), "menu-option", "", () => switchProject({ target: { value: item.value }})]);
        });
        menu.push(entries);
        return menu;
    }

    function enableAutocompletion() {
        editors[[...$$(".tabs-headers li")].indexOf($(".ui-state-active"))].setOption("enableLiveAutocompletion", true);
    }

    function disableAutocompletion() {
        editors[[...$$(".tabs-headers li")].indexOf($(".ui-state-active"))].setOption("enableLiveAutocompletion", false);
    }

    function removeComments(editor, source) {
        let type, html, stylesAndScripts;
        if (~editors.indexOf(editor)) source = editor.getValue().trim();
        else (type = editor, editor = null);
        editor === editors[0] || type === "html" ? (
            source = removeHtmlComments(source),
            html = (new DOMParser()).parseFromString(source, "text/html"),
            stylesAndScripts = [...[...html.getElementsByTagName("script")].filter(e => e.innerText), ...html.getElementsByTagName("style")],
            each(stylesAndScripts, s => {
                let text = s.innerText.trim();
                s.innerText = removeJsComments(text);
            }),
            source = html.head.children.length ? "<!doctype html>\n\t" + html.documentElement.innerHTML : html.body.innerHTML
        ) : source = removeJsComments(source);
        return editor ? (
            editor.setValue(source),
            setTimeout(() => editor.clearSelection(), 0)
        ) : source;
    }

    function updateToolbar(id) {
        const editor = editors.filter(e => e.type === id)[0];
        let txt = store.getItem("_project_" + id);
        editorTools[id].loadButton.classList[!txt || txt.trim() == "" ? "add" : "remove"]("disabled");
        editorTools[id].saveButton.classList[editor.session.getUndoManager().isClean() ? "add" : "remove"]("disabled");
        editorTools[id].undoButton.classList[!editor.session.getUndoManager().hasUndo() ? "add" : "remove"]("disabled");
        editorTools[id].redoButton.classList[!editor.session.getUndoManager().hasRedo() ? "add" : "remove"]("disabled");
    }

    function saveTab(editor) {
        let id = editor.type;
        let value = editor.getValue();
        store.setItem("_project_" + id, value);
        editor.session.getUndoManager().markClean();
        updateToolbar(id);
    }

    function loadTab(editor) {
        let id = editor.type;
        (value = store.getItem("_project_" + id)) && (
            editor.setValue(value),
            setTimeout(() => editor.clearSelection(), 0),
            updateToolbar(id),
            global.edited = { id, value },
            editorChanged(editor)
        );
    }

    async function formatTab(editor, format) {
        const mode = editor.container.dataset.mode;
        const value = editor.getSelectedText() || editor.getValue();
        if (!value) return;
        const result = format === "minify" ? await minify(mode, value) : beautify(mode, value);
        result && (
            editor.getValue().length > value.length ? editor.session.replace(editor.selection.getRange(), result) : (
                editor.setValue(result),
                setTimeout(() => editor.clearSelection(), 0)
            )
        );
    }

    function beautifyTab(editor) {
        return formatTab(editor, "beautify");
    }

    function minifyTab(editor) {
        return formatTab(editor, "minify");
    }

    function addStyle(add, callback) {
        let style;
        typeof add === "string" && (add = add.startsWith("css:") ? add.replace(/^css:\s+/, "") : [add]);
        typeof add === "string" ? (
            tag({ style: { type: "text/css", textContent: add }, parent: document.head }),
            callback && callback()
        ) : (
            tag({ link: { rel: "stylesheet", href: "css/" + add.splice(0,1)[0] + ".css" }, parent: document.head }),
            add.length ? addStyle(add, callback) : callback && callback()
        );
    }

    /**
     * Loads a javascript file or creates a script with given content
     *
     * addScript([filename_array] OR javascript_string [, parentElement] [, callback() {}] );
     * @param  {array}      filename_array      filename/s of the script/s to load, without ".js", must be located inside the "./js/" folder
     * @param  {string}     javascript_string   A string starting with "javascript:", followed by the js code to execute
     * @param  {element}    parentElement       Optional: The element to append the script to (default: document.body)
     * @param  {function}   callback            Optional: Function to call, when loading of the script/s is finished
     * @return {}           No return value
     */
    function addScript(add, parent = document.body, callback) {
        let script;
        temp.add = temp.add || [];
        arguments.length === 2 && !(parent instanceof Element) && (callback = parent, parent = document.body);
        add.constructor === String && (add = add.startsWith("javascript:") ? add.replace(/^javascript:\s+/, "") : [add]);
        script = document.createElement("script");
        script.defer = 1;
        typeof add === "string" ? script.textContent = add : script.src = "js/" + add.splice(0,1)[0] + ".js";
        temp.add.push(script);
        script.onload = add.length ? () => addScript(add, callback) : () => {
            while(temp.add.length) temp.add.splice(0,1)[0].onload = null;
            callback();
        };
        parent.append(script);
    }

    function extend(object) {
        object = object || {};
        for (let i = 1; i < arguments.length; i++) {
            let obj = arguments[i];
            if (!obj) continue;
            for (let key in obj) obj.hasOwnProperty(key) && (
                typeof obj[key] === "object" ? obj[key] instanceof Array ?
                object[key] = obj[key].slice(0) : Object.keys(obj[key]).length ? extend(object[key], obj[key]) : object[key] = obj[key] : object[key] = obj[key]
            );
        }
        return object;
    }

    function remove(element) { // remove DOM-Element
        const el = typeof element === "string" ? ~element.indexOf(",") ? (element.split(",")).map(e => e.trim()) : [element] : Array.isArray(element) ? element : [element];
        each(el, e => {
            typeof e === "string" && (e = $(e));
            e instanceof Element && e.parentElement && e.parentElement.removeChild(e);
        });
    }

    /**
    * Saves any content to a file
    * save(name, type, content)
    * @param {String}      name     The name for the file
    * @param {String}      type     The file type (html, css, js,...)
    * @param {String}      content  The file content
    */
    function save(name, type, content) {
        const a = tag({ a: { download: name + "." + type, href: URL.createObjectURL(new Blob([content], { type: "text/" + type }))}});
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function arrayBufferToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    function stringToArrayBuffer(str, type = 8) {
        const buffer = new ArrayBuffer(type === 8 ? str.length : str.length * 2);
        const bufView = global.readAs.endsWith("8") ? new Uint8Array(buffer) : new Uint16Array(buffer);
        for (var i = 0, strLen = str.length; i < strLen; i++) bufView[i] = str.charCodeAt(i);
        return buffer;
    }


    /*!
    * An async reader for multiple files
    * result = await readAll(files)
    * @param  {fileList}           files   A filelist with all files to load up
    *                                      like < input type='file' > creates it
    * @return {Promise({Array})}   result  An array of key value pairs, representing filename and content of each file
    */
    async function readAll(files) {
        if (!files.length) return;
        const promises = [];
        const imageFiles = ["jpeg", "jpg", "png", "bmp", "tiff", "svg"];
        const textfiles = ["html", "js", "ts", "css", "svg", "json", "csv", "rdf", "doc", "ini", "tex", "scss", "acss", "less", "txt", "htm", "xml"];
        const fontfiles = ["woff", "woff2", "ttf", "otf", "eot"];
        each(files, file => {
            let readAs = "readAs";
            let promise = new Promise(resolve => {
                let reader = new FileReader(), type = (file.name.split(".")).pop();
                reader.onload = () => {
                    let text = reader.result;
                    if (global.readAs.startsWith("ArrayBuffer")) {
                        let arr = global.readAs.endsWith("8") ? new Uint8Array(text) : new Uint16Array(text);
                        text = escape(String.fromCharCode.apply(null, arr));
                    }
                    if (fontfiles.includes(type.toLowerCase())) {
                        let temp_text = {
                            otf: "data:@file/vnd.ms-opentype;",
                            ttf: "data:@file/x-font-ttf;",
                            eot: "data:@file/vnd.ms-fontobject;",
                            woff: "data:@file/octet-stream;",
                            woff2: "data:@file/octet-stream;"
                        }[type] + text.split(";")[1];
                        text = temp_text;
                    }
                    reader.onload = null;
                    resolve([file.name, text]);
                };
                if (global.readAs === "auto") {
                    if (imageFiles.includes(type.toLowerCase())) readAs += "DataURL";
                    else if (textfiles.includes(type.toLowerCase())) readAs += "Text";
                    else readAs += "DataURL";
                } else readAs += global.readAs.split("-")[0];
                reader[`${readAs}`](file);
                readAs = "readAs";
            });
            promises.push(promise);
        });
        return await Promise.all(promises);
    }

    /*!
    * HTML Sanitizer
    * Removes all kind of potentionally dangerous code in html text:
    * scripts, attributes starting with 'on' or src, href, xlink attributes, if
    * one of them contains a script or 'data:' value
    */
    function sanitize(str, nodes) {
        const doc = (new DOMParser()).parseFromString(str, 'text/html');
        let html = doc.getElementsByTagName("body")[0] || document.createElement('body');
        each(html.getElementsByTagName('script'), script => script.remove());
        clean(html);
        return nodes ? html.childNodes : html.innerHTML;
        function clean(node) {
            let nodes = node.children;
            each(nodes, childNode => {
                each(childNode.attributes, ({name, value}) => {
                    let val = value.replace(/\s+/g, '').toLowerCase();
                    if (name.startsWith('on') || (['src', 'href', 'xlink:href'].includes(name) && (val.includes('javascript:') || val.includes('data:')))) childNode.removeAttribute(name);
                });
                clean(childNode);
            });
        }
    }

    /**
     * Fade in or out infotext in a target container,
     * or return the current text inside it
     *
     * Example:
     * =========
     * showModal(target, message, onblur);
     * @param  {Element}        target      (mostly div) container to show or hide
     * @param  {String}         message     Any attribute key/value pair
     * @param  {boolean}        onblur      If true, the modal closes on any click outside itself
     *
     */

    function showInfo(target, msg, closeOnBlur = false, autofocus = null) {
        target === null ? target = ZipInfo : typeof target === "string" && (target = $(target));
        if (msg == null) return target.innerHTML;
        if (msg === "") {
            hide(target);
            setTimeout(() => target.innerHTML = "", 400);
        } else {
            if (typeof msg === "string") {
                target.innerHTML = msg;
                show(target);
                autofocus && (autofocus.setAttribute("autofocus", ""), setTimeout(() => autofocus.focus(), 200));
            } else if(msg instanceof Element) {
                target.innerHTML = "";
                target.appendChild(msg);
                show(target);
                autofocus && (autofocus.setAttribute("autofocus", ""), setTimeout(() => autofocus.focus(), 200));
            } else hide(target);
            if (closeOnBlur) {
                temp.target = target;
                setTimeout(() => {
                    document.onclick = function(e) {
                        if (!(temp.target.contains(e.target) || temp.target === e.target)) {
                            document.onclick = temp.target = null;
                            closeInfo();
                        };
                    };
                }, 10);
            }
        }
    }

    /**
     * Replace all assets with base64 data content
     * to be independed on any files
     *
     * Example:
     * =========
     * const html = replaceContent(source, images);
     * @param  {String}         source      An html source string, containing <image src="http://.../imagename.png"> or/and
     *                                      css like background-image: url(http://...);
     * @param  {String|Object}  images      A (stringified) object with base64 replacements. e.g. { "imagename.png": "data:image/png;base64,..." }
     *                                      If empty, the content of the images editor is used.
     * @return {String}         html        The source code with replaced images sources and css urls
     */

    function replaceContent(source, images) {
        const editor = images_editor;
        let urlRegex, urlRegex2, srcRegex;
        if ((!editor.getValue() && (!images || !Object.keys(images).length))) return source;
        const contents = images ? images.constructor === Object ? images : jsonParse(images) : jsonParse(editor.getValue());
        each(contents, (name, content) => {
            try  { urlRegex = new RegExp("(url\\(['\"])([.-@/_\\w]+)?" + name + "(['\"]\\))", "g"); } catch(_) { console.warn("(urlRegex)", _); urlRegex = null; }
            try  { urlRegex2= new RegExp("(url\\()([.-@/_\\w]+)?" + name + "(\\))", "g"); } catch(_) { console.warn("(urlRegex2)", _); urlRegex2 = null; }
            try  { srcRegex = new RegExp("('|\"|`)([.-@/_\\w]+)?" + name + "\\1", "g"); } catch(_) { console.warn("(srcRegex)", _); srcRegex = null; }
            srcRegex && (source = source.replace(srcRegex, `$1${content}$1`));
            urlRegex && (source = source.replace(urlRegex, `$1${content}$3`));
            urlRegex2 && (source = source.replace(urlRegex2, `$1${content}$3`));
        });
        return source;
    }

    function createHtml({html, js, ts, css, assets, name}) {

        html = (new DOMParser()).parseFromString(html, "text/html");

        const title = html.head.querySelector("title");
        title ? !title.innerHTML && (title.innerHTML = name) : tag({ title: { text: name }, parent: html.head});

        const [head, body] =  [html.head.innerHTML, html.body.innerHTML];

        js && (js = js.replace(/<\/(head|body|script|html)/g, '</" + "$1'));
        assets && (assets = assets.replace(/<\/(head|body|script|html)/g, '</" + "$1'));

        return _head + head + (assets ? _js1 + "var _assets_ = " + assets + _js0 : "") + (css ? _css + css + _css0 : "") + _body + body + (js ? _js2 + js + _js0 : "") + (ts ? _ts + ts + _ts0 : "") + _html;
    }

    function render(priority = 300) {
        if (global.editorTimeout) clearTimeout(global.editorTimeout);
        global.editorTimeout = setTimeout(() => {
            if (global.preventRendering) return;
            global.preventRendering = 1;
            Iframe || (
                Iframe = tag({ iframe: { style: { boxSizing: "borderBox", position: "absolute", right: 0, top: 0, width: "50vw", height: "100vh", border: "none", frameborder: 0 }, onload: iFrameOnLoad}, parent: Container }),
                //Iframe.onload = iFrameOnLoad,
                root.Iframe = Iframe
            );
            Iframe.srcdoc = Sanitize.checked ? sanitize(replaceContent(createHtml(Project))) : replaceContent(createHtml(Project));
            OverallSize.innerHTML = `${Locale.projectSize}: ${getSize(Project)}`;
            showInfo(".tools-info", `${Locale.projectCreatedOn} ${getCreationDate()}, ${getLastEditDate()}`);

            global.editorTimeout = 0;
        }, priority);
    }

    function iFrameOnLoad(){
        console.info("\nNew Session\n\n");
        console.setRoot && console.setRoot(Iframe.contentWindow); // Set the console as default console for the iframe
        Idoc = Iframe.contentDocument;
        Iwin = Iframe.contentWindow;

        Iwin.onkeydown = function(e) {
            handleFullscreen.call(this, e);
        };

        Iwin.onerror = function(msg, file, line, col, error) {
                msg = msg + (file ? " in " + file : "") + (line ? " in line " + line + (col ? ":" + col : "") : "");
                if (file && line && col) {
                    const scripts = [...Idoc.scripts];
                    const pattern = "/*-" + file + "-*/";
                    for(let i = 0; i < scripts.length; i++) {
                        const script = scripts[i];
                        if (!script.innerText || script.innerText.indexOf(pattern) === -1) continue;
                        let text = script.innerText;
                        const start = text.indexOf(pattern);
                        let end = text.indexOf("/*-", start);
                        if (!~end) end = text.length;
                        text = text.substring(start, end).split("\n")[line - 1];
                        text = text.substring(0, col) + "%c" + text.substring(col);
                        msg += "\n" + text;
                        break;
                    }
                }
                const css = "color: #ff5454; font-weight: bold;";
                console.error(msg, css);
                return true;
        };

        // Allows to copy texts inside the iframe using the custom contextmenu
        Idoc.oncontextmenu = function(e) {
            global.lastRightClickElement = e.target;
            document.oncontextmenu.call(this, e);
        };

        // Make the contextmenu work, even if the iframe is the active element
        Idoc.onclick = function(e) {
            parent.document.querySelector(".show-cm") && document.onclick.call(this, e);
        };

        each(editors, e => e.clearSelection());
        global.preventRendering = 0;
    }

    function toggleFullscreen(el) {
        if (!el instanceof Element) return;
        document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
    }

    function beautify(type, code) {
        let options = { indent_size: 4, indent_char: " " }, result;
        switch (type) {
            case "html":
                options = {
                    ...options,
                    indent_inner_html: 1,
                    wrap_line_length: 0,
                    brace_style: "collapse",
                    inline: ["a", "br", "sub", "sup", "b", "i", "img", "pre", "u"],
                    preserve_newlines: 0,
                    indent_handlebars: 1,
                    extra_liners: []
                };
                result = beautifier.html(code, options);
            break;
            case "js": case "ts": case "javascript": case "typescript":
                options = {
                    ...options,
                    jslint_happy: 0,
                    preserve_newlines: 0,
                    brace_style: "none"
                };
                result = beautifier.js(code, options);
            break;
            case "css":
                options = {
                    ...options,
                    newline_between_rules: true,
                    preserve_newlines: 0,
                    selector_separator_newline: false
                };
                result = beautifier.css(code, options);
            break;
        }
        return result;
    }

    /*
    * Minifier to minify editor contents
    *
    * This minifier uses a slightly modified version of the html-minifier-terser.js file.
    * The modification consists of adding the ability to directly access the internal modules
    * "CleanCSS" for minifying css and "Terser" for minifying javascript.
    */
    function minify(type, code) {
        let result;
        switch (type) {
            case "html":
                result = minifyHTML(code);
            break;
            case "javascript": case "typescript":
                result = minifyJS(code);
            break;
            case "css":
                result = minifyCSS(code);
            break;
        }
        return result;
    }

    function editorChanged(editor, timeout = 3000) {

        clearTimeout(global.renderDelay);

        const id = editor.type,
            value = editor.getValue();

        id === "css" && global.autorendering && (timeout = 300);

        Project[id] !== value ? global.edited = { id, value } : (
            Title.classList.add("saved"),
            global.edited = null
        );

        if (global.edited) global.renderDelay = setTimeout(() => {

            if (!global.edited) return;

            const { id, value } = global.edited;
            global.edited = null;
            Project.lastEdit = Date.now();
            Project[id] = value;
            Project.size = sizeof(Project);

            updateSizes();
            checkDisable();
            showInfo(".tools-info", `${Locale.projectCreatedOn} ${getCreationDate()}, ${getLastEditDate()}`);

            // Save the project to the database
            typeof Project.id === "number" && (
                db.update({ in: 'Projects', set: Project, where: { id: Project.id }}),
                alterLoadedProject(Project, { by: "id", fields: [[id]] }),
                Title.classList.add("saved")
            );

            id === "css" && global.autorendering ? ( // If style has changed, just refresh the css, no rendering needed.
                Idoc && Idoc.getElementById("css_by_creator") ? Idoc.getElementById("css_by_creator").innerHTML = replaceContent(value) :
                tag({ style: { id: "css_by_creator", text: replaceContent(value) }, parent: Idoc.head })
            ) : global.autorendering && !global.preventRendering && render();
            setTimeout(() => editor.focus(), 200);

        }, timeout);
    }

    /**
     *
     * @param {[url, content]: array} fromUrl
     *
     * Get the file names and contents from the input[type=file] tag or
     * (if 'fromUrl' is an array) from the given url
     * and store the contents into the corresponding editors
     */
    async function upload(source) {

        global.preventRendering = 1;
        temp.uploadAsAsset = null;
        let additionalFiles = 0,
            files = Upload.files,
            content = source?.target ? await readAll(files) : source,
            count = 0,
            currentValue,
            editor,
            i = 0,
            msg, name, type, typeIndex,
            uploadAsAsset = null,
            val, value, path;
        blurContainer();
        for (; i < content.length; i++) {
            [name, value] = content[i];
            path = name.split("/");
            path.pop();
            path = path.join("/");
            type = (name.split(".")).pop();
            type === "htm" && (type = "html");
            typeIndex = ["html", "js", "ts", "css", "png", "jpg", "gif", "bmp", "tiff", "svg", "webp", "ico"].indexOf(type);
            if (typeIndex > -1 && (uploadAsAsset === null || !global.rememberChoice)) uploadAsAsset = await askForUploadAsAsset(name);
            if (uploadAsAsset === -1) continue;
            temp.uploadAsAsset === null ? temp.uploadAsAsset = uploadAsAsset : uploadAsAsset = temp.uploadAsAsset;
            typeIndex = typeIndex > 3 ? 4 : typeIndex === -1 ? 5 : typeIndex;
            typeIndex === 5 && (uploadAsAsset = 1); // unknown file types are always assets
            editor = editors[uploadAsAsset ? 5 : typeIndex];
            if (uploadAsAsset) {
                if (type === "less") {
                    value = removeJsComments(value);
                    for(r of [[/\t/g, "\t"], [/\r/g, "\r"], [/\n/g, "\n"], [/\s+/g, " "]]) value = value.replace(r[0], r[1]);
                } else if (typeIndex < 4) {
                    const type = ["html", "javascript", "typescript", "css"][typeIndex];
                    try {
                        val = await minify(type, value);
                    } catch(e) {}
                    val && (value = val);
                }
                addFile(null, name);
                continue;
            } else if (typeIndex === 4) {
                addFile(null, name);
                continue;
            } else {
                if([0, 1, 2].includes(typeIndex) && global.autorendering) {
                    toggleAutoRender();
                    msg = Locale.autoRenderingHasDisabled;
                }
                if (typeIndex === 0) {
                    if (global.removeComments) value = removeComments("html", value);
                    if (global.downloadScriptsAndStyles) {
                        const [html, c, modules] = await stripScriptsAndStyles((new DOMParser()).parseFromString(value, "text/html"), path);
                        each(html.getElementsByTagName("a"), a => a.href && (a.href = a.href.replace(location.origin, new URL(path).origin)));
                        if (modules && modules.length) {
                            if (!html.head) html.prepend(document.createElement("head"));
                            each(modules, module => html.head.appendChild(module));
                        }
                        value = beautify("html", html.head.children.length ? "<!doctype html>" + html.documentElement.innerHTML : html.body.innerHTML);
                        additionalFiles += c;
                    }
                } else if ([1,2].includes(typeIndex)) {
                    if (global.removeComments) value = removeComments("js", value);
                    // Check for special html tags in strings and break them like
                    // '<script' becomes '<" + "script', or the scripts will not run propperly
                    try {
                        const match = value.match(/(['"`])(.*)(<\/?)(script|body|head)/)[1];
                        value = value.replace(/<(\/)?(script|body|head)/g, `<$1${match} + ${match}$2`);
                    } catch(e) {}
                }
            }
            currentValue = editor.getValue().trim(),
            value = `${typeIndex === 0 ? currentValue ? "<!--\n" + currentValue.replace(/-->/g, "-->\n<!--") + "\n-->\n\n\n" : "" : currentValue + "\n\n\n"}${typeIndex === 0 ? currentValue ? "<!-- " + name + " -->\n" : "" : "/* " + name + " */\n"}${value ? value.trim() : ""}`
            addFile(value, name);
        }
        each(editors, editor => setTimeout(() => (editor.clearSelection(), editor.gotoLine(0, 0)), 0));
        Project.lastEdit = Date.now();
        Project.size = sizeof(Project);
        Project.id && storeCurrentProject();
        global.autorendering && render();
        OverallSize.innerHTML = `${Locale.projectSize}: ${getSize(Project)}`;
        uploadFinishedMessage(msg);
        checkDisable();
        global.preventRendering = 0;
        global.rememberChoice = 0;

        function uploadFinishedMessage(msg) {
            showForm("Upload finished", `${count + additionalFiles} ${Locale[count + additionalFiles === 1 ? "fileAdded" : "filesAdded"]}${msg ? "<br><br>" + msg : ""}`, [[{
                type: "button",
                id: "ok",
                value: "Ok",
                callback: closeInfo
            }]]);
        }

        function addFile(val, name) {
            editor.setValue(val || jsonStringify({ ...jsonParse(editor.getValue()) || {}, [name]: value }));
            Project[editor.type] = val || value;
            count++;
        }

    }

    function urlContentToDataUri(url){
        return fetch(url, {
            mode: 'cors',
            headers: {
                'Origin': window.location.origin,
                'Referer': window.location.href
            }
        }).then(response => response.blob()).then(blob => new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = function(){ resolve(this.result) };
                reader.readAsDataURL(blob);
            })
        );
    }

    /**
     *
     * @param {HTML.document} source
     * @param {string} name URL the document is fetched from
     * @returns {array} [HTML.document, count of fetched style/script/link[rel=stylesheet]/img tags]
     *
     * Fetches all possible style/script/link[rel=stylesheet]/img sources,
     * puts their content into the corresponding editors and
     * removes scripts, styles and preloads from the source document.
     *
     * Returns the altered document.
     *
     */
    function stripScriptsAndStyles(source, path) {
        path.endsWith("/") && (path = path.substring(0, path.length - 1));
        return new Promise(resolve => {
            const promises = [];
            let scripts = [], modules = [], styles = [], preloads = [];
            each(source.getElementsByTagName("script"), e => {
                const t = e.getAttribute("type");
                (!t || ~t.indexOf("javascript") || ~t.indexOf("typescript")) ? scripts.push(e) : t && ~t.indexOf("module") && modules.push(e);
            });
            each(source.getElementsByTagName("link"), e => {
                e.rel && (e.rel === "stylesheet" || e.rel === "shortcut icon" ? styles.push(e) : e.rel === "preload" && preloads.push(e));
            });
            const images = [...source.getElementsByTagName("img")].filter(e => e.src && !e.src.startsWith("data:"));
            const header = { mode: "cors", headers: { Origin: window.location.origin, Referer: window.location.href }};
            each(preloads, preload => preload.remove());
            styles.push(...source.querySelectorAll("style"));
            const items = [...modules, ...scripts, ...styles, ...images];
            if (!items.length) resolve([source, 0]);
            let url, replaceOrigin = u => {
                let url;
                try {
                    url = new URL(u);
                } catch(err) {
                    if (u.startsWith("/")) {
                        let p = path.split("/");
                        while(p.length > 3) p.pop();console.log(p);
                        p = p[0] + "//" + p[2];
                        return String(p + u);
                    } else {
                        if (u.startsWith("./")) u = u.slice(1);
                        else u = "/" + u;
                        return String(path + u);
                    }
                }
                return url.origin === location.origin ? path + url.pathname : u;
            };
            each(items, item => {
                const tagName = item.tagName.toLowerCase();
                let src;
                promises.push(new Promise((resolve, reject) => {
                    tagName === "script" ? (
                        src = item.getAttribute("src"),
                        src && src !== "" ? (
                            url = replaceOrigin(src),
                            item.type && item.type === "module" ?
                            console.log("Downloading Module\n  item.src = " + item.src + "\n  replaceOrigin(item.src) = " + url) :
                            console.log("Downloading Script\n  item.src = " + item.src + "\n  replaceOrigin(item.src) = " + url),
                            fetch(url, header).then(c => c.text()).then(code => {
                                resolve([item, (code.startsWith("<") ? "/* You need to insert the source code of '" + url + "' manually! */" : code)])
                            })
                        ) : (item.textContent || item.innerText) && resolve([item, item.textContent || item.innerText])
                    ) : tagName === "link" ? (
                        url = replaceOrigin(item.getAttribute("href")),
                        console.log("Downloading Stylesheet\n  item.href = " + item.href + "\n  replaceOrigin(item.href) = " + url),
                        url && fetch(url, header).then(result => result.text()).then(css => {
                            resolve([item, css.startsWith("<") ? "/* You need to insert the source code of '" + url + "' manually! */" : css])
                        })
                    ) : tagName === "style" ? (
                        item.href ? (
                            url = replaceOrigin(item.getAttribute("href")),
                            console.log("Downloading Favicon\n  item.href = " + item.href + "\n  replaceOrigin(item.href) = " + url),
                            url && urlContentToDataUri(url).then(img => resolve([item, img]))
                        ) :
                        (item.textContent || item.innerText) && resolve([item, item.textContent || item.innerText])
                    ) : tagName === "img" && (
                        url = replaceOrigin(item.getAttribute("src")),
                        console.log("Downloading Image\n  item.src = " + item.src + "\n  replaceOrigin(item.src) = " + url),
                        url && urlContentToDataUri(url).then(img => resolve([item, img]))
                    );
                }));
            });
            Promise.all(promises).then(values => {
                const modules = [];
                each(values, arr => {
                    let [item, value] = arr, oldValue, html;
                    const tagName = item.tagName.toLowerCase();
                    value = value.trim();
                    const url = (item.src || item.href || "---Inline---").replace(location.href, "");
                    const isImage = tagName === "img" || (tagName === "link" && item.rel === "shortcut icon");
                    const isModule = tagName === "script" && item.getAttribute("type") && ~item.getAttribute("type").indexOf("module");
                    if (!isModule) {
                        const type = tagName === "script" ? (item.src && item.src.split(".").pop() === "ts") || (item.type && item.type.endsWith("typescript")) ? "ts" : "js" : isImage ? "images" : "css";
                        const editor = editors.find(e => e.type === type);
                        oldValue = editor.getValue().trim();
                        isImage ? (
                            oldValue = jsonParse(oldValue) || {},
                            oldValue[url] = value,
                            editor.setValue(jsonStringify(oldValue))
                        ) : value && !value.startsWith("<!") && editor.setValue(`${oldValue ? oldValue + "\n\n\n" : ""}/* ${url} */\n${value}`);
                        Project[type] = editor.getValue();
                        setTimeout(() => editor.clearSelection(), 0);
                        tagName !== "img" && item.remove();
                    } else {
                        modules.push(tag({ script: { type: "module", text: value }}));
                        item.remove();
                    }
                });
                resolve([source, items.length, modules]);
            });
        });
    }

    function downloadFromUrl() {
        if (this.id !== "save" && this.id !== "address") return showForm(Locale.getWebsite, Locale.pleaseEnterAddress, [[{
            type: "text",
            id: "address",
            placeholder: "http://...",
            autofocus: ""
                }, {
                    type: "checkbox",
                    id: "downloadScriptsAndStyles",
                    value: Locale.downloadScriptsAndStyles
                }, {
                    type: "button",
                    id: "save",
                    value: Locale.download,
                    callback: downloadWithCors
                }, {
                    type: "button",
                    id: "cancel",
                    value: Locale.cancel,
                    callback: closeInfo
          }
      ]]);
    }

    function downloadWithCors() {
        const url = new URL(document.getElementById("address").value).href;
        fetch(url, { mode: "cors", headers: { Origin: window.location.origin, Referer: window.location.href }}).then(response => response.text()).then(text => {
            global.downloadScriptsAndStyles = _$("downloadScriptsAndStyles").checked;
            upload([[url + (url.endsWith(".html") || url.endsWith(".htm") ? "" : "/index.html"), text]]);
        });
    }

    async function downloadWithProxy(url) {
         // Alternativ: Fetch über CORS Proxy
         // fetch(`https://api.allorigins.win/get?charset=UTF-8&url=${encodeURIComponent(url)}` // charset festlegen
         // fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` // raw daten erhalten
         // fetch(`https://api.allorigins.win/get?callback=function(a){upload([url, a])}&url=${encodeURIComponent(url)}
         const resp = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        let json;
        if (resp.ok) {
            json = await resp.json();
            return json.contents;
        } else alert("An error accured");
    }

    /**
     * Opens a form with a headline, some info text, input fields and submit/cancel buttons.
     *
     * showForm(title, text, options, closeOnBlur);
     * @param  {String}     title           The headline of the form
     * @param  {String}     text            Some info text that is shown below the headline. You  can use html for styling/formatting
     * @param  {Array}      options         [ (@array:options) [ (@array:input group) { (@single input item) type, id, name(radio only), value, callback } ] ]
     * @param  {Function}   callback        A callback function that is triggered on the click event (radio, button) or change event (text, checkbox)
     * @param  {Boolean}    closeOnBlur     If true, the form is closed when it looses focus.
     *
     */
    function showForm(title, text, options, closeOnBlur) {
        let parent = tag({ div: { id: "modal-container", children: [{ h3: { text: title }}, { hr: {}}, { div: { style: "padding: 0 20px", html: text }}, { br: {}}, { div: { id: "choice" }}]}}),
            choice = parent.querySelector("#choice"), lastAction, callbacks = [], container, textTag, autofocus = null;

        each(options, option => {
            if (!(option.filter(o => o.type === "checkbox" || o.type === "radio").length || container) && option.length > 1) {
                container = tag({ br: {}, parent: choice }, { div: { class: "flex-space-evenly" }, parent: choice });
                temp.choice = choice;
                choice = container;
            }

            each(option, input => {

                input.type === "button" ? (
                    lastAction && lastAction !== "button" && !temp.choice && tag({ br: {}, parent: choice}),
                    tag({ input: { type: "button", id: input.id || "", class: "modal-button", value: input.value, style: input.style || "" }, parent: choice })
                ) : input.type === "checkbox" ? (
                    lastAction && lastAction !== "checkbox" && tag({ br: {}, parent: choice}),
                    tag({ label: { for: input.id, style: input.style || "", children: [{ input: { type: "checkbox", id: input.id, class: input.class || "" }}, { text: " " + input.value }]}, parent: choice}, { br: {}, parent: choice }),
                    input.checked && (choice.querySelector("#" + input.id).checked = true)
                ) : input.type === "radio" ? (
                    lastAction && tag({ br: {}, parent: choice}),
                    tag({ label: { for: input.id, style: input.style || "", children: [{ input: { type: "radio", name: input.name, id: input.id, class: input.class || "" }}, { text: " " + input.value }]}, parent: choice}, { br: {}, parent: choice }),
                    input.checked && (choice.querySelector("#" + input.id).checked = true)
                ) : input.type === "text" || input.type === "number" ? (
                    lastAction && tag({ br: {}, parent: choice}),
                    textTag = tag({ label: { for: input.id, style: input.style || "", children: [{ input: { type: "text", id: input.id, class: input.class || "", placeholder: input.placeholder || "" }}]}, parent: choice}),
                    tag({ br: {}, parent: choice }),
                    input.autofocus != null && (autofocus = textTag.children[0])
                ) : input.type === "space" ? (
                    tag({ br: {}, parent: choice})
                ) : input.type === "text" && choice.appendChild(document.createTextNode(input.value));
                input.callback && callbacks.push([input.type, input.id, input.callback]);
                lastAction = input.type;
            });

            temp.choice && (
                temp.choice.appendChild(choice),
                choice = temp.choice,
                temp.choice = container = null
            );
        });

        blurContainer();
        showInfo(ZipInfo, parent, closeOnBlur, autofocus);
        callbacks.length && each(callbacks, ([type, inputId, callback]) =>  type === "radio" ? _$("modal-container").addDelegatedListener("click", "input[type='radio']", callback) : _$(inputId)[type === "button" ? "onclick" : "onchange"] = callback);
    }

    function download(e) {
        if (!Projects || projectIsEmpty()) return;
        let html, body, head, code, tagCode, action = e?.target?.id;
        if(!["html", "obj"].includes(action)) {
            return showForm("Download", Locale.createDynamicallyHtmlSource, [[{
                type: "button",
                id: "obj",
                value: Locale.dynamicalHtml,
                callback: download
            }, {
                type: "button",
                id: "html",
                value: Locale.fixedHtml,
                callback: download
            }, {
                type: "button",
                id: "stop",
                value: Locale.cancel,
                callback: closeInfo
            }]], 1);
        }
        closeInfo();
        return action === "html" ? save(Project.name.trim(), "html", replaceContent(createHtml(Project)) /*Iframe.srcdoc*/) : (
            html = (new DOMParser()).parseFromString(Iframe.srcdoc, "text/html"),
            head = tag.stringify(html.head, "document.head"),
            body = tag.stringify(html.body, "document.body"),
            tagCode = "function tag(){const e=Array.isArray(arguments[0])?arguments[0]:[...arguments],t={global:['accesskey','class','contenteditable','contextmenu','data-*','dir','draggable','dropzone','hidden','id','itemprop','lang','slot','spellcheck','style','tabindex','title'],accept:['form','input'],'accept-charset':['form'],action:['form'],align:['applet','caption','col','colgroup','hr','iframe','img','table','tbody','td','tfoot','th','thead','tr'],alt:['applet','area','img','input'],async:['script'],autocomplete:['form','input'],autofocus:['button','input','keygen','select','textarea'],autoplay:['audio','video'],autosave:['input'],bgcolor:['body','col','colgroup','marquee','table','tbody','tfoot','td','th','tr'],border:['img','object','table'],buffered:['audio','video'],challenge:['keygen'],charset:['meta','script'],checked:['command','input'],cite:['blockquote','del','ins','q'],code:['applet'],codebase:['applet'],color:['basefont','font','hr'],cols:['textarea'],colspan:['td','th'],content:['meta'],controls:['audio','video'],coords:['area'],crossorigin:['audio','img','link','script','video'],data:['object'],datetime:['del','ins','time'],default:['track'],defer:['script'],dirname:['input','textarea'],disabled:['button','command','fieldset','input','keygen','optgroup','option','select','textarea'],download:['a','area'],enctype:['form'],for:['label','output'],form:['button','fieldset','input','keygen','label','meter','object','output','progress','select','textarea'],formaction:['input','button'],headers:['td','th'],height:['canvas','embed','iframe','img','input','object','video'],high:['meter'],href:['a','area','base','link'],hreflang:['a','area','link'],'http-equiv':['meta'],icon:['command'],integrity:['link','script'],ismap:['img'],keytype:['keygen'],kind:['track'],label:['track'],language:['script'],list:['input'],loop:['audio','bgsound','marquee','video'],low:['meter'],manifest:['html'],max:['input','meter','progress'],maxlength:['input','textarea'],media:['a','area','link','source','style'],method:['form'],min:['input','meter'],multiple:['input','select'],muted:['video'],name:['button','form','fieldset','iframe','input','keygen','object','output','select','textarea','map','meta','param'],novalidate:['form'],open:['details'],optimum:['meter'],pattern:['input'],ping:['a','area'],placeholder:['input','textarea'],poster:['video'],preload:['audio','video'],radiogroup:['command'],readonly:['input','textarea'],rel:['a','area','link'],required:['input','select','textarea'],reversed:['ol'],rows:['textarea'],rowspan:['td','th'],sandbox:['iframe'],scope:['th'],scoped:['style'],seamless:['iframe'],selected:['option'],shape:['a','area'],size:['input','select'],sizes:['link','img','source'],span:['col','colgroup'],src:['audio','embed','iframe','img','input','script','source','track','video'],srcdoc:['iframe'],srclang:['track'],srcset:['img'],start:['ol'],step:['input'],summary:['table'],target:['a','area','base','form'],type:['button','input','command','embed','object','script','source','style','menu'],usemap:['img','input','object'],value:['button','option','input','li','meter','progress','param'],width:['canvas','embed','iframe','img','input','object','video'],wrap:['textarea']};function a(e,t){e.constructor===Object?Object.entries(e).forEach((([e,o],i)=>t(e,o,i))):[...e].forEach(((e,o)=>t(e,o)))}let o;function r(e){return e.replace(/-(\w)/g,((e,t)=>t.toUpperCase()))}return 1===e.length&&'string'==typeof e[0]&&(e[0]={[e[0]]:{}}),a(e,((i,n)=>{let c;i=Object.keys(i);const l=e[n][i[0]];if('text'===i[0]&&i[1])return e[n][i[1]].appendChild(document.createTextNode(e[n][i[0]]));i[1]&&(c=e[n][i[1]]),o=document.createElement(i[0]),l&&a(l,((e,n)=>{'children'===e?a(n,(e=>{tag({...e,parent:o})})):'data'===e?a(n,((e,t)=>o.dataset[e]=t)):'text'===e?o.appendChild(document.createTextNode(n)):'comment'===e?o.appendChild(document.createComment(n)):'html'===e?o.innerHTML+=n:'for'===e?o.htmlFor=n:'style'===e?'object'==typeof n?a(n,((e,t)=>o.style[e]=t)):a(n.split(';'),(e=>{let[t,i]=e.split(':').map((e=>e.trim()));o.style[r(t)]=i})):t.global.includes(e)||t[e]&&t[e].includes(i[0])?o.setAttribute(e,n):o[e]=n})),c&&c.appendChild(o)})),o}",
            tagCode += `\ntag(${head});\naddEventListener("load", function() {\n\ttag(${body});\n});`,
            code = `<${"!DOCTYPE html"}>\n<${"html"}>\n<${"head"}>\n<${"script type='text/javascript'"}>\n${tagCode}\n</${"script"}>\n</${"head"}>\n<${"body"}></${"body"}>\n</${"html"}>`,
            save(Project.name.trim(), "html", code)
        );
    }

    async function askForUploadAsAsset(name) {
        return new Promise(resolve => {
            showForm(Locale.uploadFile, Locale.shouldUploadsGoToTheAssetEditor.replace(/%file%/, name), [[{
                type: "button",
                id: "as-asset",
                value: Locale.uploadAsAsset,
                callback: () => resolve(1)
            }, {
                type: "button",
                id: "normal",
                value: Locale.detectUploadOnFileEnding,
                callback: () => resolve(0)
            }, {type: "space" }, {
                type: "checkbox",
                id: "remove-comments",
                value: Locale.removeComments + "?",
                callback: function() { global.removeComments = this.checked; }
            }, {type: "space" }, {
                type: "checkbox",
                id: "remember-choice",
                value: Locale.rememberChoiceForAllFiles + "?",
                callback: function() { global.rememberChoice = this.checked; }
            }, { type: "space" }, {
                type: "button",
                id: "stop",
                value: Locale.cancel,
                callback: () => resolve(-1)
            }]]);
        });
    }

    /**-----------------------------------------------------------------------------
     * THIS IS WHERE MAGIC HAPPENS, THE DATABASE COMES TO LIFE!
     *
     * A project becomes an independently running app within the browser!
     * Consisting of just one .html file. For each project in the database, or
     * just for individual ones, that's up to you!
     * This is where projects are exported, one .json file per project.
     * All of them, or just individual ones... again, that's up to you!
     *
     * Your selection is finally packed into one (or several, depending on the size
     * of the database) .zip file. This is then downloaded and all your projects
     * are always at hand.
     *------------------------------------------------------------------------------
     *
     * This creates one or more zip file/s containing projects.
     * You choose, which projects are beeing ziped.
     * By default, all projects will be loaded from the database
     * and then be added to a zip archive, one by one. If the overall size
     * is too big, multiple zip archives are created (max. 150MB per zip file).
     * If you use the app on an other machine, you can use these zip files
     * to add the projects to the other machines browser database. Just click
     * "Add project" in the app and point to the zip file.
     *
     * Usage: saveStorage();
     *
     */
    async function saveStorage(e) {

        if (!Projects) return;

        // Check, if there are any arguments
        if(!e || e.target) {

            // If no arguments are found, a form is shown that lets you choose, which projects will be ziped.
            let form = [[
                { type: "button", id: "data", value: Locale.onlyData, callback: () => saveStorage({ json: 1, html: 0, end: 0, count: 0 })},
                { type: "button", id: "html", value: Locale.projectAsWebsite, callback: () => saveStorage({ json: 0, html: 1, end: 0, count: 0 })},
                { type: "button", id: "datahtml", value: Locale.both, callback: () => saveStorage({ json: 1, html: 1, end: 0, count: 0 })},
                { type: "button", id: "cancel", value: Locale.cancel, callback: closeInfo },
                { type: "space" },
                { type: "checkbox", checked: 1, id: "all", value: Locale.chooseAll, style: "text-decoration: underline;", callback: function() {each($$(".zip-project"), element => element.checked = this.checked);}}
            ]];
            each(Projects, (project, i) => form.push([{ type: "checkbox", class: "zip-project", id: "zip_" + i, checked: 1, value: project.name, callback: function() {
                let all = $("input#all");
                let children = [...$$(".zip-project")];
                let checked = children.filter(e => e.checked);
                all.checked = checked.length === children.length ? true : false;
            }}]));
            return showForm(Locale.saveDatabase, Locale.whatShouldBeSaved, form);
        }

        let { json, html, end, count } = e;
        let fileName, currentFile, chunk, start;
        let zip = new JSZip();
        let creationlist = [];
        let project, projects = [];

        closeInfo();
        showInfo("#create-zip", `${Locale.buildingZipArchive}...`);
        // Are the recursively used variables already available?
        // If not, create them.
        if (!temp.toZip) {

            temp.toZip = [];

            each($$(".zip-project:checked"), element => {
                project = Projects[Number(element.id.split("_")[1])];
                temp.toZip.push(project);
                projects.push(project.id);
            });

            // If no project was chosen, get out of here.
            if (!temp.toZip.length) return (_$("create-zip").innerHTML = "");

            let totalSize = 0, i = 0, pr = [...temp.toZip];

            temp.chunks = [];

            // Load all chosen projects from the database.
            temp.projects = (await db.select({ from: "Projects", where: { id: { in: projects }}})).sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase());
            temp.chunks[i] = [];
            temp.numProjects = temp.projects.length;

            // Iterate over the projects, add up the sizes and create chunks of 150MB each.
            while(true) {
                if (!pr.length) break;
                project = pr.shift();

                // Create a list with all chosen projects, if 'export as json' was selected.
                json && creationlist.push(`/creations/json/${project.name}.json`);
                totalSize < 150000000 ? totalSize += project.size : (
                    temp.chunks[++i] = [],
                    totalSize = project.size
                );
                temp.chunks[i].push(project);
            }
        }

        chunk = temp.chunks[count];
        start = end + 1;
        end += chunk.length;

        fileName = temp.chunks.length > 1 ?
            `Creator_projects_${start}_to_${end}${html ? "_html": ""}${html && json ? "_and" : ""}${json ? "_json" : ""}` :
            `Creator_` + temp.numProjects + `_projects${html ? "_html": ""}${html && json ? "_and" : ""}${json ? "_json" : ""}`;

        // Add all projects to the zip file
        chunk.forEach(ch => {
            project = temp.projects.filter(pr => pr.id === ch.id)[0];
            // The id is not needed, since it is set by the db anyway, when adding the project to it.
            project.id && delete project.id;
            const name = project.name;
            json && zip.file(`json/${name}.json`, jsonStringify(project)),
            html && zip.file(`html/${name}.html`, replaceContent(createHtml(project)));
        });

        // If available, add the creation list to the zip together with a readme, that explains how to use the json files.
        creationlist.length && (
            zip.file("creationlist.txt", jsonStringify(creationlist)),
            zip.file("readme.txt", Locale.creationlistReadme)
        );

        // Til now that was only a little bit "pre stuff"...
        // Now the hard work begins, when JSZip compresses all the stuff.
        zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 }}, function (data) {
            currentFile = data.currentFile ? data.currentFile === "json/" || data.currentFile === "html/" ? `${Locale.creatingFilesInFolder} ${data.currentFile}` : `${Locale.compressingProject} "${data.currentFile.split(".")[0].split("/")[1] || data.currentFile}"` : "";
            _$("create-zip").innerHTML = `${Locale.buildingZipArchive} ${count + 1} ${Locale.of} ${temp.chunks.length} (${Math.floor(data.percent)} %)<br>${currentFile}`;
        }).then(content => {

            // The zip file is created.
            save(fileName, "zip", content);
            count++;

            count < temp.chunks.length ? (

                // There are projects left to be ziped, this is done recursively.
                saveStorage({ json, html, end, count })
            ) : (
                // Finished, all projects are processed.
                temp.chunks = temp.projects = temp.toZip = temp.numProjects = null,
                _$("create-zip").innerHTML = `${count > 1 ? Locale.zipArchivesHaveBeenCreated.replace(/%num%/, count) : Locale.zipArchiveHasBeenCreated}`,
                setTimeout(() => _$("create-zip").innerHTML = "", 5000)
            );
        });
    }

    function makeProjectsSelection() {
        Select ? Project.id && (Select.value = Project.id) : (
            tag({ br: {}, parent: SelectContainer }),
            Select = tag({ select: { id: "projects-selection", class: "projects-selection", onchange: switchProject, children: [{ option: { value: 0, text: Locale.projectSelection }}]}, parent: SelectContainer })
        );
            Projects && Projects.length > Select.children.length - 1 && (
                each(Projects.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase()), project => {
                    tag({ option: { value: project.id, id: "project_" + project.id, text: project.name }, parent: Select });
                }),
                Project?.id && (Select.value = Project.id),
                updateDatabaseDisplay()
            )
    }

    function sortSelection() {
        const sortedSelection = [...Select.children].filter(e => e.id).sort((a, b) => a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase());
        const s = Select.value;
        remove([...Select.children].filter(e => e.id));
        each(sortedSelection, option => Select.append(option));
        Select.value = s;
    }

    function processNewProjects(projects) {
        let length, percent, count, arr = [], int, imported = 0;
        typeof projects === "string" && (projects = jsonParse(projects));
        typeof projects === "object" && (
            Zip ? (
                length = projects.length,
                percent = 100 / length,
                count = percent,
                Zip.forEach((path, entry) => {
                    if (projects.includes(entry.name.split("/").pop().replace(".json", ""))) {
                        Zip.file(entry.name).async("string").then(content => {
                            showInfo(ZipInfo, `${Locale.loadingZip} (${Math.round(count)}%)`);
                            count += percent;
                            arr.push(content);
                        });
                    }
                }),
                int = setInterval(function() {
                    if (arr.length === length) {
                        Zip = null;
                        clearInterval(int);
                        processNewProjects(arr);
                    }
                })
            ) : Array.isArray(projects) ? (
                showInfo(ZipInfo, `${Locale.adding} ${Locale.projects}...`),
                each(projects, (c, i) => {
                    const project = { ...newProject(), ...(typeof c === "string" ? jsonParse(c) : c) };
                    getProject({ name: project.name }).then(([pr]) => {
                        let ok = 1;
                        pr && (confirm(Locale.projectAlreadyExistsOverwriteProject.replace("{{projectname}}", project.name)) ? project.id = pr.id : ok = 0);
                        ok && addToProjects(project).then(() => {
                            imported++;
                            lastImport = i === projects.length - 1;
                            if (lastImport) {
                                return showInfo(ZipInfo, `${imported} ${Locale.projectsSuccesfullyImported}`, 1),
                                setTimeout(closeInfo, 2000);
                            }
                            showInfo(ZipInfo, `${Locale.adding} ${Locale.project} "${project.name}" (${i + 1} ${Locale.of} ${projects.length})`, 0);
                        });
                    });
                })
            ) : "name" in projects && "html" in projects && "js" in projects && "ts" in projects && "css" in projects ? (
                storeCurrentProject().then(() => {
                    getProject({ name: projects.name }).then(([pr]) => {
                        let ok = 1;
                        pr && (confirm(Locale.projectAlreadyExistsOverwriteProject.replace("{{projectname}}", projects.name)) ? projects.id = pr.id : ok = 0);
                        ok && (
                            Project = {...projects},
                            addToProjects(Project).then(() => {
                                activateProject(Project);
                                checkDisable();
                            })
                        );
                    });
                })
            ) : showInfo("#project-info", "")
        );
    }

    function chooseFromProjects(arr, title, callback, texts = {}) {
        let s = [[{
            type: "checkbox",
            id: "import-all",
            checked: 1, value:
            texts.chooseAll || Locale.importAll,
            callback: function() {
                each($$(".import-project"), element => element.checked = this.checked);
            }
        }, { type: "space" }]];
        each(arr, (name, i) => s.push([{
            type: "checkbox",
            class: "import-project",
            id: "import_" + i,
            checked: 1,
            value: (i + 1) + ". " + name
        }]));
        s.push([{
            type: "button",
            class: "import-button",
            value: texts.okButton || Locale.import,
            id: "import",
            callback: () => {
                const toImport = [];
                each($$(".import-project:checked"), element => toImport.push(arr[Number(element.id.split("_")[1])]));
                if (toImport.length) return callback ? callback(toImport) : processNewProjects(toImport);
                else closeInfo();
            }
        }, {
            type: "button",
            class: "import-button",
            value: Locale.cancel,
            id: "cancel-import",
            callback: closeInfo
        }]);
        showForm(title || Locale.import, Locale.chooseProjectsToImport, s);
    }

    function saveProject() {
        let project;
        projectIsEmpty() || (
            project = clone(Project),
            project.id = null,
            save(project.name.replace(/[\\/:"*?<>|]+/g, "").trim(), "json", jsonStringify(project))
        );
    }

    function loadProject() {
        const files = Files.files;
        if (!files.length) return;
        let arr = [];
        const type = (files[0].name.split(".")).pop();
        if (!["json", "zip"].includes(type)) return;
        if (type === "zip") {
            const zip = new JSZip();
            showInfo(ZipInfo, Locale.loadingZip + " (0%)");
            zip.loadAsync(files[0]).then(function(z) {
                Zip = z;
                const zipFiles = Object.keys(z.files).filter(file => file.endsWith(".json"));
                const length = zipFiles.length;
                const percent = 100 / length;
                let count = percent;
                each(zipFiles, entry => arr.push(entry.split("/").pop().replace(".json", "")));
                chooseFromProjects(arr);
            });
        } else {
            const reader = new FileReader();
            reader.readAsText(files[0]);
            reader.addEventListener("load", () => processNewProjects(reader.result));
        }
    }

    function switchProject(e) {
        if (e.target.value < 1) return;
        storeCurrentProject().then(f => {
            if (!f) return closeInfo();
            each($$(".tab"), t => t.style.opacity = 0);
            getProject({ id: Number(e.target.value) }).then(([project]) => {
                Project = project;
                activateProject();
                checkDisable();
            });
        });
    }

    function createProject() {
        storeCurrentProject().then(e => {
            if (!e) return;
            Project = newProject();
            activateProject();
            checkDisable();
        });
    }

    function storeCurrentProject() {
        return new Promise((resolve) => {
            let name = null;
            projectIsEmpty() && !Project.id ? resolve(1) : (
                Project?.name && !Project.name.match(new RegExp(Locale.unnamed, "i"))?.length ? (
                    Project.id ? db.update({ in: 'Projects', set: Project, where: { id: Number(Project.id) }}).then(() => {
                        alterLoadedProject(Project, { by: "id" });
                        updateDatabaseDisplay();
                        resolve(1);
                    }) :
                    db.insert({ into: 'Projects', values: [Project], return: true }).then(([pr]) => {
                        Project.id = pr.id;
                        addToLoadedProjects(Project);
                        updateDatabaseDisplay();
                        resolve(1);
                    })
                ) : (name = prompt(Locale.enterNameForProject)) ? (
                    Project.name = name.trim(),
                    resolve(storeCurrentProject(Project))
                ) : name === "" ? resolve(1) : resolve(0)
            )
        });
    }

    function addToProjects(project = Project) {
        return new Promise((resolve) => {
            let where = {}, by;
            project.id ? ( where.id = project.id, by = "id" ) : ( where.name = project.name, by = "name" );
            db.select({ from: 'Projects', where }).then(([pr]) => {
                if (pr?.id) {
                    project.id = pr.id;
                    db.update({ in: 'Projects', set: project, where: { id: project.id }}).then(() => {
                        alterLoadedProject(project, { by });
                        updateDatabaseDisplay();
                        resolve();
                    });
                } else {
                    project.id = null;
                    db.insert({ into: 'Projects', values: [project], return: true }).then(([pr]) => {
                        project.id = pr.id;
                        addToLoadedProjects(project);
                        updateDatabaseDisplay();
                        createDatabaseInfos();
                        resolve();
                    });
                }
            });
        });
    }

    function activateProject(project = Project, startup) {
        if (!project) return;
        const {name, html, js, ts, css, images, assets} = project;

        project.id && (store.lastActiveProject = project.id);

        // Prevent rerendering on editor content change
        global.preventRendering = 1;
        // Put the project contents into the editors
        each([ html, js, ts, css, images, assets ], (value, index) => (editors[index].setValue(value), editors[index].moveCursorTo(0, 0)));

        /* If starting up, the contextmenu has no entries,
         * as well as the project select box.
         * In this case ignore the following code
         */
        startup || (
            // If the project has got an id, show its name in the project select box
            // If the project is not present in the projects array, add it.
            project.id ? inLoadedProjects(project) ? Select.value = project.id : addToLoadedProjects(project) : Select.selectedIndex = 0,
            // If there is an open modal window, and we're not in startup phase, close the modal.
            closeInfo()
        );

        setTimeout(() => {
            // The editor selects added content automatically, remove the selection
            each(editors, e => { e.clearSelection(); e.resize(); });

            // Show the size of the active editor below the edit area
            updateSizes($("li.ui-state-active > a").id.split("-")[1]);
        }, 100);

        // Show the creation date and the last edit date above the editor
        showInfo(".tools-info", `${Locale.projectCreatedOn} ${getCreationDate()}, ${getLastEditDate()}`);

        // The editors are still invisible (opacity=0), now that all contents are set, set opacity back to 1.
        each($$(".tab"), t => t.style.opacity = 1);

        // In case the project name was edited (inside a contenteditable div), reset the style and set status to 'saved'
        Title.innerText = Project.name;
        Title.contentEditable = false;
        Title.style.color = "";
        Title.style.backgroundColor = "";
        if (name !== Locale.unnamed) Title.classList.add("saved");

        // Stop the interval for the running dots in the 'Init database...' message on startup
        global.interval && (clearInterval(global.interval), global.interval = 0);

        // Enable global rendering again
        global.preventRendering = 0;

        // ...and render the project
        global.autorendering && render();

        // If an other project was active before, clear the active project marker inside the context menu
        $(".active-menu") && $(".active-menu").classList.remove("active-menu");

        // set the new active project marker inside the context menu
        _$("cm_" + project.id) && _$("cm_" + project.id).querySelector("i.cm-i").classList.add("active-menu");
    }

    function removeProject() {
        if (!Project.id || temp.toZip?.length) return temp.toZip.length ? showWaitForZipMsg() : undefined;
        if (confirm(Locale.thisProjectWillBeRemovedFromDatabase)) {
            db.remove({ from: "Projects", where: { id: Project.id }}).then(() => {
                removeFromLoadedProjects(Project);
                Project = newProject();
                activateProject();
                updateDatabaseDisplay();
                createDatabaseInfos();
                checkDisable();
            });
        }
    }

    function getProject(options) {
        return new Promise(resolve => {
            let key, value;
            options ? (
                [key, value] = Object.entries(options)[0],
                db.select({ from: "Projects", where: { [key]: value }}).then(([pr]) => resolve([pr]))
            ) : db.select({ from: "Projects" }).then(pr => resolve(pr));
        });
    }

    function inLoadedProjects(project) {
        return !Projects.length ? false : !!Projects.find(pr => pr.name === project.name && pr.id === project.id);
    }

    function addToLoadedProjects(project) {
        if (!project.id) return;
        tag({ option: { value: project.id,  id: "project_" + project.id, text: project.name }, parent: Select });
        sortSelection();
        const { name, id, size, lastEdit, created } = project;
        Projects.push(useDatabase ? { name, id, size, lastEdit, created } : project);
        store.setItem("Projects", JSON.stringify(Projects));
        databaseTable.push([project.name, getSize(project), getCreationDate(project), getLastEditDate(project, "short")]);
        addProjectsToContextmenu(cMenu);
        createDatabaseInfos();
        checkDisable();
    }

    function removeFromLoadedProjects(project) {
        if (!Projects.length) return;

        // remove from select box and contextmenu
        remove(["#project_" + project.id, "#cm_" + project.id]);

        //remove from Projects array
        const i = Projects.findIndex(pr => pr.id === project.id);
        if (i > -1) Projects.splice(i, 1);

        // remove from database info table
        each(databaseTable, (table, index) => table[0] === project.name && databaseTable.splice(index, 1));
        createDatabaseInfos();

        store.setItem("Projects", JSON.stringify(Projects));
        checkDisable();
    }

    function alterLoadedProject(project, options = {}) {
        if (!Projects.length) return;
        const {by, fields} = options;
        const index = Projects.findIndex(pr => pr[by] === project[by]);
        index > -1 && (
            fields?.length ? each(fields, key => Projects[index][key] && (Projects[index][key] = project[key])) : each(project, key => Projects[index][key] && (Projects[index][key] = project[key])),
            Projects[index].lastEdit = Date.now(),
            Projects[index].size = sizeof(project)
        );
        fields?.includes("name") && (
            _$("project_" + project.id).textContent = project.name,
            $("#cm_" + project.id + " span.cm-text").innerHTML = project.name,
            sortSelection()
        );
    }


    function toggleAutoRender() {
        global.preventRendering = 1;
        global.autorendering = !global.autorendering;
        global.autorendering ? Run.parentElement.classList.replace("run_project", "autorun_project") : Run.parentElement.classList.replace("autorun_project", "run_project");
        setTimeout(() => global.preventRendering = 0, 400);
    }

    function getLastEditDate(project = Project, size) {
        let day, days, last, editDay, editTime, isYesterday;
        if (!project.lastEdit) return size === "short" ? Locale.never : Locale.notEditedJet + ".";
        day = 1000 * 60 * 60 * 24;
        days = Math.floor((Date.now() - project.lastEdit) / day);
        if (days === 0) isYesterday = new Date(Date.now()).toLocaleString().split(",")[0].split(".")[0] - new Date(project.lastEdit).toLocaleString().split(",")[0].split(".")[0];
        if (size === "short") return new Date(project.lastEdit).toLocaleString().split(",")[0];
        last = days === 0 ? isYesterday ? Locale.yesterday : Locale.today : days === 1 ? Locale.yesterday : days === 2 ? Locale.twoDaysAgo : Locale.numberDaysAgo.replace("{{days}}", days);
        [editDay, editTime] = new Date(project.lastEdit).toLocaleString().split(",");
        editTime = editTime.substring(0, editTime.lastIndexOf(":"));
        days > 30 && (last += ` (${Locale.onDay} ${editDay})`);
        return `${Locale.lastEdited} ${last} ${Locale.atTime} ${editTime}`;
    }

    /* Disables tabs and contextmenu entries if they are not available */
    function checkDisable(target) {
        const empty = projectIsEmpty();
        each([Run, Reset, Download, DownloadProject], button => setButtonState(button, empty ? 0 : 1));
        setButtonState(RemoveProject, Project?.id || 0);
        setButtonState(SaveStorage, Projects.length);
        if ($(".m_project")) {
            each($(".m_project").querySelectorAll("#run_project, #reset, #delete_project, #download_html, #download_project, #save_project"), item => item.closest("li").classList[empty ? "add" : "remove"]("disabled"));
            $(".m_project#save_storage").closest("li").classList[Projects.length ? "remove" : "add"]("disabled");
        }
        function setButtonState(element, setActive) {
            element.parentElement.classList[setActive ? "remove" : "add"]("ui-state-inactive");
        }
    }

    /* Clears the contents of all editors of the current project */
    function reset() {
        const {id, created, name} = Project;
        !projectIsEmpty() && (
            blurContainer(),
            setTimeout(() => {
                confirm(Locale.attentionAllContentOfTheCurrentProjectWillBeDeletedContinue) && (
                    Project = newProject(),
                    Project = {...Project, id, lastEdit: Date.now(), created, name},
                    db.update({ in: 'Projects', set: Project, where: { id }}),
                    updateDatabaseDisplay(),
                    activateProject()
                );
                unblurContainer();
            }, 200)
        );
    }

    function blurContainer() {
        const container = [ WorkContainer, Container, Toggler ];
        each(container, c => c.classList.add("blur"));
    }

    function unblurContainer() {
        const container = [ WorkContainer, Container, Toggler ];
        each(container, c => c.classList.remove("blur"));
    }

    function getSize(item) {
        let size;
        if (!item) return "---";
        if (item === "" || item === 0 || (item.constructor === Object && !Object.keys(item).length) || (Array.isArray(item) && !item.length)) return "0 Byte";
        size = typeof item === "number" ? item : sizeof(item);
        item.constructor === Object && each(item, e => size += e.length + 2);
        let b = parseFloat(size.toFixed(2));
        let kb = b > 1023 ? parseFloat((b / 1024).toFixed(2)) : null;
        let mb = kb > 1023 ? parseFloat((kb / 1024).toFixed(2)) : null;
        return (mb ? mb + " MB" : kb ? kb + " kB" : b + " Byte").replace(".", Locale.decimalSeparator);
    }

    function createDatabaseInfos() {
        let i = Locale.databaseInformation, il = i.length, c = Locale.created, n = Locale.projects, s = Locale.size, l = Locale.lastEdit;
        il % 2 !== 0 && il++;
        let spaces = [(80 - il) * 0.5, 42 - n.length, 12 - s.length, 13 - c.length], table = [];
        table.push(`  ${n}${" ".repeat(spaces[1])}${s}${" ".repeat(spaces[2])}${c}${" ".repeat(spaces[3])}${l}`);
        table.push(`${"-".repeat(80)}`);
        each(databaseTable.sort((a, b) => a[0].toLowerCase() > b[0].toLowerCase()), project => {
            let [name, size, created, lastEdit] = project;
            table.push(`  ${name}${" ".repeat(39 - name.length)}${" ".repeat(10 - size.length)}${size}${" ".repeat(14 - created.length)}${created}${" ".repeat(13 - lastEdit.length)}${lastEdit}`);
        });
        let p = `${Locale.databaseSize}: ${updateDatabaseDisplay(1)}`;
        let q = `${Projects.length} ${Locale.projectsAvailable}`;
        table.push("-".repeat(80));
        table.push(`${q}${" ".repeat(80 - ((p + q).length))}${p}`);
        databaseInfo = "<pre>" + table.join("\n") + "</pre>";
    }

    function isEdited() {
        if (!Project.id) return false;
        const arr = ["html", "js", "ts", "css", "assets", "images"];
        let eValue, pValue, length, ok = 1, i = 0, j = 0;
        db.select({ from: "Projects",  where: { id: Number(Project.id)}}).then(([project]) => {
            if (!project?.id) return 0;
            each(Object.keys(project), key => {
                if (!~["lastEdit", "id", "created", "name", "size"].indexOf(key)) {
                    eValue = editors[arr.indexOf(key)].getValue();
                    pValue = project[key];
                    if (eValue.length !== pValue.length) ok = 0;
                    if (ok) for (j = 0; j < eValue.length; j++) {
                        if (eValue[j] !== pValue[j]) ok = 0;
                    }
                }
            });
            return !ok;
        });
    }

    function focusTitle() {
        if(typeof Title.onmousedown === "function") return;
        Title.contentEditable = true;
        Title.style.color = "#ddd";
        Title.style.backgroundColor = "#55a";
        Title.focus();
        Title.dataset.name = Title.innerText;
        Title.onkeydown = editTitle;
        Title.onblur = changeTitle;
        Title.onmousedown = editTitle;
    }

    function blurTitle() {
        Title.contentEditable = false;
        Title.style.color = Title.style.backgroundColor = "";
        Title.onkeydown = Title.onblur = Title.onmousedown = null;
        Title.blur();
        hide(TitleButton);
	editors[[...$$(".tabs-headers li")].indexOf($(".ui-state-active"))].focus();

    }

    function changeTitle() {
        let name = Title.innerText.trim();
        Title.classList.add("saved");
        if (!name || name === Locale.unnamed) {
            Title.innerText = Title.dataset.name;
            return blurTitle();
        }
        Project.name = name;
        Project.id ? db.update({ in: 'Projects', set: { name }, where: { id: Number(Project.id) }}).then(() => {
            alterLoadedProject(Project, { fields: ["name"], by: "id" });
            updateDatabaseDisplay();
        }) :
        db.insert({ into: 'Projects', values: [Project], return: true }).then(([project]) => {
            Project.id = project.id;
            addToLoadedProjects(Project);
            updateDatabaseDisplay();
            Select.value = Project.id;

        });
        blurTitle();
    }

    function editTitle(e) {
        const key = event.type === "mousedown" ? 40 : e.keyCode;
        if (event.type === "mousedown") setTimeout(() => Title.onmousedown = null, 500);
        if (!~[8, 13, 27].indexOf(key) && Keys[key].length > 1) return Title.style.color = Title.style.backgroundColor = "";
        if (key === 27) {
            Title.innerText = Title.dataset.name;
            blurTitle();
        } else if (key === 13) {
            e.preventDefault();
            changeTitle();
        } else if (TitleButton.classList.contains("hide")) show(TitleButton);
        if (Title.style.color) {
            if (Keys[key].length == 1 || key === 8) Title.innerText = "";
            Title.style.color = Title.style.backgroundColor = "";
        }
    }

    root.openExtern = openExtern;

//})(window);
