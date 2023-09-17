var templateAddClient = Handlebars.compile($('#templateAddClient').html());
//When HTML is loaded i add some expression.
$(function(){
    initialize();
});
function initialize(){
    let update = $("#update").val();
    var obj = {};
    obj.modalTitle="Create new client";
    if(update){
        var obj = {};
        obj.modalTitle="Edit";
        //After preparation i show the modal
    }
     $("#clientDetailModal").html(templateAddClient(obj));
     $("#clientDetailsModal").modal('show');
}