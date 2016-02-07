--[[
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

]]--

local JSON = require 'cjson'
local elastic = require 'lib/elastic'

function handle(r)
    r.content_type = "application/json"
    local t = {}
    local now = r:clock()
    local tnow = now
    local get = r:parseargs()
    local qs = "*"
    local domain = get.domain or ""
    if #domain < 2 then
        domain = "*"
    end
    local dd = 14
    local maxresults = 10000
    local listdata = {}

    if get.id then
        local doc = elastic.get('item', get.id)
        if doc then
            r:puts(JSON.encode(doc))
            return apache2.OK
        end
        r:puts[[{}]]
        return apache2.OK
    end

    -- Languages
    local lingos = {}
    for lang in (get.lang or ""):gmatch("([+#A-Za-z0-9+]+)") do
        table.insert(lingos, lang)
    end
    
    -- Types
    local types = {}
    for typ in (get.type or ""):gmatch("([+#A-Za-z0-9+]+)") do
        table.insert(types, typ)
    end
    
    -- Projects
    local projects = {}
    for project in (get.project or ""):gmatch("([+#A-Za-z0-9+]+)") do
        table.insert(projects, project)
    end
    
    local pl = #projects > 0 and table.concat(projects, " OR ") or "*"
    local tl = #types > 0 and table.concat(types, " OR ") or "*"
    local ll = #lingos > 0 and table.concat(lingos, " OR ") or "*"
    
    local dsl = ("languages:(%s) AND type:(%s) AND project:(%s)"):format(ll, tl,pl)
    
    local doc = elastic.find(dsl, 200, 'item', 'created')
    if doc and #doc > 0 then
        r:puts(JSON.encode(doc))
    else
        r:puts[[{}]]
    end
    return apache2.OK
end
