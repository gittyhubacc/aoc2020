#!/usr/bin/lua

function set_mask(mask, mask_str)
	local i = 36
	for c in string.gmatch(mask_str, '[10X]') do
		mask[i] = c
		i = i - 1
	end
end

function mask_number(mask, num)
	local num_bits = {}
	while num > 0 do
		num_bits[#num_bits + 1] = num % 2
		num = math.floor(num / 2)
	end

	num = 0
	for i, b in ipairs(mask) do
		if b ~= 'X' then 
			num_bits[i] = tonumber(b)
		end
		num = num + ((num_bits[i] or 0) * (2^(i - 1)))
	end
	return num
end

function r_explode(mask, idx, addr_list)
	if idx == 37 then return addr_list end

	local addrs = {}
	while #addr_list > 0 do
		local addr = table.remove(addr_list, 1)
		if mask[idx] == '0' then
			addrs[#addrs + 1] = addr
		elseif mask[idx] == '1' then
			addr[idx] = 1
			addrs[#addrs + 1] = addr
		else
			addrs[#addrs + 1] = {}
			for i, v in ipairs(addr) do
				addrs[#addrs][i] = v
			end
			addrs[#addrs][idx] = 1
			addr[idx] = 0
			addrs[#addrs + 1] = addr
		end
	end
	return r_explode(mask, idx + 1, addrs)
end

function mask_address(mask, addr)
	local bits = {}
	addr = tonumber(addr)
	while addr > 0 do
		bits[#bits + 1] = addr % 2
		addr = math.floor(addr / 2)
	end
	while #bits < 36 do
		table.insert(bits, 0)
	end

	local addrs = {}
	for i, addr in ipairs(r_explode(mask, 1, { bits })) do
		local a = 0
		for j, b in ipairs(addr) do
			a = a + (b * (2^(j-1)))
		end
		addrs[#addrs + 1] = a
	end

	return addrs
end

local mask = {}
local part1 = {}
local part2 = {}
for line in io.open(arg[1] or 'input.txt'):lines() do
	local address, val = string.match(line, '%[(%d+)%] = (%d+)')
	if address and val then
		part1[address] = mask_number(mask, tonumber(val))
		for _, addr in ipairs(mask_address(mask, address)) do
			part2[addr] = val
		end
	else
		set_mask(mask, string.match(line, '([10X]+)'))
	end
end

local _part1 = 0
for k, v in pairs(part1) do
	_part1 = _part1 + v
end
local _part2 = 0
for k, v in pairs(part2) do
	_part2 = _part2 + v
end
print('part1: ' .. _part1)
print('part2: ' .. _part2)
