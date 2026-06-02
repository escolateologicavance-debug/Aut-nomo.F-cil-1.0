const btnVoice = document.getElementById("btnVoice");
const resultado = document.getElementById("resultadoVoz");

if ('webkitSpeechRecognition' in window) {

const recognition = new webkitSpeechRecognition();

recognition.lang = "pt-BR";
recognition.continuous = false;
recognition.interimResults = false;

btnVoice.addEventListener("click", () => {
recognition.start();
});

recognition.onresult = (event) => {

const texto =
event.results[0][0].transcript;

resultado.value = texto;

salvarHistorico(texto);

};

}

function salvarHistorico(texto){

let historico =
JSON.parse(localStorage.getItem("historicoVoz")) || [];

historico.push({
texto,
data:new Date().toLocaleString()
});

localStorage.setItem(
"historicoVoz",
JSON.stringify(historico)
);

}

if('serviceWorker' in navigator){

navigator.serviceWorker.register(
'service-worker.js'
);

}