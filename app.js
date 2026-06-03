const API_URL =
"https://script.google.com/macros/s/AKfycbzr36K3N8k9iGwi5EeV-v9UgUTj5Apw0KJ1PMJfCaljcEmVxDajK9Ky3n29B7cNJNUC/exec";

let pacientes =
JSON.parse(
localStorage.getItem("pacientes")
) || [];



function calcularEdadVida(){

const fechaNacimiento =
document.getElementById(
"fechaNacimiento"
).value;

if(!fechaNacimiento) return;

const nacimiento =
new Date(fechaNacimiento);

const ahora =
new Date();

const diferenciaMs =
ahora - nacimiento;

const horasTotales =
Math.floor(
diferenciaMs /
(1000 * 60 * 60)
);

const dias =
Math.floor(
horasTotales / 24
);

const horasRestantes =
horasTotales % 24;

let texto = "";

if(dias > 0){

texto =
dias +
" días y " +
horasRestantes +
" horas";

}else{

texto =
horasTotales +
" horas";

}

document.getElementById(
"edadVida"
).value = texto;

}

function clasificarBilirrubina(valor){

if(valor >= 20){

return{
estado:"Crítico",
clase:"critico",
alerta:"danger-alert"
};

}

if(valor >= 15){

return{
estado:"Patológico",
clase:"patologico",
alerta:"warning-alert"
};

}

return{
estado:"Normal",
clase:"",
alerta:"normal-alert"
};

}

async function guardarPaciente(){

const paciente = {

expediente:
document.getElementById(
"expediente"
).value,

nombre:
document.getElementById(
"nombre"
).value,

fechaNacimiento:
document.getElementById(
"fechaNacimiento"
).value,

edadVida:
document.getElementById(
"edadVida"
).value,

sexo:
document.getElementById(
"sexo"
).value,

peso:
document.getElementById(
"peso"
).value,

talla:
document.getElementById(
"talla"
).value,

pc:
document.getElementById(
"pc"
).value,

eg:
document.getElementById(
"eg"
).value,

apgar1:
document.getElementById(
"apgar1"
).value,

apgar5:
document.getElementById(
"apgar5"
).value,

madre:
document.getElementById(
"madre"
).value,

edadMadre:
document.getElementById(
"edadMadre"
).value,

gestas:
document.getElementById(
"gestas"
).value,

partos:
document.getElementById(
"partos"
).value,

cesareas:
document.getElementById(
"cesareas"
).value,

abortos:
document.getElementById(
"abortos"
).value,

vih:
document.getElementById(
"vih"
).value,

rprMaterno:
document.getElementById(
"rprMaterno"
).value,

tipoParto:
document.getElementById(
"tipoParto"
).value,

motivoCesarea:
document.getElementById(
"motivoCesarea"
).value,

anestesia:
document.getElementById(
"anestesia"
).value,

liquido:
document.getElementById(
"liquido"
).value,

circular:
document.getElementById(
"circular"
).value,

leucocitos:
document.getElementById(
"leucocitos"
).value,

neutrofilos:
document.getElementById(
"neutrofilos"
).value,

linfocitos:
document.getElementById(
"linfocitos"
).value,

monocitos:
document.getElementById(
"monocitos"
).value,

hemoglobina:
document.getElementById(
"hemoglobina"
).value,

hematocrito:
document.getElementById(
"hematocrito"
).value,

plaquetas:
document.getElementById(
"plaquetas"
).value,

biliTotal:
Number(
document.getElementById(
"biliTotal"
).value
),

biliDirecta:
document.getElementById(
"biliDirecta"
).value,

biliIndirecta:
document.getElementById(
"biliIndirecta"
).value,

diagnostico:
document.getElementById(
"diagnostico"
).value,

evolucion:
document.getElementById(
"evolucion"
).value,

indicaciones:
document.getElementById(
"indicaciones"
).value

};

pacientes.push(paciente);

localStorage.setItem(
"pacientes",
JSON.stringify(pacientes)
);

mostrarPacientes();

try{

await fetch(API_URL,{

method:"POST",

mode:"no-cors",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(
paciente
)

});

alert(
"Expediente guardado correctamente"
);

}catch(error){

console.log(error);

}

generarExpediente();

}

function mostrarPacientes(){

const lista =
document.getElementById(
"listaPacientes"
);

lista.innerHTML = "";

let patologicos = 0;
let criticos = 0;

const busqueda =
document.getElementById(
"buscarPaciente"
).value.toLowerCase();

pacientes
.filter((p)=>{

return(

p.nombre
.toLowerCase()
.includes(busqueda)

||

p.expediente
.toLowerCase()
.includes(busqueda)

);

})

.forEach((p)=>{

const clasificacion =
clasificarBilirrubina(
p.biliTotal
);

if(
clasificacion.estado ===
"Patológico"
){
patologicos++;
}

if(
clasificacion.estado ===
"Crítico"
){
criticos++;
}

lista.innerHTML += `

<div class="paciente
${clasificacion.clase}">

<h3>
${p.expediente}
</h3>

<h2>
${p.nombre}
</h2>

<p>
<strong>Edad vida:</strong>
${p.edadVida}
</p>

<p>
<strong>Diagnóstico:</strong>
${p.diagnostico}
</p>

<p>
<strong>Peso:</strong>
${p.peso} g
</p>

<p>
<strong>EG:</strong>
${p.eg} semanas
</p>

<p>
<strong>Parto:</strong>
${p.tipoParto}
</p>

<p>
<strong>VIH Materno:</strong>
${p.vih}
</p>

<p>
<strong>RPR Materno:</strong>
${p.rprMaterno}
</p>

<p>
<strong>Bilirrubina Total:</strong>
${p.biliTotal}
</p>

<div class="alerta
${clasificacion.alerta}">
${clasificacion.estado}
</div>

</div>

`;

});

document.getElementById(
"totalPacientes"
).innerText =
pacientes.length;

document.getElementById(
"casosPatologicos"
).innerText =
patologicos;

document.getElementById(
"casosCriticos"
).innerText =
criticos;

}

document
.getElementById(
"buscarPaciente"
)
.addEventListener(
"keyup",
mostrarPacientes
);

mostrarPacientes();
