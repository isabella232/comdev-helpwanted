/*
 Licensed to the Apache Software Foundation (ASF) under one or more
 contributor license agreements.  See the NOTICE file distributed with
 this work for additional information regarding copyright ownership.
 The ASF licenses this file to You under the Apache License, Version 2.0
 (the "License"); you may not use this file except in compliance with
 the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

var diff = ['Beginner', 'Journeyman', 'Intermediate', 'Advanced', 'Expert']
var langs = ['c','xml','c++','c-sharp','java','javascript','css','html','perl','ruby','lua','python','go','rust', 'erlang', 'swift', 'groovy', 'haskell']
var types = ['programming', 'web design', 'marketing', 'documentation', 'community', 'translation']
var types_long = {
    programming: "Programming and Development",
    'web design': "Web Design",
    marketing: 'Marketing and Publicity',
    documentation: 'Documentation and Guides',
    community: 'Community Outreach',
    translation: 'Translation'
}

var diff_explanation = [
    'This is an easy task that anyone can get started on',
    'This requires a bit of knowledge of the project, but otherwise is an easy task',
    'This requires a good knowledge of the project',
    'This requires a good knowledge of the project and good technical skills',
    'This requires intimate knowledge of the project and excellent technical skills'
]

var spoken_langs = ['english', 'french', 'german', 'spanish', 'russian', 'italian', 'japanese', 'chinese']
var website_langs = ['css','javascript','html']
var projects = ['all projects']
var cjson = {}

langs.sort()
types.sort()

function getAsyncJSON(theUrl, xstate, callback) {
	var xmlHttp = null;
	if (window.XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlHttp.open("GET", theUrl, true);
	xmlHttp.send(null);
	xmlHttp.onreadystatechange = function(state) {

		if (xmlHttp.readyState == 4 && xmlHttp.status == 200 || xmlHttp.status == 404) {
			if (callback) {
				if (xmlHttp.status == 404) {
					callback({}, xstate);
				} else {
					window.setTimeout(callback, 0.05, JSON.parse(xmlHttp.responseText), xstate);
				}
			}
		}
	}
}

var wstate = {}

function wizard(step, arg) {
    var obj = document.getElementById('innerpicker')
    if (!step) {
        step = 1
    }
    if (step == 1) {
        wstate = {}
        obj.innerHTML = "<h2 style='text-align: center;'>What sort of work would you like to do?</h2>"
        for (var i in types) {
            obj.innerHTML += "<img style='vertical-align: middle;' src='images/icon_" + types[i].replace(/\s+/g, "") + ".png'/><big> <a href='javascript:void(0);' onclick='wizard(2, \"" + types[i] + "\");'>" + types_long[types[i]] + "</a></big><br/><br/>"
        }
        obj.innerHTML += "<br/><a href='javascript:void(0);' onclick='fetchItems();'><big>...Just show me everything</big></a>"
    }
    if (step == 2 && arg) {
        wstate = {
            type: arg
        }
        
        obj.innerHTML = "<h2 style='text-align: center;'>Which languages are you proficient in?</h2>"
        obj.innerHTML += "<small>You don't need to pick a language, but it will help narrow down the tasks available for you.</small><br/>"
        
        if (arg == 'programming' || arg == 'documentation') {
            for (var i in langs) {
                var div = document.createElement('div')
                div.style.float = "left"
                div.style.width = "100px"
                var cb = document.createElement('input')
                cb.setAttribute("type", "checkbox")
                cb.setAttribute("id", "plang_" + langs[i])
                var lbl = document.createElement('label')
                lbl.setAttribute("for", "plang_" + langs[i])
                var txt = document.createTextNode(langs[i])
                lbl.appendChild(txt)
                div.appendChild(cb)
                div.appendChild(lbl)
                obj.appendChild(div)
            }
            obj.appendChild(document.createElement('br'))
        } else if (arg == 'web design') {
            for (var i in website_langs) {
                var div = document.createElement('div')
                div.style.float = "left"
                div.style.width = "100px"
                var cb = document.createElement('input')
                cb.setAttribute("type", "checkbox")
                cb.setAttribute("id", "plang_" + website_langs[i])
                var lbl = document.createElement('label')
                lbl.setAttribute("for", "plang_" + website_langs[i])
                var txt = document.createTextNode(website_langs[i])
                lbl.appendChild(txt)
                div.appendChild(cb)
                div.appendChild(lbl)
                obj.appendChild(div)
            }
            obj.appendChild(document.createElement('br'))
        } else {
            for (var i in spoken_langs) {
                var div = document.createElement('div')
                div.style.float = "left"
                div.style.width = "100px"
                var cb = document.createElement('input')
                cb.setAttribute("type", "checkbox")
                cb.setAttribute("id", "plang_" + spoken_langs[i])
                var lbl = document.createElement('label')
                lbl.setAttribute("for", "plang_" + spoken_langs[i])
                var txt = document.createTextNode(spoken_langs[i].replace(/^([a-z])/, function(a) { return a.toUpperCase() }))
                lbl.appendChild(txt)
                div.appendChild(cb)
                div.appendChild(lbl)
                obj.appendChild(div)
            }
            obj.appendChild(document.createElement('br'))
        }
        obj.innerHTML += '<br/><div style="width: 100%; margin-top: 40px;"><input type="button" class="finishbutton" onclick="doForm()" value="Find me something to do!"/>' +
        '<a onclick="wizard(1)" href="javascript:void(0);">Back to start</a></div>'
    }
}

function populateForm() {
    // languages
    
    var f = document.getElementById('plang')
    for (var i in langs) {
        var div = document.createElement('div')
        div.style.float = "left"
        div.style.width = "100px"
        var cb = document.createElement('input')
        cb.setAttribute("type", "checkbox")
        cb.setAttribute("id", "plang_" + langs[i])
        var lbl = document.createElement('label')
        lbl.setAttribute("for", "plang_" + langs[i])
        var txt = document.createTextNode(langs[i])
        lbl.appendChild(txt)
        div.appendChild(cb)
        div.appendChild(lbl)
        f.appendChild(div)
    }
    f.appendChild(document.createElement('br'))
    
    // task types

    var f = document.getElementById('ptypes')
    for (var i in types) {
        var div = document.createElement('div')
        div.style.float = "left"
        div.style.width = "200px"
        var cb = document.createElement('input')
        cb.setAttribute("type", "checkbox")
        cb.setAttribute("id", "ptype_" + types[i])
        var lbl = document.createElement('label')
        lbl.setAttribute("for", "ptype_" + types[i])
        var txt = document.createTextNode(types[i])
        lbl.appendChild(txt)
        div.appendChild(cb)
        div.appendChild(lbl)
        f.appendChild(div)
    }
    f.appendChild(document.createElement('br'))
    
    // projects - none for now
    var f = document.getElementById('pprojects')
    f.appendChild(document.createTextNode('All projects'))
}

function doForm() {
    var l = []
    var t = []
    var p = []
    for (var i in langs) {
        if (document.getElementById("plang_" + langs[i]) && document.getElementById("plang_" + langs[i]).checked) {
            l.push(langs[i])
        }
    }
    for (var i in types) {
        if (document.getElementById("ptype_" + types[i]) && document.getElementById("ptype_" + types[i]).checked) {
            t.push(types[i])
        }
    }
    if (wstate.type) {
        t = [wstate.type]
    }
    if (wstate.projects) {
        p = wstate.projects
    }
    fetchItems(l, t, p)
}

function sw(id) {
    var obj = document.getElementById(id)
    var op = obj.style.display == 'none' ? 'table-row' : 'none'
    obj.style.display = op
}

function reallyPopulate(json) {
    var pro = []
    var obj = document.getElementById('project')
    for (var i in json.committees) {
        pro.push(i)
        var opt = document.createElement('option')
        opt.text = i
        opt.setAttribute("value", i)
        obj.appendChild(opt)
    }
    
    var obj = document.getElementById('languages')
    for (var i in langs) {
        var opt = document.createElement('option')
        opt.text = langs[i]
        opt.setAttribute("value", langs[i])
        obj.appendChild(opt)
    }
    
    for (var i in spoken_langs) {
        var opt = document.createElement('option')
        opt.text = spoken_langs[i].replace(/^([a-z])/, function(a) {return a.toUpperCase()})
        opt.setAttribute("value", spoken_langs[i])
        obj.appendChild(opt)
    }
}

function populateAdminForm() {
    getAsyncJSON('https://whimsy.apache.org/public/public_ldap_committees.json', null, reallyPopulate)
}

function displayItems(json, state) {
    cjson = json
    var numItems = 0
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        numItems++
    }
    var obj = document.getElementById('hwitems')
    
    if (typeof(numItems) === 'undefined') {
        obj.innerHTML = "Sorry, we couldn't find any tasks matching your criteria"
        return
    }
    
    obj.innerHTML = "Found " + numItems + " item" + (numItems != 1 ? "s" : "") + ":<br/>"
    var tbl = "<table style='text-align: left;'><tr><th></th><th>Project</th><th>Title</th><th>Languages</th><th>Difficulty</th><th>Created</th></tr>"
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        var z = parseInt(i)+1
        var ptype = item.type.replace(/\s+/g, "")
        var cdate = new Date(item.created*1000).toLocaleString()
        var lingos = (item.languages != 'n/a') ? item.languages.split(",").join(", ") : ""
        
        // admin stuff
        var add = ""
        if (state.admin) {
            add = " &nbsp; <a href='/admin/close.lua?id=" + item.request_id + "'>Mark as done</a>"
        }
        
        tbl += "<tr style='cursor: pointer;' onclick=\"sw('details_" + i + "');\"><td><div class='itemNumber-yellow'>" + z + "</div><img title='" + item.type + "' style='float: left;' src='/images/icon_" + ptype + ".png'/></td>" +
        "<td>" + item.project + "</td>"+
        "<td style='text-align: left;'>" + item.title + "</td>" +
        "<td>" + lingos + "</td><td title='" + diff_explanation[parseInt(item.difficulty)] + "' style='text-align: left;'><img src='/images/level_" + (parseInt(item.difficulty)+1) + ".png'/> " + diff[item.difficulty] + add + "</td><td>" + cdate + "</td></tr>"
        
        tbl += "<tr style='display:none;' id='details_" + i + "'><td colspan='6'><b>Project:</b> " + item.project + "<br/><b>Requested by:</b> " + item.author + "@apache.org<br/><b>Created:</b> " + cdate + "<br/><b>Description:</b> <blockquote>" + item.description + "</blockquote><b>Further information: </b> <a href='" + item.url + "'>" + item.url + "</a><br/><input type='button' onclick='location.href=\"https://helpwanted.apache.org/task.html?" + item.request_id +"\";' value='I am interested in this'/></td></tr>"
        
    }
    tbl += "</table>"
    obj.innerHTML += tbl
}

function fetchItems(languages, types, projects, sortBy) {
    if (!languages) languages = []
    if (!types) types = []
    if (!projects) projects = []
    getAsyncJSON("/listitems.lua?lang=" + languages.join(",") + "&type=" + types.join(",") +"&project=" + projects.join(","),
                 {
                    languages: languages,
                    types: types,
                    projects: projects,
                    sortBy: sortBy
                    }, displayItems)
}


function fetchItemsAdmin() {
    getAsyncJSON("/listitems.lua", {admin: true}, displayItems)
}

function renderItem(json, state) {
    var obj = document.getElementById('item')
    var cdate = new Date(json.created*1000).toDateString()
    obj.innerHTML = "<h2>Item #" + state + ": <span style='color: #369;'>" + json.title + "</span></h2>"
    obj.innerHTML += "<p style='text-align: left;'><b>Project: </b> " + json.project + "<br/>" +
        "<b>Created by:</b> " + json.author + "@apache.org<br/>" +
        "<b>Task added: </b>" + cdate + "<br/>" +
        "<b>Difficulty: </b> <img style='width: 16px; height: 16px; vertical-align: middle;' src='/images/level_" + (parseInt(json.difficulty)+1) + ".png'/> " + diff[json.difficulty] + " - " + diff_explanation[parseInt(json.difficulty)] + "<br/>" +
        "<b>Task type:</b> " + types_long[json.type] + "<br/>" +
        "<b>Additional information:</b> <a href='" + json.url + "'>" + json.url + "</a><br/>" +
        ((json.estimate && json.estimate.length > 0) ? "<b>Estimated time to complete:</b> " + json.estimate : "") +
        ((json.timeout && json.timeout > 0) ? "<b>Task expires:</b> " + new Date(json.timeout*1000).toDateString() : "") +
        "<blockquote style='text-align: left;'><q>" + json.description + "</q></blockquote>" +
        "<br/></p>" +
        "<h3 style='text-align: left;'>How to help:</h3><p style='text-align: left;'>" +
        "If you want to help with this task, please get in touch with the project at: dev@" + json.project + ".apache.org!" +
        "<br/>You should also check out the additional information URL (if such is provided above) for more information."
        "<br/>&nbsp;<br/>&nbsp;<br/></p>"
}

function displayItem(id) {
    getAsyncJSON("/listitems.lua?id=" + id, id, renderItem)
}