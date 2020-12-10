#!/usr/bin/lua
local adapter = 0
local data = { 0 }
local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do 
	data[#data + 1] = tonumber(line)
	if data[#data] > adapter then
		adapter = data[#data]
	end
end
f:close()

table.sort(data)
data[#data + 1] = adapter + 3

local m, d
local diff = {}
local part2 = 1
local group = -2
for i = 1, #data - 1 do
	d = data[i + 1] - data[i]
	diff[d] = (diff[d] or 0) + 1
	group = group + 1
	if d == 3 then
		if group > 0 then
			m = 2^group
			if group > 2 then
				m = m - 1
			end
			part2 = part2 * m
		end
		group = -2
	end
end

print('part1: ' .. diff[1] * diff[3])
print('part2: ' .. math.floor(part2))
