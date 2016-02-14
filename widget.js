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
var widgetobj = null
var widgetproject = "???"
var widgettitle = null
var hw_json = {}
var maxitems = 8


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

var diff_explanation = [
    'This is an easy task that anyone can get started on',
    'This requires a bit of knowledge of the project, but otherwise is an easy task',
    'This requires a good knowledge of the project',
    'This requires a good knowledge of the project and good technical skills',
    'This requires intimate knowledge of the project and excellent technical skills'
]

var types_long = {
    programming: "Programming and Development",
    'web design': "Web Design",
    marketing: 'Marketing and Publicity',
    documentation: 'Documentation and Guides',
    community: 'Community Outreach',
    translation: 'Translation'
}


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

var hw_oldstate = ""
function displayItemsWidget(json, state, sorting) {
    var obj = state.object ? state.object : widgetobj
    if (state && state.hwuid) {
        var divs = document.getElementsByTagName('div')
        for (var i in divs) {
            if (divs[i].getAttribute && divs[i].getAttribute("hwuid") == state.hwuid) {
                obj = divs[i]
                break
            }
        }
    }
    var hwuid = obj.getAttribute("hwuid")
    hw_json[hwuid] = json ? json : hw_json[hwuid]
    json = hw_json[hwuid]
    var diff = ['Beginner', 'Journeyman', 'Intermediate', 'Advanced', 'Expert']
    var numItems = 0
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        numItems++
    }
    
    var title = state.title ? state.title : obj.getAttribute("hwtitle")
    obj.setAttribute("class", "hwitems hwwidget")
    
    if (sorting && typeof(sorting) === "string") {
        if (hw_oldstate == sorting) {
            json.sort(function(a,b) { return a[sorting] < b[sorting] })
            hw_oldstate = ""
        } else {
            json.sort(function(a,b) { return a[sorting] > b[sorting] })
            hw_oldstate = sorting
        }
        
    }
    
    var tags = obj.getAttribute("tags") ? ", tagged " + obj.getAttribute("tags") : ""
    if (state.tags && state.tags.length > 0) {
        tags = ", tagged " + state.tags
    }
    
    obj.innerHTML = ""
    var tbl = "<table style='width: 100%; text-align: left;'><tr><td colspan='5' style='text-align: center;'><img src='https://helpwanted.apache.org/images/cube.png'/> Tasks " + title + " would like help with"+tags+":</td></tr>" +
    ("<tr style='cursor: pointer' title='Click on a column to sort'><th onclick='displayItemsWidget(null, {hwuid: \""+hwuid+"\"}, \"title\");'>Title</th>") +
    ("<th onclick='displayItemsWidget(null, {hwuid: \""+hwuid+"\"}, \"languages\");'>Languages</th>") +
    ("<th onclick='displayItemsWidget(null, {hwuid: \""+hwuid+"\"}, \"difficulty\");'>Difficulty</th>") +
    ("<th onclick='displayItemsWidget(null, {hwuid: \""+hwuid+"\"}, \"created\");'>Created</th></tr>")
    
    if (typeof(numItems) === 'undefined' || numItems == 0) {
        obj.innerHTML = tbl + "<tr><td colspan='5'>Sorry, we couldn't find any tasks matching your criteria</td></tr>" +
        "<tr><td colspan='4' style='text-align: center;'>Powered by <a href='https://helpwanted.apache.org/'>Help Wanted</a> - a task directory for Apache projects</td></tr>" +
        "</table>"
        return
    }
    
    
    for (var i in json) {
        var item = json[i]
        if (item.closed) {
            continue
        }
        if (parseInt(i) >= maxitems) {
            tbl += "<tr><td colspan='5'><a href='javascript:void(0);' onclick='maxitems += 8; displayItemsWidget(null, {hwuid: \""+hwuid+"\"});'>Show more tasks</a></td></tr>"
            break
        }
        var rid = (Math.random()*99999).toString(16)
        var z = parseInt(i)+1
        var ptype = item.type.replace(/\s+/g, "")
        var cdate = new Date(item.created*1000).toLocaleString()
        var lingos = (item.languages != 'n/a') ? item.languages : ""
        
        // admin stuff
        var add = ""
        if (state.admin) {
            add = " &nbsp; <a href='/admin/close.lua?id=" + item.request_id + "'>Mark as done</a>"
        }
        item.description = item.description.replace(/\n/g, "<br/>").replace(hw_weburl, function(a) { return "<a href='"+a+"'>"+a+"</a>"})
        tbl += "<tr style='cursor: pointer; ' onclick=\"sw('hw_details_" + rid + "');\"><td style='text-align: left;'><div class='itemNumber-widget'>" + z + "</div><img title='" + types_long[item.type] + "' style='width:16px; height: 16px;' float: left;' src='https://helpwanted.apache.org/images/icon_" + ptype + ".png'/>" +
        item.title + "</td>" +
        "<td>" + lingos + "</td><td style='text-align: left;' title='" + diff_explanation[parseInt(item.difficulty)] + "'><img style='width:16px; height: 16px;' src='https://helpwanted.apache.org/images/level_" + (parseInt(item.difficulty)+1) + ".png'/> " + diff[item.difficulty] + add + "</td><td>" + cdate + "</td></tr>"
        var fi = ""
        if (item.url && item.url.length > 10) {
            fi = "<b>Further information: </b> <a href='" + item.url + "'>" + item.url + "</a><br/>"
        }
        
        tbl += "<tr style='display:none;' id='hw_details_" + rid + "'><td colspan='6'><b>Project:</b> " + item.project + "<br/><b>Requested by:</b> " + item.author + "@apache.org<br/><b>Type: </b> " + types_long[item.type] + "<br/><b>Created:</b> " + cdate + "<br/><b>Description:</b> <blockquote>" + item.description + "</blockquote>" + fi + "<input type='button' class='dibbutton' onclick='location.href=\"https://helpwanted.apache.org/task.html?" + item.request_id + "\";' value='I am interested in this'/></td></tr>"
        
    }
    tbl += "<tr><td colspan='4' style='text-align: center;'>Powered by <a href='https://helpwanted.apache.org/'>Help Wanted</a> - a task directory for Apache projects</td></tr></table>"
    obj.innerHTML += tbl
}

function fetchItemsWidget(languages, types, projects, sortBy, tags, object, title) {
    if (!languages) languages = []
    if (!types) types = []
    if (!projects) projects = []
    if (!tags) tags = []
    getAsyncJSON("https://helpwanted.apache.org/listitems.lua?lang=" + languages.join(",") + "&type=" + types.join(",") +"&project=" + projects.join(",") +"&tags=" + tags.join(","),
                 {
                    languages: languages,
                    types: types,
                    title: title,
                    projects: projects,
                    sortBy: sortBy,
                    tags: tags.join(", "),
                    object: object
                    }, displayItemsWidget)
}

function sw(id) {
    var obj = document.getElementById(id)
    var op = obj.style.display == 'none' ? 'table-row' : 'none'
    obj.style.display = op
}

var divs = document.getElementsByTagName('div')
for (var i in divs) {
    if (divs[i].getAttribute) {
        var dt = divs[i].getAttribute("type")
        var dn = divs[i].getAttribute("project")
        var dti = divs[i].getAttribute("description")
        var dtag = divs[i].getAttribute("tags")
        if (dtag) {
            dtag = dtag.split(/,\s*/)
        }
        if (dt && dt == "helpwanted" && dn) {
            widgetobj = divs[i]
            widgetproject = dn
            widgettitle = dti ? dti : dn
            if (widgettitle == '*' || dn == '*') {
                widgettitle = "the Apache Software Foundation"
            }
            var css = document.createElement('link')
            css.rel = "stylesheet";
            css.href = "https://helpwanted.apache.org/css/hw2.css";
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(css)
            divs[i].setAttribute("hwuid", (Math.random()*99999).toString(16))
            divs[i].setAttribute("hwtitle", widgettitle)
            fetchItemsWidget([],[],[dn], null, dtag, divs[i], widgettitle)
        }
    }
    
}