-- passport.lua

local Object = require 'object'
local Passport = Object:extend()
required_ecl = {
	'amb', 'blu', 'brn', 
	'gry', 'grn', 'hzl', 'oth'
}
required = {
	byr = function(f) 
		local year = tonumber(f.byr)
		return year >= 1920 and year <= 2002
	end, 
	iyr = function(f)
		local year = tonumber(f.iyr)
		return year and (year >= 2010 and year <= 2020)
	end, 
	eyr = function(f)
		local year = tonumber(f.eyr)
		return year >= 2020 and year <= 2030 
	end,
	hgt = function(f)
		local val, unit = string.match(f.hgt, '(%d+)(%w+)')
		if not val then return false end

		val = tonumber(val)
		if unit == 'cm' then
			return val >= 150 and val <= 193
		elseif unit == 'in' then
			return val >= 59 and val <=76
		end

		return false
	end, 
	hcl = function(f)
		local val = string.match(f.hcl, '#([0-9a-f])')
		return not not val
	end, 
	ecl = function(f)
		for i, v in ipairs(required_ecl) do
			if f.ecl == v then return true end
		end
		return false
	end, 
	pid = function(f)
		local val = string.match(f.pid, '%d+')
		return #val == 9
	end
}

function Passport:init()
	self.fields = {}
end

function Passport:parse(line)
	for kvpair in string.gmatch(line, '%w+:[#%w]+') do
		local key = string.match(kvpair, '(%w+):')
		local val = string.match(kvpair, ':(.+)')
		self.fields[key] = val
	end
end

function Passport:present()
	for key, fn in pairs(required) do
		if not self.fields[key] then
			return false
		end
	end
	return true
end

function Passport:valid()
	for key, fn in pairs(required) do
		if not self.fields[key] or not fn(self.fields) then
			return false
		end
	end
	return true
end

return Passport
