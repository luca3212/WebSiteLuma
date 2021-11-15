//Array productos seleccionados
carroLocal = [];
//Elemento del carro (cantidad)
const nroElemenCarro = document.getElementById("mostrarnro");

/*================= Tarjeta de cada producto ==================*/
const $app = document.getElementById("divProductos");
const product = params => {
    var floatPrecio = Number.parseFloat(params.precioProducto).toFixed(2);
    return `
    <div class="cuadro" id-producto="${params.id_producto}">
        <div class="conte-foto">
            <div class="foto" >
                <img loading="lazy" src="IMG-COMPR/img${params.id_producto}.jpg" alt="" onclick="agrandar(${params.id_producto})" >
            </div>
        </div>
        <div class="datos">
            <h3>${params.nombreProducto}</h3>
            <p>${params.descripcionProducto}</p>
            <h2>$ ${floatPrecio}</h2>
        </div>
        <div class="botones">
            <button id="bton${params.id_producto}" onclick="anadir(${params.id_producto})">Añadir al carrito</button>
        </div>
    </div>
    `;
};

//array productos db
datosBD = ['{"id":"producto","nombre":"name"}'];
$.post("PHP/getProductos.php", function(response){
    //console.log(response);
    datosBD = jQuery.parseJSON(response); 
    //console.log(datosBD[0].id_producto);
    //console.log("carga");
    for(let i = 0; i< datosBD.length; i++){
        $app.innerHTML += product(datosBD[i]);
    }
    for(let i=0; i<carroLocal.length;i++){
        console.log(carroLocal[i].id);
        cambioBton(carroLocal[i].id);
    }
});


//filtrar productos

const buscarProducto = document.getElementById("buscarbton");
const nombrebuscar = document.getElementById("filtro");

buscarProducto.addEventListener('click', ()=>{
    if(nombrebuscar.value.length==0){
        alert("Ingrese una palabra al buscador..");
        nombrebuscar.focus();
    }else{  
        //encuentro el Producto y recupero el json completo
        let resultadoBusqueda = datosBD.filter(element => element.nombreProducto.toLowerCase().indexOf(nombrebuscar.value.toLowerCase()) !== -1 );
        $app.innerHTML = "";
        if(resultadoBusqueda.length == 0){
            $app.innerHTML = "No se encontraron productos con el nombre ingresado";
        }else{
            for(let i = 0; i< resultadoBusqueda.length; i++){
                $app.innerHTML += product(resultadoBusqueda[i]);
            }
            for(let i=0; i<carroLocal.length;i++){
                console.log(carroLocal[i].id);
                cambioBton(carroLocal[i].id);
            }
        }
    }
});

nombrebuscar.addEventListener('keyup', ()=>{
    if(nombrebuscar.value.length == 0){
        $app.innerHTML = "";
        for(let i = 0; i< datosBD.length; i++){
            $app.innerHTML += product(datosBD[i]);
        }
        for(let i=0; i<carroLocal.length;i++){
            console.log(carroLocal[i].id);
            cambioBton(carroLocal[i].id);
        }
    }
});

nombrebuscar.addEventListener('change', ()=>{
    if(nombrebuscar.value.length == 0){
        $app.innerHTML = "";
        for(let i = 0; i< datosBD.length; i++){
            $app.innerHTML += product(datosBD[i]);
        }
        for(let i=0; i<carroLocal.length;i++){
            console.log(carroLocal[i].id);
            cambioBton(carroLocal[i].id);
        }
    }
});


/*===================== Tarjeta lista carro ======================*/
const $listaItem = document.getElementById("ListaCarro");
const elemLista = argument =>{
    var sub = argument.precio*argument.cantidad;
    sub = Number.parseFloat(sub).toFixed(2);
    total();
    return `
    <div class="conteItem" idItemProducto="${argument.id}">
        <div class="itemLista">
            <div class="itemFoto">
                <div>
                    <img src="IMG-COMPR/img${argument.id}.jpg" alt="">
                </div>
            </div>
            <div class="divTodoInfo">
                <div class="divClose">
                    <div class="BtnEliminar">
                        <button  onclick="eliminarItem(${argument.id})"><span class="mdi mdi-close-thick"></span></button>
                    </div>
                </div>
                <div class="itemdatos">
                    <div>
                        <h3>${argument.nombre}</h3>
                        <p>${argument.descripcion}</p>
                        <h2>Precio unitario: $${argument.precio}</h2>
                    </div>
                </div>
                <div class="divContador">
                    <div class="btnsContador">
                        <button class="mdi mdi-minus" onclick="modCantidad(0,${argument.id})"></button>
                        <input type="text" name="contadorC" id="CantContador${argument.id}" value="${argument.cantidad}" readonly>
                        <button class="mdi mdi-plus" onclick="modCantidad(1,${argument.id})"></button>
                    </div>
                    <div class="total">
                        <h2 id="subtotal${argument.id}">$ ${sub}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
};

/*============== Carga de productos al carro ============*/

var sumaFinal,cantidadcont;
function total(){
    const importeTotal = document.getElementById('montoTotal');
    sumaFinal = 0;
    cantidadcont = 0;
    var contadorSubtotal;
    
    for(let i = 0; i < carroLocal.length; i++){
        contadorSubtotal = carroLocal[i].precio * carroLocal[i].cantidad;
        cantidadcont += carroLocal[i].cantidad;
        //console.log(contadorSubtotal);
        sumaFinal += contadorSubtotal;
    }
    importeTotal.innerHTML = "$ "+Number.parseFloat(sumaFinal).toFixed(2);
}

function eliminarItem(idP){
    //elimino el id selecionado
    //let ElementoProducto = arrayProductos.filter(element => element.id == idProducto);
    carroLocal = carroLocal.filter(function(item){
        return item.id != idP;
    }); 

    console.log(carroLocal);
    //actualizo la lista con el sessionStorage
    guardarsessionStorage();

    //elemina al producto del carro
    document.querySelector(`[idItemProducto="${idP}"]`).remove();

    //cambio el estado del bton del prodcuto eliminado
    cambioBtonActive(idP);
    //actuliazo la cantidad en el icono carro
    UpdateCantItems();
    //total de la caompra
    total();
    
    if(carroLocal.length==0){
        console.log("El carro esta vacio..");
        $('.secciones article').hide();
        $('#Productos').show(); 
    }
}

function modCantidad(valor,iddato){
    const cantidadVisible = document.getElementById('CantContador'+iddato);
    const precioSubtotal =  document.getElementById("subtotal"+iddato);
    const productoSelect = carroLocal.find(element => element.id == iddato);
    //console.log(productoSelect);
    //console.log("esto aca es lo que filtra");

    if( (productoSelect.cantidad==1 && valor==0) || (productoSelect.cantidad==3 && valor==1)){
        console.log(`Error no se puede restar: ${valor} y el producto: ${productoSelect.cantidad}`);
    }else{
        if(valor==0){
            productoSelect.cantidad -= 1;
            
        }else{
            productoSelect.cantidad += 1;
        }
        //console.log("el valor de porducto es: "+ productoSelect.cantidad);
        cantidadVisible.value = productoSelect.cantidad;
        precioSubtotal.innerHTML = "$ "+Number.parseFloat(productoSelect.precio*productoSelect.cantidad).toFixed(2);
        guardarsessionStorage();
        total();
        //mostrarCarro();
    }

    /*if(valor==0 && valorCantidad==1){
        console.log("error no se puede restar");
    }else{
        if(valor==0){
            valorCantidad -= 1;
        }else{
            valorCantidad += 1;
        }
        datnro.value = valorCantidad;
        calculoSubTotal(id,valorCantidad);
    }


    var datnro = document.getElementById('CantContador'+id);
    const subTotal = document.getElementById('subtotal'+id);

    valorCantidad = Number(datnro.value);

    console.log("EStos son los valores:"+datnro.value+" dshfsd: ");*/
    
   
}

function calculoSubTotal(iditem, canti){
    const precioUnitario = carroLocal.find(element => element.id == iditem);

    console.log("valor unitario de ese producto: "+ precioUnitario.precio);
}


function anadir(idProducto){
    //encuentro el Producto y recupero el json completo
    let ElementoProducto = datosBD.filter(element => element.id_producto == idProducto);
    console.log(ElementoProducto[0]);

    //cargo el json del producto en el arreglo
    //carroLocal.push(ElementoProducto[0]);

    carroLocal.push(
        {
            "id": ElementoProducto[0].id_producto,
            "nombre": ElementoProducto[0].nombreProducto,
            "descripcion": ElementoProducto[0].descripcionProducto,
            "precio": ElementoProducto[0].precioProducto,
            "cantidad": 1
        }
    );

    //guardo el arreglo en el sessionStorage
    guardarsessionStorage();

    //cambio de estado al boton del producto
    cambioBton(idProducto);
   
    //actualizo la cantidad de elementos guardados en el icono chango
    UpdateCantItems();

   
}

//cambia estado de botones
function cambioBton(idbton){
    //configuracion al boton (qeda inactivo despues de la accion)
    console.log("entro", idbton);
    const botonD = document.getElementById('bton'+idbton);
    botonD.innerHTML = "Añadido!";
    botonD.classList.add("btonDisable");
    //botonD.style.background = "#369e5e";
    //botonD.style.color = "#fff";
    //botonD.disabled = true;
}

//cambia estado de botones
function cambioBtonActive(idbton){
    //configuracion al boton (qeda inactivo despues de la accion)
    const botonA = document.getElementById('bton'+idbton);
    
    botonA.innerHTML = "Añadir al carrito";
    botonA.classList.remove("btonDisable");
    //botonA.disabled = true;
}

//guardamos los datos en el sessionStorage
function guardarsessionStorage(){
    if('sessionStorage' in window){
        sessionStorage.setItem("ProductosGuardados", JSON.stringify(carroLocal));
        console.log("Producto Añadido al carro..sessiojnStorage");
    }else{
        alert("Error al guardar en sessionStorage");
    }
}

//recuperar datos del sessionStorge
function recuperarDatos(){
    if('sessionStorage' in window){
        return JSON.parse(sessionStorage.getItem("ProductosGuardados")) || [];
    }else{
        return [];
    }
}

//suma uno a la cantidad de elementos guardados
function UpdateCantItems(){
    nroElemenCarro.innerHTML = carroLocal.length;
}

/*============== Menu Opciones ===============*/
$(document).ready(function(){
    $('.secciones article').hide();
    $('#Productos').show(); 

    $('ul.tabs li a').click(function(){
        //$('ul.tabs li a').removeClass('active');
        //$(this).addClass('active');
        $('.secciones article').hide();
        cerrarMenuBurger();
        var activeTab = $(this).attr('href');
        $(activeTab).show();
        return false;
    });
});

/*============== Carro =====================*/
const carrito=document.getElementById("icoCarro");

carrito.addEventListener('click',()=>{
    if(carroLocal.length!=0){
        mostrarCarro();
        $('.secciones article').hide();
        $('#Carro').show();
    }else{
        console.log("no hay productos en el carro para mostrar");
    }
  
});

function mostrarCarro(){
    datossessionStorage = recuperarDatos();

    console.log(datossessionStorage.length);
    console.log("datos arriba");

    $listaItem.innerHTML = "";
    for(let i = 0; i< datossessionStorage.length; i++){
        $listaItem.innerHTML += elemLista(datossessionStorage[i]);
    }


    /*
    $listaItem.innerHTML = "";
    datossessionStorage.map((dataP) => {
       console.log(dataP);
       $listaItem.innerHTML += elemLista(dataP);
    });
    */
   
}

//Sincronizacion de datos del array(carroLocal) y el SessionStorage
window.onload = function () {
    datosLocalStorage = recuperarDatos();

    datosLocalStorage.map((tareaG) => {
        //addLista(tareaG);
        carroLocal.push(tareaG);
    });
    nroElemenCarro.innerHTML = carroLocal.length;
    //console.log("esta en onload");
};

/*============== Menu mobiles ===============*/
const navburger = document.getElementById("divBurger");
const navmenu = document.getElementById("menuPrincipal");
const navcruz = document.getElementById("close");

//Abrir
if(navburger){
    navburger.addEventListener('click', () =>{
        navmenu.classList.add("mostrarmenu");
        navburger.classList.add("disable"); 
    });
}

//Cerrar
if(navcruz){
    navcruz.addEventListener('click',()=>{
        navmenu.classList.remove("mostrarmenu");
        navburger.classList.remove("disable");
    });
}

//Cerramos el menu para celulares
function cerrarMenuBurger(){
    var ancho =$(window).width();
    if (ancho < 830) {
        navmenu.classList.remove("mostrarmenu");
        navburger.classList.remove("disable");
    }
}