function Tanque(x,y,w,h,altura,area,id){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.altura = altura;
	this.area = area;
	this.qi = 0;
	this.qo = 0;
	this.id = id;
	this.sel = 0;
	this.maxvol = this.area * this.h;
	this.alt = 0;
	this.prof = 1;
	
	var xoff = 0;
	
	this.mostrar = function(){
		switch(id){
			case 0:
				fill(0,0,255);
				break;
			case 1:
				fill(255,255,0);
				break;
			case 2:
				fill(0,255,0);
				break;
		}
		rect(this.x, this.y+this.h-this.altura, this.w, this.altura);
	}

	this.mostraralt = function(){
		fill(200);
		rect(this.x, this.y, this.w, this.h);
		fill(255,255,0);
		rect(this.x, this.y - this.h + this.alt, this.w, this.alt);
	};
	
	this.updatepos = function(x,y){
		this.x = x;
		this.y = y;
	};
	
	this.updatetam = function(w, h){
		this.w = w;
		this.h = h;
	};
	
	this.updateAltura = function(altura){
		if(altura > this.h) this.altura = this.h
		else this.altura = altura;
		if(this.altura < 0) this.altura = 0;
	};
	
	this.updateQo = function(qo){
		this.qo = qo;
	}
	
	this.json = function(){
		return JSON.stringify(this);
	};
	
};