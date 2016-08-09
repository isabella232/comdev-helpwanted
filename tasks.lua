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
local cache = {}

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
        local doc = nil
        if #get.id == 8 and get.id:match("^([a-f0-9]+)$") then
            docs = elastic.find('_id:' .. get.id .. "*", 1, 'item', 'created')
            if docs and #docs == 1 then
                doc = docs[1]
            end
        else 
            doc = elastic.get('item', get.id)
        end
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
    
    -- Tags
    local tags = {}
    for tag in (get.tags or ""):gmatch("([+#A-Za-z0-9+]+)") do
        table.insert(tags, tag)
    end
    
    local wcards = nil
    if #projects == 0 then
        wcards = {project = "*"}
    end
    local mpl = #projects > 0 and { match = {project = { query = table.concat(projects, " ")}}} or nil
    local mtl = #types > 0 and { match = {['type'] = { query = table.concat(types, " ")}}} or nil
    local mll = #lingos > 0 and { match = { languages = {query = table.concat(lingos, " ")}}} or nil
    local mta = #tags > 0 and { match = { tags = {query = table.concat(tags, " ")}}} or nil
    
    local matches = {}
    if mpl then table.insert(matches,mpl) end
    if mtl then table.insert(matches,mtl) end
    if mll then table.insert(matches,mll) end
    if mta then table.insert(matches,mta) end
    
    if not (mpl or mtl or mll or mta) then
        matches = nil
    end
    
    
    -- First, check cache for recent dsl-alike
    local ts = os.time()
    local dsl = r:sha1(JSON.encode({matches, wcards}))
    local doc = {}
    local fc = false
    for k, v in pairs(cache) do
        if v.dsl == dsl and v.timestamp > (ts - 120) then
            fc = true
            doc = v.cache
            break
        end
    end
    if not fc then
        doc = elastic.raw {
            query = {
                bool = {
                    must = matches,
                }
            },
            
            sort = {
                {
                    created = {
                        order = "desc"
                    }
                }  
            },
            size = 250
        }
    end

    local vdoc = {}
    if doc and doc.hits and doc.hits.hits and #doc.hits.hits > 0 then
        for k, v in pairs(doc.hits.hits) do
            if not v._source.closed or get.all then
                v._source.request_id = v._id
                table.insert(vdoc, v._source)
            end
        end
        if not fc then
            table.insert(cache, {
                dsl = dsl,
                timestamp = ts,
                cache = doc
            })
            if #cache > 50 then
                cache[1] = nil
            end
        end
    end
    r:puts(JSON.encode({cached = fc, num = #vdoc, took = ((r:clock()-now)/1000), tasks = vdoc, dsl = dsl}))
    return apache2.OK
end
