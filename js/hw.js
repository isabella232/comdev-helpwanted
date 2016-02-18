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

var hw_oldstate

var hw_weburl = new RegExp(
  "(" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      // TLD may end with dot
      "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]([^,<>()\\[\\] \\t\\r\\n]|(<[^:\\s]*?>|\\([^:\\s]*?\\)|\\[[^:\\s]*?\\]))*)?" +
    ")\\.?"
  , "mig"
);

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
    var pobj = document.getElementById('pickerparent')
    var sobj = document.getElementById('splash')
    if (step == 0) {
        pobj.style.display = "none"
        sobj.style.display = "block"
    } else {
        pobj.style.display = "block"
    }
    document.getElementById('hwitems').innerHTML = ""
    if (!step) {
        step = 1
    }
    if (step == 1) {
        wstate = {}
        obj.innerHTML = "<div style='text-align: center;'><big >What sort of work would you like to do?</big></div>"
        for (var i in types) {
            obj.innerHTML += "<div onclick='wizard(2, \"" + types[i] + "\");' class=\"wizitem\" style=\"float: left; width: 248px; height: 250px;\"><img style='height: 96px; padding: 8px; vertical-align: middle;' src='images/" + types[i].replace(/\s+/g, "") + "_large.png'/><br/><b style='font-size:11pt;'>" + types_long[types[i]] + "</b></div>"
        }
        obj.innerHTML += "<div style='text-align: center;'><a href='javascript:void(0);' onclick='fetchItems();'><big>...Just show me everything</big></a></div>"
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
        '<a onclick="wizard(1)" href="javascript:void(0);"><img src="images/back.png" style="margin-left: 20px;"></a></div>'
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

function reallyPopulate(json, state) {
    var pro = []
    var obj = document.getElementById('project')
    
    // optgroup for spoken/written
    var optg = document.createElement('optgroup')
    optg.label = state ? "Non-TLPs:" : "Top Level Projects:"
    obj.appendChild(optg)
    
    for (var i in (json.committees || json.groups)) {
        pro.push(i)
        var opt = document.createElement('option')
        opt.text = i
        opt.setAttribute("value", i)
        obj.appendChild(opt)
    }
    if (state) {
        return
    }
    var obj = document.getElementById('languages')
    // optgroup for programming
    var optg = document.createElement('optgroup')
    optg.label = "Programming languages"
    obj.appendChild(optg)
    
    // prog languages
    for (var i in langs) {
        var opt = document.createElement('option')
        opt.text = langs[i]
        opt.setAttribute("value", langs[i])
        obj.appendChild(opt)
    }
    
    // optgroup for spoken/written
    var optg = document.createElement('optgroup')
    optg.label = "Spoken languages"
    obj.appendChild(optg)
    
    for (var i in spoken_langs) {
        var opt = document.createElement('option')
        opt.text = spoken_langs[i].replace(/^([a-z])/, function(a) {return a.toUpperCase()})
        opt.setAttribute("value", spoken_langs[i])
        obj.appendChild(opt)
    }
    if (!state) {
        getAsyncJSON('https://whimsy.apache.org/public/public_nonldap_groups.json', 'other', reallyPopulate)
    }
}

function populateAdminForm() {
    getAsyncJSON('https://whimsy.apache.org/public/public_ldap_committees.json', false, reallyPopulate)   
}

function displayItems(json, state) {
    json = json ? json : cjson
    cjson = json
    var numItems = 0
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        numItems++
    }
    
    if (state && typeof(state) === "string") {
        if (hw_oldstate == state) {
            json.sort(function(a,b) { return a[state] < b[state] })
            hw_oldstate = ""
        } else {
            json.sort(function(a,b) { return a[state] > b[state] })
            hw_oldstate = state
        }
        
    }
    
    var obj = document.getElementById('hwitems')
    
    if (typeof(numItems) === 'undefined') {
        obj.innerHTML = "Sorry, we couldn't find any tasks matching your criteria"
        return
    }
    
    obj.innerHTML = "<p id='hwrtable'>Found " + numItems + " item" + (numItems != 1 ? "s" : "") + " you might be interested in:</p>"
    var tbl = "<table style='text-align: left;'>" +
    "<tr style='cursor: pointer' title='Click on a column to sort'><th>&nbsp;</th><th onclick='displayItems(null, \"project\");'>Project</th>" +
    "<th onclick='displayItems(null, \"title\");'>Title</th>" +
    "<th onclick='displayItems(null, \"languages\");'>Languages</th>" +
    "<th onclick='displayItems(null, \"difficulty\");'>Difficulty</th>" +
    "<th onclick='displayItems(null, \"created\");'>Created</th></tr>"
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
        item.description = item.description.replace(/\n/g, "<br/>").replace(hw_weburl, function(a) { return "<a href='"+a+"'>"+a+"</a>"})
        tbl += "<tr style='cursor: pointer;' onclick=\"sw('details_" + i + "');\"><td width='68'><div class='itemNumber-yellow'>" + z + "</div><img title='" + item.type + "' style='float: left;' src='/images/icon_" + ptype + ".png'/></td>" +
        "<td>" + item.project + "</td>"+
        "<td style='text-align: left;'>" + item.title + "</td>" +
        "<td>" + lingos + "</td><td title='" + diff_explanation[parseInt(item.difficulty)] + "' style='text-align: left;'><img src='/images/level_" + (parseInt(item.difficulty)+1) + ".png'/> " + diff[item.difficulty] + add + "</td><td>" + cdate + "</td></tr>"
        
        tbl += "<tr style='display:none;' id='details_" + i + "'><td colspan='6'><b>Project:</b> " + item.project + "<br/><b>Requested by:</b> " + item.author + "@apache.org<br/><b>Created:</b> " + cdate + "<br/><b>Description:</b> <blockquote>" + item.description + "</blockquote><b>Further information: </b> <a href='" + item.url + "'>" + item.url + "</a><br/><input type='button' onclick='location.href=\"https://helpwanted.apache.org/task.html?" + item.request_id +"\";' value='I am interested in this'/></td></tr>"
        
    }
    tbl += "</table>"
    obj.innerHTML += tbl
    if (location.href.search('admin') == -1) {
        location.hash = '#hwrtable'
    }
    
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
    var rid = json.request_id.substring(0,8)
    var overrides = {
        comdev: 'community',
        whimsy: 'whimsical'
    }
    if (overrides[json.project]) {
        json.project = overrides[json.project]
    }
    json.description = json.description.replace(/\n/g, "<br/>").replace(hw_weburl, function(a) { return "<a href='"+a+"'>"+a+"</a>"})
    obj.innerHTML = "<h2>Task #" + state + ":<br/><span style='color: #369;'>" + json.title + "</span></h2>"
    var mlink = "mailto:dev@" + json.project + ".apache.org?subject=" + escape("Help with task: " + json.title) + "&body=" + escape("I would like to help out with the task listed at https://helpwanted.apache.org/task.html?" + rid + "\n\n")
    obj.innerHTML += "<p style='text-align: left;'><b>Project: </b> " + json.project + "<br/>" +
        "<b>Created by:</b> " + json.author + "@apache.org<br/>" +
        "<b>Task added: </b>" + cdate + "<br/>" +
        "<b>Difficulty: </b> <img style='width: 16px; height: 16px; vertical-align: middle;' src='/images/level_" + (parseInt(json.difficulty)+1) + ".png'/> " + diff[json.difficulty] + " - " + diff_explanation[parseInt(json.difficulty)] + "<br/>" +
        "<b>Task type:</b> " + types_long[json.type] + "<br/>" +
        (json.url && json.url.length > 10 ? "<b>Additional information:</b> <a href='" + json.url + "'>" + json.url + "</a><br/>" : "")+
        ((json.estimate && json.estimate.length > 0) ? "<b>Estimated time to complete:</b> " + json.estimate : "") +
        ((json.timeout && json.timeout > 0) ? "<b>Task expires:</b> " + new Date(json.timeout*1000).toDateString() : "") +
        "<blockquote style='text-align: left;'><q>" + json.description + "</q></blockquote>" +
        "<br/></p>" +
        "<h3 style='text-align: left;'>How to help:</h3><p style='text-align: left;'>" +
        (json.curl && json.curl.length > 10 ? "<b>Contributor's guide for this project: </b><a href='" + json.curl + "'>" + json.curl + "</a><br/>" :"") +
        "If you want to help with this task, please get in touch with the project at: <a href=\""+mlink+"\">dev@" + json.project + ".apache.org</a>!" +
        "<br/>You should also check out the additional information URL (if such is provided above) for more information."
        "<br/>&nbsp;<br/>&nbsp;<br/></p>"
}

function displayItem(id) {
    getAsyncJSON("/listitems.lua?id=" + id, id, renderItem)
}