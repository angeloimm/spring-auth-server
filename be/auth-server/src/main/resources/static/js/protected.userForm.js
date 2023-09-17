var templateAddUser = Handlebars.compile($('#templateAddUser').html());
//When HTML is loaded i add some expression.
$(function(){
    initialize();
});
function initialize(){
    let update = $("#update").val();
    var obj = {};
    obj.modalTitle="Edit user";
    if(update){
        var obj = {};
        obj.modalTitle="Create new user";
        //After preparation i show the modal
    }
     $("#userDetailModal").html(templateAddUser(obj));
     $("#userDetailsModal").modal('show');
}