var pocket = pocket || {},
    data = JSON.parse(localStorage.getItem("pocketData"));

data = data || {};

var mainAccountBalance = 5000;

(function(pocket, data, $) {

    var defaults = {
            pocketItem: "pocket-item",
            pocketInfo: "pocket-info",
            pocketName: "pocket-name",
            pocketStatus: "pocket-status",
            pocketBalance: "pocket-balance",
            pocketId: "pocket-",
            dataAttribute: "data",
            deleteDiv: "delete-div",
            pocketsDiv: "pocket-list",
        };

    function checkIfEmpty(){
        var pocketItems = $(".pocket-item").length;
        var pocketsMainCont = $("#container");
        console.log(pocketItems);
            if(pocketItems > 0){
                $(pocketsMainCont).find("p.notification").hide();
            } else {
                $(pocketsMainCont).find("p.notification").show();
            }
            
        }

    pocket.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);


        $.each(data, function (index, params) {
            generateElement(params);
        });

        checkIfEmpty();
        console.log(JSON.stringify(data));
};
//Render functions--------------------------------------------------
    var generateElement = function(params){
        var parent = $("#activePockets"),
            wrapper,
            info,
            amount;

       //Render HTML      
        wrapper = $("<div />", {
            "class" : defaults.pocketItem + " card-panel teal white-text col s3",
            "id" : defaults.pocketId + params.id,
            "data" : params.id
        }).appendTo(parent);

        info =  $("<div />", {
            "class" : defaults.pocketInfo
        }).appendTo(wrapper);

        $("<h5 />", {
            "class" : defaults.pocketName+ " card-title",
            "text":params.name
        }).appendTo(info);

        $("<input />", {
            "class" :"programmed",
            "type" : "hidden",
            "value": params.programmed
        }).appendTo(info);

         $("<p />", {
            "class" : defaults.pocketStatus,
            "text": (params.programmed == ("1") ? "Programado" : "No programado")
        }).appendTo(info);

         //Condicionales visuales si esta programado

         if(params.programmed == "1"){
             $("<span />", {
            "text": "Saldo programado: "+ params.progAmount
            }).appendTo(info);
         } 

        //End of condicionales visuales si esta programado

         amount =  $("<div />", {
            "class" : defaults.pocketAmount
        }).appendTo(wrapper);

         $("<input />", {
            "class" :"balance",
            "type" : "hidden",
            "value": params.money
        }).appendTo(amount);

         //Condicionales visuales si tiene saldo
         if(params.balance == ""){
            $("<p />", {
                "text": "Saldo Pocket: 0"
            }).appendTo(amount);
        } else {

           $("<p />", {
            "text": "Saldo Pocket: "+ params.balance
        }).appendTo(amount);
       }

       $("<hr>", {
        }).appendTo(wrapper);
         //End of Condicionales visuales si tiene saldo

         var links;
        //Links si no tiene saldo pero si esta programado
        if(params.balance == "0" || params.balance == "" ){
            links =  '<a class="edit-pocket" href="#">Editar pocket</a>';
            links += '<a class="program-pocket" href="#">Programación</a>';
            links += '<a class="movs-pocket" href="#">Ver movimientos</a>';
            links += '<a class="deposit-pocket" href="#">Añadir dinero</a>';
            links += '<a class="delete-pocket" href="#">Eliminar Pocket</a>';

        } else if(params.balance != "0" || params.balance != "" ) {
           //links si tiene saldo y aparte esta programado
            links =  '<a class="edit-pocket" href="#">Editar pocket</a>';
            links += '<a class="program-pocket" href="#">Programación</a>';
            links += '<a class="movs-pocket" href="#">Ver movimientos</a>';
            links += '<a class="deposit-pocket" href="#">Añadir dinero</a>';
            links += '<a class="withdraw-pocket" href="#">Disponer dinero</a>';
            links += '<a class="delete-pocket" href="#">Eliminar Pocket</a>';
        } 
        
        $(links).appendTo(wrapper);

        /*generateElement({
            id: "123",
            programmed: "1",
            money: "1",
            name: "Hogar",
            balance: "2000",
            progAmount: "200",
        });*/
        checkIfEmpty();
         console.log("Created Object: "+ JSON.stringify(params) +", data updated:"+ JSON.stringify(data));

    };

    // Remove Pocket & update JSON
    var removeElement = function (params) {
        var css_id = "#" + defaults.pocketId + params.id;
        $(css_id).remove();
        var id = css_id.replace(defaults.pocketId, ""),
        object = params.id;
        delete data[object];
        localStorage.setItem("pocketData", JSON.stringify(data));
        checkIfEmpty();
        console.log("Deleted Object: "+ object +", data updated: "+JSON.stringify(data));
    };

    // var editElement = function (params) {
    //     object = params.id;
    //     delete data[object];

    //     data[id] = params;
    //     localStorage.setItem("pocketData", JSON.stringify(data));
    //     // Re-generate pocket list
    //     generateElement(tempData);
    //     console.log("Edited Object: "+ object +", data updated: "+JSON.stringify(data));
    // };

//Crear--------------------------------------------------
    pocket.add = function() {
        var createForm = $("#pocket-form-add" );
        name = $("#pocket-form-add .pocket-name").val();
        money = $("#pocket-form-add .money:checked").val();
        programmed = $("#pocket-form-add .program:checked").val();
        progAmount = $("#pocket-form-add .prog-amount").val();
        balance = $("#pocket-form-add .pocket-balance").val();

        id = new Date().getTime();

        tempData = {
            id: id,
            money: money,
            programmed: programmed,
            name: name,
            balance: balance,
            progAmount: progAmount,
        };

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("pocketData", JSON.stringify(data));

        // Generate pocket Element
        generateElement(tempData);

        // Reset Form
        $(".create-pocket-modal, .overlay-modals.scale-in").removeClass("scale-in");
        $('#pocket-form-add input[type="text"]:not(.selected-account)').val("");
        console.log("Added pocket, result: "+ JSON.stringify(data));
    };

    //Generar Notificacion

    //Delete Pocket
    pocket.delete = function (element) {
        var id = element.replace(defaults.pocketId, ""),
        object = data[id];
        console.log(object);
        removeElement(object);
    };
//Editar--------------------------------------------------
    pocket.edit = function (element) {
        var editForm = $("#pocket-form-edit" );
        
        var editando = element.replace(defaults.pocketId, "");
        console.log(editando);
        var id = editando,
        object = data[id];
        console.log("Estoy editando:" + object.name);

        name = $("#pocket-form-edit input.pocket-name").val();

        tempData = {
            id: object.id,
            money: object.money,
            programmed: object.programmed,
            name: name,
            balance: object.balance,
            progAmount: object.progAmount,
        };

        //Saving element in local storage

        data[id] = tempData;

        localStorage.setItem("pocketData", JSON.stringify(data));
        //Reemplazar objeto en el array
        $("#activePockets").html("");
        //Re-insert generate Pockets List
        $.each(data, function (index, params) {
            generateElement(params);
        });

        $(".edit-pocket-modal, .overlay-modals.scale-in").removeClass("scale-in");

        console.log("Edited pocket, result: "+ JSON.stringify(data));
         // Reset Form
        $('#pocket-form-edit input[type="text"]:not(.selected-account)').val("");
        //   console.log("Edited pocket, result: "+ JSON.stringify(data));
        return context = ""
    };

//Programar o editar programación--------------------------------------------------
    pocket.program = function (element) {
        var editForm = $("#pocket-form-program" );
        
        var editando = element.replace(defaults.pocketId, "");
        console.log(editando);
        var id = editando;
        var object = data[id];
        //console.log("Estoy programando:" + object.name);

        programmed = $("#pocket-form-program .program:checked").val();
        progAmount = $("#pocket-form-program .prog-amount").val();

        tempData = {
            id: object.id,
            money: object.money,
            programmed: programmed,
            name: object.name,
            balance: object.balance,
            progAmount: progAmount,
        };

        //Saving element in local storage

        data[id] = tempData;

        localStorage.setItem("pocketData", JSON.stringify(data));
        //Reemplazar objeto en el array
        $("#activePockets").html("");
        //Re-insert generate Pockets List
        $.each(data, function (index, params) {
            generateElement(params);
        });

        $(".program-pocket-modal, .overlay-modals.scale-in").removeClass("scale-in");

        console.log("Changed programming of pocket, result: "+ JSON.stringify(data));
         // Reset Form
        $('#pocket-form-program input[type="text"]:not(.selected-account)').val("");
        //   console.log("Edited pocket, result: "+ JSON.stringify(data));
        return context = ""
    };


//Depositar--------------------------------------------------    
        pocket.deposit = function (element) {
        var editForm = $("#pocket-form-deposit" );
        
        var editando = element.replace(defaults.pocketId, "");
        console.log(editando);
        var id = editando,
        object = data[id];
        console.log("Añadiendo dinero a:" + object.name);
        depositAmount = $("#pocket-form-deposit input.pocket-balance").val();
        //Si esta vacio el pocket en un inicio
        if(object.money == "0"){
            money = "1";
            balance =  0 + parseInt(depositAmount);
        } else {
            money = object.money;
            balance =  parseInt(object.balance) + parseInt(depositAmount);
        }
        tempData = {
            id: object.id,
            money: money,
            programmed: object.programmed,
            name: object.name,
            balance: balance,
            progAmount: object.progAmount,
        };

        //Saving element in local storage

        data[id] = tempData;

        localStorage.setItem("pocketData", JSON.stringify(data));
        //Reemplazar objeto en el array
        $("#activePockets").html("");
        //Re-insert generate Pockets List
        $.each(data, function (index, params) {
            generateElement(params);
        });

        $(".deposit-pocket-modal, .overlay-modals.scale-in").removeClass("scale-in");

        console.log("Deposit to pocket, result: "+ JSON.stringify(data));
         // Reset Form
        $('#pocket-form-deposit input[type="text"]:not(.selected-account)').val("");
        //   console.log("Edited pocket, result: "+ JSON.stringify(data));
        return context = ""
    };

//Retirar--------------------------------------------------
        pocket.withdraw = function (element) {
        var editForm = $("#pocket-form-withdraw");
        
        var editando = element.replace(defaults.pocketId, "");
        console.log(editando);
        var id = editando,
        object = data[id];
        console.log("Retirando dinero de:" + object.name);
        withdrawAmount = $("#pocket-form-withdraw input.pocket-balance").val();
        balance =  parseInt(object.balance) - parseInt(withdrawAmount);
        money = object.money;
        /*En caso de que retiremos todo el saldo, simulamos que 
        se resta la misma cantidad que tiene, se queda en ceros */

        var withdrawAllTrue = $('input.pocket-withdraw-all').prop( "checked");

        if(withdrawAllTrue == true){
            //o puede ser 
           withdrawAmount = parseInt(object.balance);
            balance =  parseInt(object.balance) - withdrawAmount;
            money = "0";
        }

        //-----------------------------
        tempData = {
            id: object.id,
            money: money,
            programmed: object.programmed,
            name: object.name,
            balance: balance,
            progAmount: object.progAmount,
        };

        //Saving element in local storage

        data[id] = tempData;

        localStorage.setItem("pocketData", JSON.stringify(data));
        //Reemplazar objeto en el array
        $("#activePockets").html("");
        //Re-insert generate Pockets List
        $.each(data, function (index, params) {
            generateElement(params);
        });

        $(".withdraw-pocket-modal, .overlay-modals.scale-in").removeClass("scale-in");

        console.log("Withdraw from pocket, result: "+ JSON.stringify(data));
         // Reset Form
        $('#pocket-form-withdraw input[type="text"]:not(.selected-account)').val("");
        $('input.pocket-withdraw-all').prop( "checked", false );
        //   console.log("Edited pocket, result: "+ JSON.stringify(data));
        return context = ""
    };

})(pocket, data, jQuery);

//Menu actions-------------------------------------------

//Create Pocket
$(document).on("click", ".create", function(event){
    $(".create-pocket-modal, .overlay-modals").addClass("scale-in");
    });
//Delete Pocket
$(document).on("click", ".delete-pocket", function(event){
    var clickTarget = event.target;
    console.log(clickTarget);
    var element = $(clickTarget).closest(".pocket-item").attr("id");
    pocket.delete(element);
});

var context ="";

//Program or edit programmming of Pocket
$(document).on("click", ".program-pocket", function(event){
    var clickTarget = event.target;
    context = $(clickTarget).closest(".pocket-item").attr("id");
    var id = context.replace("pocket-", ""),
    editable = data[id];
    console.log("retiro");

    $(".program-pocket-modal span.pocket-name").html(editable.name);
    $("#pocket-form-program .program[value='"+editable.programmed +"']").prop("checked", true);
    $("#pocket-form-program .prog-amount").val(editable.progAmount);
    
    $(".program-pocket-modal, .overlay-modals").addClass("scale-in");
    return context
    });

$(document).on("click", ".ok-program-pocket", function(event){
    pocket.program(context);
});

//Edit Pocket
$(document).on("click", ".edit-pocket", function(event){
    var clickTarget = event.target;
    context = $(clickTarget).closest(".pocket-item").attr("id");
    var id = context.replace("pocket-", ""),
    editable = data[id];

    $("#pocket-form-edit .pocket-name").val(editable.name);
    $(".edit-pocket-modal span.pocket-name").html(editable.name);
    
    $(".edit-pocket-modal, .overlay-modals").addClass("scale-in");
    return context
    });

$(document).on("click", ".ok-edit-pocket", function(event){
    pocket.edit(context);
});

//Deposit to Pocket
$(document).on("click", ".deposit-pocket", function(event){
    var clickTarget = event.target;
    context = $(clickTarget).closest(".pocket-item").attr("id");
    var id = context.replace("pocket-", ""),
    editable = data[id];
    console.log("deposito");

    $(".deposit-pocket-modal span.pocket-name").html(editable.name);
    $("#pocket-form-deposit span.pocket-balance").html(editable.balance);
    
    $(".deposit-pocket-modal, .overlay-modals").addClass("scale-in");
    return context
    });

$(document).on("click", ".ok-deposit-pocket", function(event){
    pocket.deposit(context);
});

//Withdraw from Pocket
$(document).on("click", ".withdraw-pocket", function(event){
    var clickTarget = event.target;
    context = $(clickTarget).closest(".pocket-item").attr("id");
    var id = context.replace("pocket-", ""),
    editable = data[id];
    console.log("retiro");

    $(".withdraw-pocket-modal span.pocket-name").html(editable.name);
    $("#pocket-form-withdraw span.pocket-balance").html(editable.balance);
    
    $(".withdraw-pocket-modal, .overlay-modals").addClass("scale-in");
    return context
    });

$(document).on("click", ".ok-withdraw-pocket", function(event){
    pocket.withdraw(context);
});

//Program or edit programming of Pocket
$(document).on("click", ".program-pocket", function(event){
    var clickTarget = event.target;
    context = $(clickTarget).closest(".pocket-item").attr("id");
    var id = context.replace("pocket-", ""),
    editable = data[id];
    console.log("programacion");

    $(".program-pocket-modal span.pocket-name").html(editable.name);
    
    $(".program-pocket-modal, .overlay-modals").addClass("scale-in");
    return context
    });

$(document).on("click", ".ok-program-pocket", function(event){
    pocket.program(context);
});

//Cancel Operation
$(document).on("click", ".cancel-operation", function(event){
    $(".pocket-container.scale-in, .overlay-modals.scale-in").removeClass("scale-in");
    $(".pocket-container.scale-in input[type='text']:not(.selected-account)").val("");
    $(".pocket-container.scale-in input[type='checkbox']").prop("checked", false);
});

//Funciones OnChange para los inputs----------------------------------

$(document).on("change", ".scale-in input[type='radio'].program", function(){
    var selected = $(".scale-in input[type='radio'].program:checked");
    if(selected.val() == "0"){
        $(".scale-in input.prog-amount").val("").prop("disabled", true);
    } else {
        $(".scale-in input.prog-amount").val("").prop("disabled", false);
    }
});

$(document).on("change", ".scale-in input[type='radio'].money", function(){
    var selected = $(".scale-in input[type='radio'].money:checked");
    if(selected.val() == "0"){
        $(".scale-in input.pocket-balance").val("").prop("disabled", true);
    } else {
        $(".scale-in input.pocket-balance").val("").prop("disabled", false);
    }
});
