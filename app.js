const API_URL = "https://script.google.com/macros/s/AKfycbzr36K3N8k9iGwi5EeV-v9UgUTj5Apw0KJ1PMJfCaljcEmVxDajK9Ky3n29B7cNJNUC/exec";

let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
let modoEdicion = null;

function calcularEdadVida() {
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  if (!fechaNacimiento) {
    document.getElementById("edadVida").value = "";
    return;
  }

  const nacimiento = new Date(fechaNacimiento + 'T00:00:00');
  const ahora = new Date();
  const diferenciaMs = ahora - nacimiento;
  
  if (diferenciaMs < 0) {
    document.getElementById("edadVida").value = "Fecha inválida";
    return;
  }

  const horasTotales = Math.floor(diferenciaMs / (1000 * 60 * 60));
  const dias = Math.floor(horasTotales / 24);
  const horasRestantes = horasTotales % 24;
  const texto = dias > 0? `${dias} días y ${horasRestantes} horas` : `${horasTotales} horas`;
  document.getElementById("edadVida").value = texto;
}

function clasificarBilirrubina(valor) {
  const v = Number(valor) || 0;
  if (v >= 20) return { estado: "Crítico", clase: "critico", alerta: "danger-alert" };
  if (v >= 15) return { estado: "Patológico", clase: "patologico", alerta: "warning-alert" };
  return { estado: "Normal", clase: "", alerta: "normal-alert" };
}

function getDatosFormulario() {
  const getVal = id => document.getElementById(id)?.value.trim() || "";
  const getNum = id => parseFloat(getVal(id)) || 0;

  return {
    EXPEDIENTE: getVal("expediente"),
    NOMBRE_RN: getVal("nombre"),
    FECHA_NACIMIENTO: getVal("fechaNacimiento"),
    EDAD_VIDA: getVal("edadVida"),
    SEXO: getVal("sexo"),
    PESO: getNum("peso"),
    TALLA: getNum("talla"),
    PC: getNum("pc"),
    EG: getVal("eg"),
    APGAR1: getVal("apgar1"),
    APGAR5: getVal("apgar5"),
    MADRE: getVal("madre"),
    DNI_MADRE: getVal("dniMadre"),
    EDAD_MADRE: getVal("edadMadre"),
    GRUPO_MADRE: getVal("grupoMadre"),
    RH_MADRE: getVal("rhMadre"),
    GRUPO_RN: getVal("grupoRn"),
    RH_RN: getVal("rhRn"),
    INTERPRETACION_CLINICA: getVal("interpretacionClinica"),
    GESTAS: getVal("gestas"),
    PARTOS: getVal("partos"),
    CESAREAS: getVal("cesareas"),
    ABORTOS: getVal("abortos"),
    VIH: getVal("vih"),
    RPR_MATERNO: getVal("rprMaterno"),
    TIPO_PARTO: getVal("tipoParto"),
    MOTIVO_CESAREA: getVal("motivoCesarea"),
    ANESTESIA: getVal("anestesia"),
    LIQUIDO_AMNIOTICO: getVal("liquido"),
    CIRCULAR_CORDON: getVal("circular"),
    LEUCOCITOS: getVal("leucocitos"),
    NEUTROFILOS: getVal("neutrofilos"),
    LINFOCITOS: getVal("linfocitos"),
    MONOCITOS: getVal("monocitos"),
    HEMOGLOBINA: getNum("hemoglobina"),
    HEMATOCRITO: getNum("hematocrito"),
    PLAQUETAS: getNum("plaquetas"),
    BILI_TOTAL: getNum("biliTotal"),
    BILI_DIRECTA: getNum("biliDirecta"),
    BILI_INDIRECTA: getNum("biliIndirecta"),
    PCR: getVal("pcr"),
    RPR_RN: getVal("rprRn"),
    GLICEMIA: getNum("glicemia"),
    UREA: getNum("urea"),
    CREATININA: getNum("creatinina"),
    SODIO: getNum("sodio"),
    POTASIO: getNum("potasio"),
    CLORO: getNum("cloro"),
    CALCIO: getNum("calcio"),
    MAGNESIO: getNum("magnesio"),
    TGO: getNum("tgo"),
    TGP: getNum("tgp"),
    FOSFATASA_ALCALINA: getVal("fosfatasaAlcalina"),
    GGT: getVal("ggt"),
    PROTEINAS_TOTALES: getVal("proteinasTotales"),
    ALBUMINA: getVal("albumina"),
    GLOBULINAS: getVal("globulinas"),
    RELACION_AG: getVal("relacionAG"),
    COOMBS_DIRECTO: getVal("coombsDirecto"),
    COOMBS_INDIRECTO: getVal("coombsIndirecto"),
    TAMIZ_NEONATAL: getVal("tamizNeonatal"),
    POTENCIALES_AUDITIVOS: getVal("potencialesAuditivos"),
    ECOCARDIOGRAMA: getVal("ecocardiograma"),
    USG_TRANSFONTANELAR: getVal("usgTransfontanelar"),
    DX_INGRESO_PRINCIPAL: getVal("dxIngreso1"),
    DX_INGRESO_SECUNDARIO: getVal("dxIngreso2"),
    DX_INGRESO_OTROS: getVal("dxIngreso3"),
    DX_EGRESO_PRINCIPAL: getVal("dxEgreso1"),
    DX_EGRESO_SECUNDARIO: getVal("dxEgreso2"),
    DX_EGRESO_OTROS: getVal("dxEgreso3"),
    REQUERIMIENTO_HIDRICO: getVal("requerimientoHidrico"),
    VOLUMEN_DIARIO: getVal("volumenDiario"),
    VOLUMEN_POR_TOMA: getVal("volumenPorToma"),
    PERDIDAS_INSENSIBLES: getVal("perdidasInsensibles"),
    FOTOTERAPIA: getVal("fototerapia"),
    OBSERVACION_FOTOTERAPIA: getVal("observacionFototerapia"),
    EVOLUCION: getVal("evolucion"),
    INDICACIONES: getVal("indicaciones"),
    ESTADO_HOSPITALIZADO: getVal("estadoHospitalizado") || "SI",
    ULTIMA_ACTUALIZACION: new Date().toISOString()
  };
}

async function guardarPaciente() {
  const paciente = getDatosFormulario();

  if (!paciente.EXPEDIENTE || !paciente.NOMBRE_RN) {
    alert("Expediente y Nombre son obligatorios");
    return;
  }

  try {
    const index = pacientes.findIndex(p => p.EXPEDIENTE === paciente.EXPEDIENTE);
    const esActualizacion = index !== -1;

    if (esActualizacion) {
      paciente.HISTORIAL = pacientes[index].HISTORIAL || [];
      paciente.HISTORIAL.push({
        FECHA: new Date().toLocaleDateString('es-HN'),
        PESO: paciente.PESO,
        BILI_TOTAL: paciente.BILI_TOTAL,
        EVOLUCION: paciente.EVOLUCION,
        EDAD_VIDA: paciente.EDAD_VIDA
      });
      pacientes[index] = paciente;
    } else {
      paciente.HISTORIAL = [{
        FECHA: new Date().toLocaleDateString('es-HN'),
        PESO: paciente.PESO,
        BILI_TOTAL: paciente.BILI_TOTAL,
        EVOLUCION: paciente.EVOLUCION,
        EDAD_VIDA: paciente.EDAD_VIDA
      }];
      pacientes.push(paciente);
    }

    localStorage.setItem("pacientes", JSON.stringify(pacientes));

    const formData = new FormData();
    formData.append("data", JSON.stringify(paciente));
    formData.append("action", esActualizacion ? "update" : "create");

    const res = await fetch(API_URL, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Error servidor: " + res.status);

    mostrarPacientes();
    limpiarFormulario();
    alert(esActualizacion ? "Expediente actualizado" : "Expediente guardado");
    if (typeof generarExpediente === 'function') generarExpediente();

  } catch (error) {
    console.error(error);
    alert("Error al guardar en servidor. Se guardó localmente.");
    mostrarPacientes();
  }
}

function cargarPacienteParaEditar(expediente) {
  const p = pacientes.find(p => p.EXPEDIENTE === expediente);
  if (!p) return;

  modoEdicion = expediente;
  document.getElementById("btnGuardar").innerText = "Actualizar Paciente";

  Object.keys(p).forEach(key => {
    const id = key.toLowerCase().replace(/_/g, '');
    const el = document.getElementById(id);
    if (el && key !== 'HISTORIAL') el.value = p[key] || '';
  });

  document.getElementById("formPaciente")?.scrollIntoView({ behavior: 'smooth' });
}

function limpiarFormulario() {
  document.getElementById("formPaciente")?.reset();
  modoEdicion = null;
  const btn = document.getElementById("btnGuardar");
  if (btn) btn.innerText = "Guardar Paciente";
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function mostrarPacientes() {
  const lista = document.getElementById("listaPacientes");
  if (!lista) return;

  const busqueda = document.getElementById("buscarPaciente")?.value.toLowerCase() || "";
  const soloHospitalizados = document.getElementById("filtroHospitalizados")?.checked;

  let html = '';
  let patologicos = 0, criticos = 0, hospitalizados = 0;

  pacientes
    .filter(p => {
      const coincideBusqueda = String(p.NOMBRE_RN || "").toLowerCase().includes(busqueda) ||
                               String(p.EXPEDIENTE || "").toLowerCase().includes(busqueda);
      const cumpleFiltro = !soloHospitalizados || p.ESTADO_HOSPITALIZADO === "SI";
      return coincideBusqueda && cumpleFiltro;
    })
    .forEach(p => {
      const clasificacion = clasificarBilirrubina(p.BILI_TOTAL);
      if (clasificacion.estado === "Patológico") patologicos++;
      if (clasificacion.estado === "Crítico") criticos++;
      if (p.ESTADO_HOSPITALIZADO === "SI") hospitalizados++;

      const ultimaFecha = p.ULTIMA_ACTUALIZACION ? new Date(p.ULTIMA_ACTUALIZACION).toLocaleDateString('es-HN') : 'N/A';

      html += `
        <div class="paciente ${clasificacion.clase}">
          <h3>${escapeHTML(p.EXPEDIENTE || "")} ${p.ESTADO_HOSPITALIZADO === "SI" ? '<span class="badge-hosp">HOSP</span>' : ''}</h3>
          <h2>${escapeHTML(p.NOMBRE_RN || "")}</h2>
          <p><strong>Edad vida:</strong> ${escapeHTML(p.EDAD_VIDA || "")}</p>
          <p><strong>Peso:</strong> ${escapeHTML(p.PESO || "")} g</p>
          <p><strong>Bili Total:</strong> ${escapeHTML(p.BILI_TOTAL || "")}</p>
          <p><strong>Último update:</strong> ${ultimaFecha}</p>
          <div class="alerta ${clasificacion.alerta}">${clasificacion.estado}</div>
          <button onclick="cargarPacienteParaEditar('${escapeHTML(p.EXPEDIENTE)}')">Actualizar</button>
          <button onclick="verHistorial('${escapeHTML(p.EXPEDIENTE)}')">Ver Historial</button>
        </div>
      `;
    });

  lista.innerHTML = html;

  document.getElementById("totalPacientes").innerText = pacientes.length;
  document.getElementById("casosPatologicos").innerText = patologicos;
  document.getElementById("casosCriticos").innerText = criticos;
  document.getElementById("casosHospitalizados").innerText = hospitalizados;
}

function verHistorial(expediente) {
  const p = pacientes.find(p => p.EXPEDIENTE === expediente);
  if (!p || !p.HISTORIAL) return alert("Sin historial");

  let texto = `Historial de ${p.NOMBRE_RN}:\n\n`;
  p.HISTORIAL.forEach(h => {
    texto += `${h.FECHA} - ${h.EDAD_VIDA} - Peso: ${h.PESO}g - Bili: ${h.BILI_TOTAL}\n${h.EVOLUCION}\n\n`;
  });
  alert(texto);
}

window.onload = function() {
  mostrarPacientes();
  document.getElementById("buscarPaciente")?.addEventListener("keyup", mostrarPacientes);
  document.getElementById("filtroHospitalizados")?.addEventListener("change", mostrarPacientes);
  document.getElementById("fechaNacimiento")?.addEventListener("change", calcularEdadVida);
};
