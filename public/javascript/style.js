


// /* must apply only after HTML has loaded */
// $(document).ready(function () {
//     $("#contact_form").on("submit", function(e) {
//         var postData = $(this).serializeArray();
//         var formURL = $(this).attr("action");
//         $.ajax({
//             url: formURL,
//             type: "POST",
//             data: postData,
//             success: function(data, textStatus, jqXHR) {
//                 // $('#myModal .modal-header .modal-title').html("Result");
//                 // $('#myModal .modal-body').html(data);
//                 $("#submitForm").remove();
//             },
//             error: function(jqXHR, status, error) {
//                 console.log(status + ": " + error);
//             }
//         });
//         e.preventDefault();
//     });
     
//     $("#submitForm").on('click', function() {
//         $("#contact_form").submit();
//     });
// });


console.log($('#commentEdit').data('action'))

$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
 // Extract info from data-* attributes
  var action = button.data('action')
  var label = button.data('label1')
  console.log(label)
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  //$('#myform').attr('action', action)
  var modal = $(this)
  modal.find('.modal-body label').text(label)
  modal.find('.modal-title').text('Edit whatever')
});
