#!/usr/bin/lua

local bit_values = { 64, 32, 16, 8, 4, 2, 1 }
function binary(n)
	local rv = 0
	for i, v in ipairs(bit_values) do
		if n[i] then rv = rv + v end
	end
	return rv
end

function row(seat)
	local rv = {}
	for i = 1, 7 do
		rv[i] = seat[i] == 'B'
	end
	return binary(rv)
end

function col(seat)
	local rv = {}
	for i = 8, 10 do
		rv[i - 3] = seat[i] == 'R'
	end
	return binary(rv)
end

local part1 = -1
local seat_map = {}
local seat_list = {}

local f = io.open(arg[1] or 'input.txt')
for line in f:lines() do
	local seat = {}
	for c in string.gmatch(line, '%a') do
		seat[#seat + 1] = c
	end
	seat = (row(seat) * 8) + col(seat)

	-- find largest 
	if seat > part1 then part1 = seat end

	-- save for part 2
	seat_list[#seat_list + 1] = seat
	seat_map[seat] = seat
end
f:close()

table.sort(seat_list)

local part2
for i, seat in ipairs(seat_list) do
	if not seat_map[seat + 1] then
		part2 = seat + 1
		break
	end
end

print('part1: ', part1)
print('part2: ', part2)
