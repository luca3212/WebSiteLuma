const btonContacto = document.getElementById('sendMensaje');

const nombreContacto    = document.getElementById('nameContact');
const apellidoContacto  = document.getElementById('apellidoContact');
const telContacto       = document.getElementById('telefonoContact');
const mensajeContacto   = document.getElementById('mensajeContact');

btonContacto.addEventListener('click', ()=>{
    

    if(nombreContacto.value.length ==0){
        nombreContacto.focus();
    }else{
        if(apellidoContacto.value.length ==0){
            apellidoContacto.focus();
        }else{
            if(telContacto.value.length ==0){
                telContacto.focus();
            }else{
                if(mensajeContacto.value.length ==0){
                    mensajeContacto.focus();
                }else{
                    //todo esta completo
                    $.ajax({
                        type: "POST",
                        url: "PHP/EnviarMensaje.php",
                        data: {nombreC: nombreContacto.value ,apellidoC: apellidoContacto.value,telefonoC: telContacto.value,mensajeC: mensajeContacto.value},
                        success: function (response){
                            alert(response);
                            limpiarFormContact();
                            $('.secciones article').hide();
                            $('#Productos').show();
                        }
                    });


                }
            }
        }
    }   
    
});

function limpiarFormContact(){
    nombreContacto.value    = "";  
    apellidoContacto.value  = "";
    telContacto.value   = "";     
    mensajeContacto.value   = ""; 
}