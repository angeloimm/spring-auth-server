var templateAddUser = Handlebars.compile($('#templateAddUser').html());
//When HTML is loaded i add some expression.
$(function(){
    checkIfCreateAdmin();
});
function checkIfCreateAdmin(){
    let createDefaultUser = $("#createDefaultUser").val();
    if(createDefaultUser){
        var obj = {};
        obj.modalTitle="Salva modifica";
        //After preparation i show the modal
        $("#authnServerModal").html(templateAddUser(obj));
        $("#authServerModal").modal('show');
    }
}