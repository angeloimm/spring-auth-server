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
			{"data" : "email", "targets":2, "sortable" : false,"render":function(data,type, row){
				return data.toLowerCase();
			}},
			{"data" : "azioni"   , "targets":3, "sortable" : false,"render":function(data,type, row){
			    var mioNome = "Angelo";
			    var obj = {};
			    obj.nome = mioNome;
				return templateAzioniUtente(obj);
			}}
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
		var theHtml = templateDettaglioUtente(data);
        alert(theHtml);
    } );
})