var templateDettaglioClient = Handlebars.compile($('#templateDettaglioClient').html());
var templateAzioniClient = Handlebars.compile($('#templateAzioniClient').html());
var clientList = null;
$(function(){
clientList = $("#clientListTable").DataTable({
		"responsive": true,
		"searching": true,
		"ordering" : true,
		"lengthChange": true,
		"serverSide": true,
		"processing" : true,
		"pagingType": "full_numbers",
		"mark"      : true,
		"language" : {
			"url" : $("#clientListTable").data("table-lang-url")
		},
		"deferRender" : true,
		"drawCallback": function( settings ) {
			//initTooltip();
			$('[data-toggle="tooltip"]').tooltip()
		},
		"columnDefs": [
			{"data" : "clientId", "targets":0, "sortable" : true},

			{"data" : "clientSecret", "targets":1, "sortable" : true,"render":function(data,type, row){
				return data.toLowerCase();
			}},
  		   {"data" : "clientName", "targets": 2, "sortable" : false,"render":function(data,type, row){
  				return data.toLowerCase();
  			}},
			{"data" : "applicationName", "targets": 3, "sortable" : false,"render":function(data,type, row){
				return data.toLowerCase();
			}},
			{"data" : "azioni", "targets":4, "sortable" : false,"render":function(data,type, row){
				return templateAzioniClient();
			}},
			{"data" : "id", "targets":5, "sortable" : true, "visible": false}
		],
		"ajax": {
            "dataSrc" : "payload",
            "url": $("#clientListTable").data("client-list-url"),
            "contentType" : "application/json; charset=utf-8",
            "error": function (xhr, error, thrown) {
                console.error("AJAX Error:", error);
                console.error("Thrown:", thrown);
            }
        }

	});
$('#clientListTable tbody').on( 'click', 'tr td .modify', function () {
        let tr = $(this).closest('tr');
        let row = clientList.row( tr );
		let data = row.data();
		let clientId = data.clientId;
       // Make an AJAX request to fetch the modal content
           $.ajax({
               url: "/auth-server/protected/clients/" + clientId,
               type: "GET",
               dataType: "html",
               success: function (response) {
                 // Show the modal with the fetched content
                  $('#clientDetailModal.modal-content').html(response);
                  $('#clientDetailsModal').modal('show');
               },
               error: function (error) {
                   console.error("Error fetching modal content:", error);
               }
           });
    });

$('#clientListTable tbody').on( 'click', 'tr td .delete', function () {
        let tr = $(this).closest('tr');
        let id = tr.data('id');
        let row = clientList.row(tr);
        let data = row.data();
        // Show the confirmation dialog
        // open the delete page
        $.ajax({
            url: '/auth-server/protected/clients/delete',
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
                 url: '/auth-server/protected/clients/delete/' + data.id,
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
            // Close the modal when the clients clicks "No"
            $("#confirmDelete").modal('hide');
        });
    });

$('#clientListTable tbody').on('click', 'tr td .disable', function () {
        let tr = $(this).closest('tr');
        let row = clientList.row(tr);
        let data = row.data();
        let clientId = data.clientId; // Access the correct id from the data object
             $.ajax({
                 url: '/auth-server/protected/clients/disable/' + clientId,
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
                url: '/auth-server/protected/clients/add',
                type: "GET",
                dataType: "html",
                success: function (response) {
                     // Show the modal with empty data
                     $('#clientDetailModal.modal-content').html(response);
                     $('#clientDetailsModal').modal('show');
                }
            });
       });
})