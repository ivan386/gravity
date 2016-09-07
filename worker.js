var planets = []
var gm = 1
var maxr = 1
var zoom = 1
var time = 0

var mps = 0
var dl2_min_ps = 1/0
var dl2_min = 1/0
var	dl2_min_ps = 0
var	dl2_max_ps = 0

function from_json(json){
	var data = JSON.parse(json)
	planets = data.planets
	gm = data.gm
	maxr = data.maxr
	zoom = data.zoom
	time = data.time
	
	for (var i = 0; i < planets.length; i++){
		planets[i].newx = planets[i].x;
		planets[i].newy = planets[i].y;
		planets[i].newz = planets[i].z;
	}

	removeChilds(dots)
	removeChilds(rings)
}

function to_json(){
	return JSON.stringify({
	 "gm": gm,
	 "time": time,
	 "planets": planets}, ["gm", "time", "planets", "x", "y", "z", "speed_x", "speed_y", "speed_z"])
}

onmessage = function (obj){
	from_json(obj.data)
	postMessage(obj.data)
	console.log("worker")
}

function move(){
	var mpsl = mps
	var timel = time
	var dl2_minl = dl2_min
	var dl2_maxl = dl2_max
	var dl2_minl_ps = dl2_min_ps
	var dl2_maxl_ps = dl2_max_ps
	var length = planets.length
	
	
	if (length > 0)
	{
		for (r=0; r < maxr; r++)
		{
			mpsl++
			timel++
			var planet = planets[0]
			var next
			
			for (i = 0; i < length; i++)
			{
				var x = planet.x
				var y = planet.y
				var z = planet.z
				
				var newx = planet.newx
				var newy = planet.newy
				var newz = planet.newz
				
				
				for (o = i+1; o < length; o++)
				{
					
					var force = planets[o]
					if (o == i+1)
						next = force
					
					var dx = force.x - x
					var dy = force.y - y
					var dz = force.z - z
					var dl2 =  dx * dx + dy * dy + dz * dz
					
					if (dl2 < dl2_minl)
						dl2_minl = dl2;
					else if (dl2 > dl2_maxl)
						dl2_maxl = dl2;
						
					if (dl2 < dl2_minl_ps)
						dl2_minl_ps = dl2;
					else if (dl2 > dl2_maxl_ps)
						dl2_maxl_ps = dl2;
					
					var gravity = gm / dl2
					
					
					var gdx, gdy, gdz
					
					newx += (gdx = gravity * dx)
					newy += (gdy = gravity * dy)
					newz += (gdz = gravity * dz)
					
					force.newx -= gdx 
					force.newy -= gdy 
					force.newz -= gdz 
				}

				planet.speed_x = (planet.newx = newx + planet.speed_x) - planet.x
				planet.speed_y = (planet.newy = newy + planet.speed_y) - planet.y
				planet.speed_z = (planet.newz = newz + planet.speed_z) - planet.z
				planet.x = planet.newx
				planet.y = planet.newy
				planet.z = planet.newz
				planet = next
			}
		}
		
		postMessage(to_json())
	}
	mps = mpsl
	time = timel
	dl2_min = dl2_minl
	dl2_max = dl2_maxl
	dl2_min_ps = dl2_minl_ps
	dl2_max_ps = dl2_maxl_ps	
}

setInterval(move, 0)