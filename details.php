<?php
include_once 'include/header.php';
include_once 'include/nav.php';
?>

    <!-- Page Content -->
    <div class="container">
<div style="margin-top:48px;" class="notifications top-right"></div>
        <!-- Portfolio Item Heading -->
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-header">Details of a Proof-of-Existence
                    <small><?php echo $_GET['signature']; ?></small>
                </h1>

                <h3 class="page-header">Arranged in chronological order (Most recent first).
                </h1>
            </div>
        </div>
        <!-- /.row -->
<script>
            var signature = "<?php echo $_GET['signature']; ?>";
            
            console.log("Signature is:", signature);
  $.ajax({
   type: "POST",
   url: 'poe-api/api/verify.php',
   data:{ signature : signature },
   success:function(Response) {   
           
            var x = Response;
            x = JSON.parse(x);
            console.log("publish response here", x);

            var result = x.result;
            var data = result.reverse();

            sign = signature;
            table_data = data;
            console.log("result2:", table_data);


            Object.keys(table_data).forEach(function (k){

                    var signature = sign;
                    var blocktime = table_data[k].blocktime;
                    var confirmations = table_data[k].confirmations;
                    var tx_id = table_data[k].txid;
                    var timestamp = table_data[k].blocktime;
                    var dataHex = table_data[k].data;
                    var converted_data = hex2a(dataHex);
                    var final_output = JSON.parse(converted_data);

                    var name = final_output.name;
                    var message = final_output.message;
                    var email = final_output.email;
                    //console.log(name);

                    //var name = converted_data.message;
                    //console.log(name);

                    var date = new Date(timestamp*1000);

                    var year = date.getUTCFullYear();
                    var month = date.getUTCMonth() + 1;
                    var day = date.getUTCDate();
                    var hours = date.getUTCHours();
                    var minutes = date.getUTCMinutes();
                    var seconds = date.getUTCSeconds();
                  
                  



                   $('#received_data').append(
                    '<table class="table table-striped table-hover"><thead><tr><th> Data </th><th> Value</th></tr></thead></table>');

                    
                    
                    //$('#received_data').append('<table class="table table-striped table-hover"><tr><td>' + key+ '</td><td>' + table_data[k][key]+ '</td></tr></table>');
                    $('#received_data').append("<table class='table table-striped table-hover'><tr><td> Signature  </td> <td  >"+   signature   +"</td></tr><tr><td> Transaction_id  </td> <td  >"+   tx_id   +"</td></tr><tr><td> Blocktime </td><td>"+   blocktime   +"</td></tr><tr><td>  Confirmations   </td  ><td>"+   confirmations   +"</td></tr><tr><td>  Name   </td  ><td>"+   name   +"</td></tr><tr><td>  Email   </td  ><td>"+   email   +"</td></tr><tr><td>  Message   </td  ><td>"+   message   +"</td></tr><tr><td> Time </td><td>"+year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds+ " " + "(UTC TIME)"+ "</td></tr></table>");

      
            
                });


                }    
  
            });
            

            // recordData() function here that converts any string toHex
            // Params : null 
            // return : none
              function hex2a(hexx) {
                    var hex = hexx.toString();//force conversion
                    var str = '';
                    for (var i = 0; i < hex.length; i += 2)
                        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                    return str;
                  } 

            
            //Global variables
            var table_data;
            var sign;

             </script>   
        <!-- Portfolio Item Row -->
        <div class="row">
        
            <div class="col-md-12">
            <div id="received_data"></div>
             

                </div>

        </div>
        <!-- /.row -->


<?php
include_once 'include/footer.php';
?>        