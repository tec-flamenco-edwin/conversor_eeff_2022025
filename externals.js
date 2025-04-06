const requestNotificationPermission = async ()=>{
    const permission = await Notification.requestPermission();

    if(permission !== 'granted'){
        throw new Error("No se ha podido otorgar permisos para la notificacion.");
    }else{
        new Notification ("Hola mi nombrre es flamenco , soy estudiante de la  UGF.");
    }
}

async function recordVideo(){
    if (window.recorder && window.recorder.state==="recording"){
        window.recorder.stop();
    }else{
        let toggle = document.getElementById("recording-button");
        let stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true}).catch((error)=>{
            throw new Error("no es posible continuar, debido a falta de permisos");
        });

        let videoE1 = document.getElementById("video-element");
        videoE1.srcObject = stream;
        videoE1.play();

        window.recorder = new MediaRecorder(stream);
        let chunks = [];
        window.recorder.ondataavailable = function(event){
            if(event.data.size > 0){
                chunks.push(event.data);
            }
        };

        window.recorder.onstop = function(){
            let blob = new Blob(chunks,{type:'video/webm'});
            toggle.innerHTML = '<i class="fa fa-circle"></i>';
            videoE1.srcObject= null;
            videoE1.src = URL.createObjectURL(blob);
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

window.recorder.onstart = function(){
    toggle.innerHTML = '<i class="fa fa-circle"></i>';
};

window.recorder.start();

    }
}
function geolocalizacion(){
    if(navigator.permissions && navigator.permissions.query){
        navigator.permissions.query({name:'geolocation'}).then(function(result){
            const permission = result.state;
            if(permission === 'granted' || permission === 'prompt'){
                _onGetCurrentLocation();
            } 
        });

    }else if (navigator.geolocation){
        _onGetCurrentLocation();
    }
}

function _onGetCurrentLocation(){
    const options ={
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(function(position){
        const maker = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        let enlace = document.getElementById("ir_mapa");
        enlace.href = `https://maps.google.com/?q=${maker.lat},${maker.lng}`;
        enlace.text = "Ir al mapa";
        enlace.target = "_blank";
    },function(error){
        console.log(error);
    },options);
}
const init = () => {
    const tieneSoporteUserMedia = () =>
        !!(navigator.mediaDevices?.getUserMedia);

    if (typeof MediaRecorder === "undefined" || !tieneSoporteUserMedia()) {
        return alert("Su navegador no cumple con los requisitos, favor actualizar a una versión más reciente.");
    }

    const $listaDeDispositivos = document.querySelector("#listaDeDispositivos"),
          $duracion = document.querySelector("#duracion"),
          $btnComenzarGrabacion = document.querySelector("#btnComenzarGrabacion"),
          $btnDetenerGrabacion = document.querySelector("#btnDetenerGrabacion");

    const limpiarSelect = () => {
        for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--) {
            $listaDeDispositivos.options.remove(x);
        }
    };

    const segundosATiempo = numeroDeSegundos => {
        let horas = Math.floor(numeroDeSegundos / 3600);
        numeroDeSegundos -= horas * 3600;

        let minutos = Math.floor(numeroDeSegundos / 60);
        numeroDeSegundos -= minutos * 60;

        numeroDeSegundos = parseInt(numeroDeSegundos);

        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${numeroDeSegundos.toString().padStart(2, '0')}`;
    };

    let tiempoInicio, mediaRecorder, idIntervalo;

    const refrescar = () => {
        if (tiempoInicio) {
            $duracion.textContent = segundosATiempo((Date.now() - tiempoInicio) / 1000);
        }
    };

    const llenarLista = () => {
        navigator.mediaDevices.enumerateDevices().then(dispositivos => {
            limpiarSelect();
            dispositivos.forEach((dispositivo, indice) => {
                if (dispositivo.kind === "audioinput") {
                    const $opcion = document.createElement("option");
                    $opcion.text = dispositivo.label || `Dispositivo ${indice + 1}`;
                    $opcion.value = dispositivo.deviceId;
                    $listaDeDispositivos.appendChild($opcion);
                }
            });
        });
    };

    const comenzarAContar = () => {
        tiempoInicio = Date.now();
        idIntervalo = setInterval(refrescar, 500);
    };

    const detenerConteo = () => {
        clearInterval(idIntervalo);
        tiempoInicio = null;
        $duracion.textContent = "";
    };

    const comenzarAGrabar = () => {
        if (!$listaDeDispositivos.options.length) return alert("No hay dispositivos disponibles.");
        if (mediaRecorder) return alert("Ya se está grabando.");

        navigator.mediaDevices.getUserMedia({
            audio: { deviceId: $listaDeDispositivos.value }
        }).then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            const fragmentosDeAudio = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                fragmentosDeAudio.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                stream.getTracks().forEach(track => track.stop());
                detenerConteo();

                const blobAudio = new Blob(fragmentosDeAudio);
                const urlParaDescargar = URL.createObjectURL(blobAudio);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display:none";
                a.href = urlParaDescargar;
                a.download = "grabacion.webm";
                a.click();
                window.URL.revokeObjectURL(urlParaDescargar);
            });

            mediaRecorder.start();
            comenzarAContar();
        }).catch(error => {
            console.error("Error al iniciar la grabación:", error);
        });
    };

    const detenerGrabacion = () => {
        if (!mediaRecorder) return alert("No se está grabando.");
        mediaRecorder.stop();
        mediaRecorder = null;
    };

    $btnComenzarGrabacion.addEventListener("click", comenzarAGrabar);
    $btnDetenerGrabacion.addEventListener("click", detenerGrabacion);

    llenarLista();
};

document.addEventListener("DOMContentLoaded", init);