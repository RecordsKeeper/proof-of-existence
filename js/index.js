'use strict';

var translate = function(x) {
  return x;
};
var show_message = function(message, type) {
  if (!type) {
    type = 'success';
  }
  $('.top-right').notify({
    'type': type,
    message: {
      'text': message
    },
    fadeOut: {
      enabled: true,
      delay: 5000
    }
  }).show();
};

$(document).ready(function() {
  var bar = $('.progress-bar');
  var upload_submit = $('#upload_submit');
  var upload_form = $('#upload_form');
  var recently_published = $('#recently_published');
  var recently_verified = $('#recently_verified');
  var explain = $('#explain');
  var dropbox = $('.dropbox');

  // uncomment this to try non-HTML support:
  //window.File = window.FileReader = window.FileList = window.Blob = null;

  var html5 = window.File && window.FileReader && window.FileList && window.Blob;
  $('#wait').hide();

  var handleFileSelect = function(f) {
    if (!html5) {
      return;
    }
    explain.html(translate('Loading document...'));
    var output = '';
    output = translate('Preparing to hash ') + escape(f.name) + ' (' + (f.type || translate('n/a')) + ') - ' + f.size + translate(' bytes, last modified: ') + (f.lastModifiedDate ? f.lastModifiedDate
      .toLocaleDateString() : translate('n/a')) + '';

    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      bar.width(0 + '%');
      bar.addClass('bar-success');
      explain.html(translate('Now hashing... ') + translate('Initializing'));
      setTimeout(function() {
        CryptoJS.SHA256(data, crypto_callback, crypto_finish);
      }, 200);

    };
    reader.onprogress = function(evt) {
      if (evt.lengthComputable) {
        var w = (((evt.loaded / evt.total) * 100).toFixed(2));
        bar.width(w + '%');
      }
    };
    reader.readAsBinaryString(f);
    //show_message(output, 'info');
  };
  if (!html5) {
    explain.html(translate('disclaimer'));
    upload_form.show();
  } else {
    dropbox.show();
    dropbox.filedrop({
      callback: handleFileSelect
    });
    dropbox.click(function() {
      $('#file').click();
    });
  }

  // latest documents
  var refreshLatest = function(type, count, table) {
    $.getJSON('./api/v1/latest/' + type + "/" + count, function(data) {
      var items = [];

      items.push(
        '<thead><tr><th></th><th>' +
        translate('Document Digest') +
        '</th><th>' +
        translate('Timestamp') +
        '</th></tr></thead>');
      $.each(data, function(index, obj) {
        var badge = '';
        if (obj.confirmations > 0) {
          badge = '<span class="label label-success">✔</span>';
        }
        items.push('<tr><td>' + badge + '</td><td><a href="./details.php?signature=' + obj.signature +
          '" target="_blank">' + obj.signature +
          '</a></td><td> ' + obj.blocktime + '</td></tr>');
      });

      table.empty();
      $('<div/>', {
        'class': 'table',
        html: items.join('<br />')
      }).appendTo(table);
    });
  };
  
  refreshLatest("published", 5,recently_published);

  

  var crypto_callback = function(p) {
    var w = ((p * 100).toFixed(0));
    bar.width(w + '%');
    explain.html(translate('Now hashing... ') + (w) + '%');
  };

  var crypto_finish = function(hash) {
    bar.width(100 + '%');
    explain.html(translate('Document hash: ') + hash);
    $('#signature').val(hash);
    console.log("hash loaded: "+hash);
    //$.post('./api/v1/register/' + hash, onRegisterSuccess);
  };

 $( "#upload_form" ).submit(function( event ) {
  //alert( "Handler for .submit() called." );
  event.preventDefault();
  var name = $('#name').val();
  var email = $('#email').val();
  var message = $('#message').val();
  var signature = $('#signature').val();
  //console.log(name,email,message,signature);




 
  $.ajax({
   type: "POST",
   url: 'poe-api/api/publish.php',
   data:{name: name, email : email , message: message, signature : signature},
   success:function(Response) {   
           
            var x = Response;
            x = JSON.parse(x);
            //console.log("publish response here", x);

            var tx_id = x.result;
            $('#wait').remove();
            

            transaction_id = tx_id;
            //console.log("Transaction id:",transaction_id);
            $.ajax({
            type: "POST",
            url: 'poe-api/api/listwallettransactions.php',
            data:{ tx_id : transaction_id },
            success:function(Response) {   
           
                    console.log("list: ", transaction_id);
                    var y = Response;
                    y = JSON.parse(y);

                    $('#description_container').append("<h2>Success</h2>");

                    var result = y.result;
                    console.log("result:", result);
                    var blocktime = result.blocktime;
                    var blockhash = result.blockhash;
                    var confirmations = result.confirmations;
                    var tx_id = result.txid;
                    var timestamp = result.time;

                    var date = new Date(timestamp*1000);

                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
            

            


                    $('#description_container').append("<table class='table table-striped table-hover'><tr><th>Data </th><th> Value</th></tr><tr><td> Name  </td> <td  >"+   name   +"</td></tr><tr><td>Email  </td> <td  >"+   email   +"</td></tr><tr><td> Message  </td> <td  >"+   message  +"</td></tr><tr><td> Signature  </td> <td  >"+   signature   +"</td></tr><tr><td>Blocktime  </td> <td  >"+   blocktime   +"</td></tr><tr><td> Blockhash </td><td>"+   blockhash   +"</td></tr><tr><td>  Confirmations   </td  ><td>"+   confirmations   +"</td></tr><tr><td> Transaction Id    </td  ><td>"+   tx_id   +"</td></tr><tr><td> Time </td><td>"+year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds+ " " + "(UTC TIME)"+ "</td></tr></table>");

      
            


                }
            });
            


         }
      });
 

  


 $( "#upload_form" ).trigger('reset');
 explain.html(translate(''));
 bar.width('0%');

 $('#description').remove();
 $('#description_container').append('<div id="wait"><h2> Generating PoE... Please wait...</h2><br/><img src="img/gears.gif"/></div>');
  
});
 
  document.getElementById('file').addEventListener('change', function(evt) {
    var f = evt.target.files[0];
    handleFileSelect(f);
  }, false);

  // upload form (for non-html5 clients)
  upload_submit.click(function() {
    upload_form.ajaxForm({
      dataType: 'json',
      beforeSubmit: function() {
        var percentVal = '0%';
        bar.removeClass('bar-danger');
        bar.removeClass('bar-warning');
        bar.removeClass('bar-success');
        bar.addClass('bar-info');
        bar.width(percentVal);
      },
      uploadProgress: function(event, position, total, percentComplete) {
        var percentVal = percentComplete + '%';
        bar.width(percentVal);
      },
      success: onRegisterSuccess
    });

  });
});





var transaction_id;


