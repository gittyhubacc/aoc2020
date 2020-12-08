local Object = require 'object'

local RUN = 'run'
local LOOP = 'loop'

local ops = {}
local op_map = { jmp = 'nop', nop = 'jmp' }

function ops.acc(env, arg)
	env.isp = env.isp + 1
	env.acc = env.acc + arg
	return function(e)
		e.isp = e.isp - 1
		e.acc = e.acc - arg
		e.visited[e.isp] = false
	end
end

function ops.jmp(env, arg)
	env.isp = env.isp + arg
	return function(e)
		e.isp = e.isp - arg
		e.visited[e.isp] = false
	end
end

function ops.nop(env, arg)
	env.isp = env.isp + 1
	return function(e)
		e.isp = e.isp - 1
		e.visited[e.isp] = false
	end
end

function bad_input() print('bad input') end

local Env = Object:extend()

function Env:init()
	self:reset()
	self.code = {}
end

function Env:reset()
	self.acc = 0
	self.isp = 1
	self.visited = {}
end

function Env:parse(line)
	local op, arg = string.match(line, '(%a+) ([-+]%d+)')
	self.code[#self.code + 1] = { op = op, arg = tonumber(arg) }
end

function Env:cmd_is(op)
	return self.code[self.isp].op == op
end

function Env:step(switch)
	local cmd = self.code[self.isp]
	if switch then cmd.op = op_map[cmd.op] end

	local rollback = ops[cmd.op](self, cmd.arg)

	if self.visited[self.isp] then
		return LOOP, rollback
	elseif not self.code[self.isp] then
		return self.acc, rollback
	end

	self.visited[self.isp] = true
	return RUN, rollback
end

function Env:switch()
	return self:step(true)
end

function Env:simple_eval()
	local status = self:step()
	if status == LOOP then return self.acc end
	return self:simple_eval()
end

function inner_eval(env, fail, switch, status, rollback)
	if status == LOOP then 
		-- operation just performed resulted in pointing 
		-- to an operation we've already performed, roll it back
		rollback(env)

		if env:cmd_is('acc') or not switch then 
			-- we cannot branch on current operation
			-- either because it is not jmp / nop or
			-- because we are already in a branch
			return fail(env) 
		end

		-- return "what could have been" if this operation was different
		return inner_eval(env, fail, false, env:switch())
	elseif status == RUN then
		-- operation just performed resulted in 
		-- neither a loop nor a halt, wrap results so
		-- we can roll back side effects
		local _fail = function(_env)
			rollback(_env)
			if _env:cmd_is('acc') or not switch then return fail(_env) end
			return inner_eval(_env, fail, false, _env:switch())
		end

		-- continue evaluation with wrapped side effects
		return inner_eval(env, _fail, switch, env:step())
	else return status end	-- hopefully, return acc :)
end

function Env:eval()
	return inner_eval(self, bad_input, true, self:step())
end

return Env
