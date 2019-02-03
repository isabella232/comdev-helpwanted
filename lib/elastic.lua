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

-- This is elastic.lua - ElasticSearch library

local http = require 'socket.http'
local JSON = require 'cjson'
local config = {
    es_url = "http://localhost:9200/helpwanted/",
    maxResults = 100
}
local default_doc = "item"

-- Standard ES query, returns $size results of any doc of type $doc, sorting by $sitem (desc)
local function getHits(query, size, doc, sitem)
    doc = doc or default_doc
    sitem = sitem or "epoch"
    size = size or 10
    query = query:gsub(" ", "+")
    local url = config.es_url .. doc .. "/_search?q="..query.."&sort=" .. sitem .. ":desc&size=" .. size
    local result = http.request(url)
    local json = JSON.decode(result)
    local out = {}
    if json and json.hits and json.hits.hits then
        for k, v in pairs(json.hits.hits) do
            v._source.request_id = v._id
            table.insert(out, v._source)
        end
    end
    return out
end

-- Get a single document
local function getDoc (ty, id)
    local url = config.es_url  .. ty .. "/" .. id
    local result = http.request(url)
    local json = JSON.decode(result)
    if json and json._source then
        json._source.request_id = json._id
        return json._source
    else
        return {}
    end
end

-- Do a raw ES query with a JSON query
local function raw(query, doctype)
    local js = JSON.encode(query)
    doctype = doctype or default_doc
    local url = config.es_url .. doctype .. "/_search"
    local result = http.request(url, js)
    local json = JSON.decode(result)
    return json or {}
end

-- Update a document
local function update(doctype, id, query)
    local js = JSON.encode({doc = query })
    doctype = doctype or default_doc
    local url = config.es_url .. doctype .. "/" .. id .. "/_update"
    local result = http.request(url, js)
    local json = JSON.decode(result)
    return json or {}
end

-- Put a new document somewhere
local function index(r, id, ty, body)
    local js = JSON.encode(query)
    if not id then
        id = r:sha1(ty .. (math.random(1,99999999)*os.time()) .. ':' .. r:clock())
    end
    local url = config.es_url .. ty .. "/" .. id
    local result = http.request(url, body)
    local json = JSON.decode(result)
    return json or {}
end

-- module defs
return {
    find = getHits,
    get = getDoc,
    raw = raw,
    index = index,
    update = update
}
