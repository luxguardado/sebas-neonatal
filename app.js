const API_URL =
"https://script.google.com/macros/s/AKfycbx3pcgO7BcMBz_SQfJ9MKGFSticK_0II5b5m82UVAxK-8_u9B5HFk5n44-bmxxJk2Or/exec";

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

if(valor > 20){

return{
estado:"Crítico",
clase:"critico",
alerta:"danger-alert"
};

}

if(valor > 15){

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

id: Date.now(),

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

apgar:
document.getElementById(
"apgar"
).value,

grupoRh:
document.getElementById(
"grupo"
).value,

diagnostico:
document.getElementById(
"diagnostico"
).value,

estado:
document.getElementById(
"estado"
).value,

bilirrubina:
Number(
document.getElementById(
"bilirrubina"
).value
),

pcr:
document.getElementById(
"pcr"
).value,

hemograma:
document.getElementById(
"hemograma"
).value,

rpr:
document.getElementById(
"rpr"
).value,

glicemia:
document.getElementById(
"glicemia"
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
"Paciente guardado correctamente"
);

}catch(error){

alert(
"Error conectando con Google Sheets"
);

console.log(error);

}

}

function mostrarPacientes(){

const lista =
document.getElementById(
"listaPacientes"
);

lista.innerHTML = "";

let patologicos = 0;
let criticos = 0;

pacientes.forEach((p)=>{

const clasificacion =
clasificarBilirrubina(
p.bilirrubina
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

<h3>${p.nombre}</h3>

<p>
<strong>Edad de vida:</strong>
${p.edadVida}
</p>

<p>
<strong>Diagnóstico:</strong>
${p.diagnostico}
</p>

<p>
<strong>Estado:</strong>
${p.estado}
</p>

<p>
<strong>Peso:</strong>
${p.peso} g
</p>

<p>
<strong>Bilirrubina:</strong>
${p.bilirrubina}
</p>

<div class="alerta
${clasificacion.alerta}">
${clasificacion.estado}
</div>

<p>
<strong>PCR:</strong>
${p.pcr}
</p>

<p>
<strong>Hemograma:</strong>
${p.hemograma}
</p>

<p>
<strong>Evolución:</strong>
${p.evolucion}
</p>

<p>
<strong>Indicaciones:</strong>
${p.indicaciones}
</p>

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

mostrarPacientes();