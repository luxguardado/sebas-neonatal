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

try {

const paciente = {

  EXPEDIENTE:
document.getElementById(
"expediente"
).value,
  
NOMBRE_RN:
document.getElementById(
"nombre"
).value,
  
FECHA_NACIMIENTO:
document.getElementById("fechaNacimiento").value,

EDAD_VIDA:
document.getElementById("edadVida").value,

SEXO:
document.getElementById("sexo").value,

PESO:
document.getElementById("peso").value,

TALLA:
document.getElementById("talla").value,

PC:
document.getElementById("pc").value,

EG:
document.getElementById("eg").value,

APGAR1:
document.getElementById("apgar1").value,

APGAR5:
document.getElementById("apgar5").value,

MADRE:
document.getElementById("madre").value,

DNI_MADRE:
document.getElementById("dniMadre").value,

EDAD_MADRE:
document.getElementById("edadMadre").value,


GRUPO_MADRE:
document.getElementById("grupoMadre").value,

RH_MADRE:
document.getElementById("rhMadre").value,

GRUPO_RN:
document.getElementById("grupoRn").value,

RH_RN:
document.getElementById("rhRn").value,

INTERPRETACION_CLINICA:
document.getElementById("interpretacionClinica").value,
GESTAS:
document.getElementById("gestas").value,

PARTOS:
document.getElementById("partos").value,

CESAREAS:
document.getElementById("cesareas").value,

ABORTOS:
document.getElementById("abortos").value,

VIH:
document.getElementById("vih").value,

RPR_MATERNO:
document.getElementById("rprMaterno").value,

TIPO_PARTO:
document.getElementById("tipoParto").value,

MOTIVO_CESAREA:
document.getElementById("motivoCesarea").value,

ANESTESIA:
document.getElementById("anestesia").value,

LIQUIDO_AMNIOTICO:
document.getElementById("liquido").value,

CIRCULAR_CORDON:
document.getElementById("circular").value,

LEUCOCITOS:
document.getElementById("leucocitos").value,

NEUTROFILOS:
document.getElementById("neutrofilos").value,

LINFOCITOS:
document.getElementById("linfocitos").value,

MONOCITOS:
document.getElementById("monocitos").value,

HEMOGLOBINA:
document.getElementById("hemoglobina").value,

HEMATOCRITO:
document.getElementById("hematocrito").value,

PLAQUETAS:
document.getElementById("plaquetas").value,

BILI_TOTAL:
Number(document.getElementById("biliTotal").value),

BILI_DIRECTA:
document.getElementById("biliDirecta").value,

BILI_INDIRECTA:
document.getElementById("biliIndirecta").value,

PCR:
document.getElementById("pcr").value,

RPR_RN:
document.getElementById("rprRn").value,

GLICEMIA:
document.getElementById("glicemia").value,

UREA:
document.getElementById("urea").value,

CREATININA:
document.getElementById("creatinina").value,

SODIO:
document.getElementById("sodio").value,

POTASIO:
document.getElementById("potasio").value,

CLORO:
document.getElementById("cloro").value,

CALCIO:
document.getElementById("calcio").value,

MAGNESIO:
document.getElementById("magnesio").value,

TGO:
document.getElementById("tgo").value,

TGP:
document.getElementById("tgp").value,

FOSFATASA_ALCALINA:
document.getElementById("fosfatasaAlcalina").value,

GGT:
document.getElementById("ggt").value,

PROTEINAS_TOTALES:
document.getElementById("proteinasTotales").value,

ALBUMINA:
document.getElementById("albumina").value,

GLOBULINAS:
document.getElementById("globulinas").value,

RELACION_AG:
document.getElementById("relacionAG").value,

COOMBS_DIRECTO:
document.getElementById("coombsDirecto").value,

COOMBS_INDIRECTO:
document.getElementById("coombsIndirecto").value,

TAMIZ_NEONATAL:
document.getElementById("tamizNeonatal").value,

POTENCIALES_AUDITIVOS:
document.getElementById("potencialesAuditivos").value,

ECOCARDIOGRAMA:
document.getElementById("ecocardiograma").value,

USG_TRANSFONTANELAR:
document.getElementById("usgTransfontanelar").value,

DX_INGRESO_PRINCIPAL:
document.getElementById("dxIngreso1").value,

DX_INGRESO_SECUNDARIO:
document.getElementById("dxIngreso2").value,

DX_INGRESO_OTROS:
document.getElementById("dxIngreso3").value,

DX_EGRESO_PRINCIPAL:
document.getElementById("dxEgreso1").value,

DX_EGRESO_SECUNDARIO:
document.getElementById("dxEgreso2").value,

DX_EGRESO_OTROS:
document.getElementById("dxEgreso3").value, 



REQUERIMIENTO_HIDRICO:
document.getElementById("requerimientoHidrico").value,

VOLUMEN_DIARIO:
document.getElementById("volumenDiario").value,

VOLUMEN_POR_TOMA:
document.getElementById("volumenPorToma").value,

PERDIDAS_INSENSIBLES:
document.getElementById("perdidasInsensibles").value,

FOTOTERAPIA:
document.getElementById("fototerapia").value,

OBSERVACION_FOTOTERAPIA:
document.getElementById("observacionFototerapia").value,

EVOLUCION:
document.getElementById("evolucion").value,


  INDICACIONES:
document.getElementById("indicaciones").value

};


pacientes.push(paciente);

localStorage.setItem(
"pacientes",
JSON.stringify(pacientes)
);

mostrarPacientes();

const formData =
new FormData();

formData.append(
"data",
JSON.stringify(paciente)
);

await fetch(API_URL,{

method:"POST",

body:formData

});
alert(
"Expediente guardado correctamente"
);

}catch(error){

console.log(error);

}

generarExpediente();

}







mostrarPacientes();

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

String(
p.NOMBRE_RN || ""
)
.toLowerCase()
.includes(busqueda)

||

String(
p.EXPEDIENTE || ""
)
.toLowerCase()
.includes(busqueda)

);

})

.forEach((p)=>{

const clasificacion =
clasificarBilirrubina(
Number(
p.BILI_TOTAL || 0
)
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

<div class="paciente ${clasificacion.clase}">

<h3>
${p.EXPEDIENTE || ""}
</h3>

<h2>
${p.NOMBRE_RN || ""}
</h2>

<p>
<strong>Edad vida:</strong>
${p.EDAD_VIDA || ""}
</p>

<p>
<strong>Peso:</strong>
${p.PESO || ""} g
</p>

<p>
<strong>DX Ingreso:</strong>
${p.DX_INGRESO_PRINCIPAL || ""}
</p>

<p>
<strong>EG:</strong>
${p.EG || ""} semanas
</p>

<p>
<strong>Parto:</strong>
${p.TIPO_PARTO || ""}
</p>

<p>
<strong>VIH Materno:</strong>
${p.VIH || ""}
</p>

<p>
<strong>RPR Materno:</strong>
${p.RPR_MATERNO || ""}
</p>

<p>
<strong>Bilirrubina Total:</strong>
${p.BILI_TOTAL || ""}
</p>

<div class="alerta ${clasificacion.alerta}">
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
