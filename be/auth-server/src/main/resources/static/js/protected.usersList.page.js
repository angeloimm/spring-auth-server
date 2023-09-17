var templateDettaglioUtente = Handlebars.compile($('#templateDettaglioUtente').html());
var templateAzioniUtente = Handlebars.compile($('#templateAzioniUtente').html());
var userList = null;
$(function(){
userList = $("#userListTable").DataTable({
		"responsive": true,
		"searching": true,
		"ordering" : true,
		"lengthChange": true,
		"serverSide": true,
		"processing" : true,
		"pagingType": "full_numbers",
		"mark"      : true,
		"language" : {
			"url" : $("#userListTable").data("table-lang-url")
		},
		"deferRender" : true,
		"drawCallback": function( settings ) {
			//initTooltip();
			$('[data-toggle="tooltip"]').tooltip()
		},
		"columnDefs": [
			{"data" : "name", "targets":0, "sortable" : true},

			{"data" : "lastName", "targets":1, "sortable" : true,"render":function(data,type, row){
				return data.toLowerCase();
			}},
  		   {"data" : "username", "targets": 2, "sortable" : false,"render":function(data,type, row){
  				return data.toLowerCase();
  			}},
			{"data" : "email", "targets": 3, "sortable" : false,"render":function(data,type, row){
				return data.toLowerCase();
			}},
			{"data" : "azioni", "targets":4, "sortable" : false,"render":function(data,type, row){
				return templateAzioniUtente();
			}},
			{"data" : "id", "targets":5, "sortable" : true, "visible": false}
		],
		"ajax": {
			"dataSrc" : "payload",
			"url": $("#userListTable").data("user-list-url"),
			"contentType" : "application/json; charset=utf-8"
		}
	});
$('#userListTable tbody').on( 'click', 'tr td .modify', function () {
        let tr = $(this).closest('tr');
        let row = userList.row( tr );
		let data = row.data();
       // Make an AJAX request to fetch the modal content
           $.ajax({
               url: "/auth-server/protected/users/" + data.id,
               type: "GET",
               dataType: "html",
               success: function (response) {
                 // Show the modal with the fetched content
                  $('#userDetailModal.modal-content').html(response);
                  $('#userDetailsModal').modal('show');
               },
               error: function (error) {
                   console.error("Error fetching modal content:", error);
               }
           });
    });

$('#userListTable tbody').on( 'click', 'tr td .delete', function () {
        let tr = $(this).closest('tr');
        let id = tr.data('id');
        let row = userList.row(tr);
        let data = row.data();
        // Show the confirmation dialog
        // open the delete page
        $.ajax({
            url: '/auth-server/protected/users/delete',
            type: "GET",
            dataType: "html",
            success: function (response) {
                $('#confirmDeleteModal.modal-content').html(response);
                $('#confirmDelete').modal('show');
            },
            error: function (error) {
                console.error("Error fetching delete confirmation content:", error);
            }
        });
        // Handle the "Yes" button click in the confirmation modal
        $(document).one("click", "#confirmModifyYes", function () {
             $.ajax({
                 url: '/auth-server/protected/users/delete/' + data.id,
                 type: "GET",
                 dataType: "html",
                 success: function (response) {
                    // Close the modal
                     window.location.reload();
                 },
                 error: function (error) {
                 }
             });
        });
        // Handle the "No" button click in the confirmation modal
        $(document).one("click", "#confirmModifyNo", function () {
            // Close the modal when the user clicks "No"
            $("#confirmDelete").modal('hide');
        });
    });
$('#userListTable tbody').on('click', 'tr td .disable', function () {
        let tr = $(this).closest('tr');
        let row = userList.row(tr);
        let data = row.data();
        let id = data.id; // Access the correct id from the data object
             $.ajax({
                 url: '/auth-server/protected/users/disable/' + data.id,
                 type: "GET",
                 dataType: "html",
                 success: function (response) {
                    // Close the modal
                     window.location.reload();
                 },
                 error: function (error) {
                 }
        });
   });
$('#add').on('click', function () {
        $.ajax({
            url: '/auth-server/protected/users/add',
            type: "GET",
            dataType: "html",
            success: function (response) {
                 // Show the modal with empty data
                 $('#userDetailModal.modal-content').html(response);
                 $('#userDetailsModal').modal('show');
            }
        });
   });
})