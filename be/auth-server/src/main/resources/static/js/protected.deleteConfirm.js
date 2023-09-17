var templateConfirm = Handlebars.compile($('#templateConfirm').html());
//When HTML is loaded i add some expression.
$(function(){
    initialize();
});
function initialize(){
     var obj = {};
     $("#confirmDeleteModal").html(templateConfirm(obj));
     $("#confirmDelete").modal('show');
}