function event_finder(xml_doc)
{
  $("#wait").hide();
  $("#temp-title").hide();
  //var params = new window.URLSearchParams(window.location.search);
  var sort;
  $('input[type="submit"]').click(function (e) 
  {
    if (e.target) 
    {
      sort = e.target.id;
      $("#temp-title").hide();
    }
  });
  $('input[type="image"]').click(function (e) 
  {
    if (e.target) 
    {
      sort = e.target.id;
      $("#temp-title").hide();
    }
  });
  $(".blue-background #button_asc_date, .blue-background #button_desc_date, .blue-background #button_desc_distance, .blue-background #button_asc_distance, .blue-background #submit1").bind("click", function( event ) 
  { 
    // $('input[type="submit"]').click(function (e) 
    // {
    // });
  // $("#submit1").click(function( event ) { 
  var count = null;
  $("#error, #temp, .prev, .next").empty();
  getGPSDistance = function(lat1, lon1, lat2, lon2, km) 
  {
    var R = !!km ? 6371 : 3959; // radius of earth in km or mi
    var pi180 = Math.PI / 180;
    var dLat = (lat2-lat1) * pi180;
    var dLon = (lon2-lon1) * pi180;
    var lat1 = lat1 * pi180;
    var lat2 = lat2 * pi180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  };
  var event_array = [];
  $.ajax({
    type: "GET" ,
    url: xml_doc ,
    dataType: "xml" ,
    beforeSend: function () {},
    success: function(xml) 
    {
      $("#wait").show();
      var xmlhttp = new XMLHttpRequest();
      var zipcodes = null;
      xmlhttp.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) 
        {
          zipcodes = this.responseText;
          pass_zipcodes(zipcodes);
        }
      };
      xmlhttp.open("GET", "zipcodes.json", true);
      xmlhttp.send();
      function pass_zipcodes()
      {
        //console.log(zipcodes);
        var zipcode_list = zipcodes;
        $(xml).find('event').each(function() 
        {
          var zip1 = $("#zipcode1").val();
          var zip_regex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
          var zip2 = $(this).find('zipcode').text();
          var lat1;
          var lon1;
          var lat2;
          var lon2;
          var store_id = $(this).find('store_id').text();
          var plan_url = $(this).find('plan_url').text();
          var address = $(this).find('address').text();
          var city = $(this).find('city').text();
          var state = $(this).find('state').text();
          var event_date = $(this).find('event_date').text();
          var event_time = $(this).find('event_time').text();
          var event_type = $(this).find('event_type').text();
          var event_description = $(this).find('event_description').text();
          var miles = 20;
          //$("#imgSpinner1").show();{
          var myArr = JSON.parse(zipcode_list);
          //console.log(zipcode_list);
          //console.log("Entered Zipcode: "+myArr[0]["Zipcode"]);
          var i;
          var n = $(myArr).length;
          var lookupzip1 = myArr.filter(function( item ) 
          {
            return item.Zipcode == zip1;
          });
          if(lookupzip1=="")
          {
            $("#error").append("<p>Please enter a valid zipcode</p>");
            $("#wait").hide();
            $("#temp-title").hide();
          }
          var zipcode1 = lookupzip1[0]['Zipcode'];
          var latitude = lookupzip1[0]['Lat'];
          var longitude = lookupzip1[0]['Long'];
          //console.log(lookupzip1[0]['Zipcode1']);
          var lookupzip2 = myArr.filter(function( item ) 
          {
            return item.Zipcode == zip2;
            //console.log(item);
          });
          var zipcode2 = lookupzip2[0]['Zipcode'];
          var latitude2 = lookupzip2[0]['Lat'];
          var longitude2 = lookupzip2[0]['Long'];
          //console.log(lookupzip2[0]['Zipcode1']);
          var distance = getGPSDistance(latitude, longitude, latitude2 , longitude2);
          var d1 = new Date(event_date);
          var d2 = new Date();
          //var strDate = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
          //var d3 = new Date(strDate);
          // console.log(d2);
          if(distance <= miles && d1 >= d2)
          {
            event_array.push({"event_date":event_date, "event_time":event_time,"event_type":event_type, "event_description":event_description, "distance":distance, "address":address, "city":city, "state":state, "zip2":zip2, "plan_url":plan_url, "store_id":store_id});
            count = count + 1;
            // $("#temp-title").show();
            // $("#temp").append('<li class="line-content"><div class="line-content-date" style="float: left; width: 30%;"><div>'+event_date+'<br>'+event_time+'</div></div><div class="line-content-distance" style="float: left; width: 30%;"><div>'+distance.toFixed(2)+'</div></div><div class="line-content-address" style="float: left; width: 30%; padding-bottom: 20px;"><div>'+address+'<br>'+city+','+state+' '+zip2+'<br><a href="https://www.cvs.com/store-locator/details-directions/'+store_id+'" class="caret-white-hlightgray-14">Store Details</a></div></div></li>');
            // $("#temp").append('<div class="line-content-address" style="float: left; width: 50%; padding-bottom: 20px;"><div>'+address+'<br>'+city+','+state+' '+zip2+'<br><a href="https://www.cvs.com/store-locator/details-directions/'+store_id+'">Store Details</a></div></div></li>');
            console.log("Distance: "+event_array[count-1]);
            console.log("Zipcode found: "+zipcode1);
            console.log("Latitude found: "+latitude);
            console.log("Longitude found: "+longitude);
            console.log("Zipcode2 found: "+zipcode2);
            console.log("Latitude2 found: "+latitude2);
            console.log("Longitude2 found: "+longitude2);
            console.log("Count: "+count);
            $("#pagin").show();
          }
          console.log("Count: "+count);
          //console.log("Count: "+count);
          $("#wait").hide();
        })
        console.log(sort);
        if(sort=="button_asc_distance"||sort=="submit1")
        {
          var sorted_array = _.sortBy( event_array, 'distance' );
          $("#button_asc_date").show();
          $("#button_desc_date").show();
          $("#button_asc_distance").hide();
          $("#button_desc_distance").show();
        }
        else if(sort=="button_desc_distance")
        {
          var sorted_array = _.sortBy( event_array, 'distance' ).reverse();
          $("#button_asc_date").show();
          $("#button_desc_date").show();
          $("#button_asc_distance").show();
          $("#button_desc_distance").hide();
        }
        else if(sort=="button_asc_date")
        {
          var sorted_array = _.sortBy( event_array, 'date' );
          $("#button_asc_date").hide();
          $("#button_desc_date").show();
          $("#button_asc_distance").show();
          $("#button_desc_distance").show();
        }
        else if(sort=="button_desc_date")
        {
          var sorted_array = _.sortBy( event_array, 'date' ).reverse();
          $("#button_asc_date").show();
          $("#button_desc_date").hide();
          $("#button_asc_distance").show();
          $("#button_desc_distance").show();
        }
        $.each(sorted_array, function(i) 
        {
          $("#temp-title").show();
          $("#temp").append('<li class="line-content"><div class="line-content-date col-xs-12 col-sm-6"><div>'+sorted_array[i]['event_date']+'<br>'+sorted_array[i]['event_time']+'</div></div><div class="line-content-description col-xs-12 col-sm-6"><div><span class="promoBold margin-none">'+sorted_array[i]['event_type']+'</span><br>'+sorted_array[i]['event_description']+'</div></div><div class="line-content-distance col-xs-12 col-sm-6"><div>'+sorted_array[i]['distance'].toFixed(2)+'</div></div><div class="line-content-address col-xs-12 col-sm-6"><div>'+sorted_array[i]['address']+'<br>'+sorted_array[i]['city']+','+sorted_array[i]['state']+' '+sorted_array[i]['zip2']+'<br><a href="https://www.cvs.com/store-locator/details-directions/'+sorted_array[i]['store_id']+'" class="caret-black-14">Store locator</a><br><a href="'+sorted_array[i]['plan_url']+'" class="caret-black-14">Book now</a></div></div></li>');
          console.log("Distance2: "+sorted_array[i]['event_date']);
          console.log("Count2: "+i);
        });
        if(count == null)
        {
          $("#error").append("<p>There were no events found in your area</p>");
          $("#temp-title").hide();
          $(".prev").hide();
          $(".next").hide();
        }
        showPage = function(page) 
        {
          $(".line-content").hide();
          $(".line-content").each(function(n) 
          {
            if (n >= pageSize * (page - 1) && n < pageSize * page)
            $(this).show();
          });
        }
        //Pagination
        pageSize = 5;
        $(function() 
        {
          function check_navigation_display(el) 
          {
            //accepts a jQuery object of the containing div as a parameter
            if ($(el).find('ul').children('li').first().is(':visible')) 
            {
              $(el).children('.prev').hide();
            } 
            else 
            {
              $(el).children('.prev').show();
            }
            if ($(el).find('ul').children('li').last().is(':visible')) 
            {
              $(el).children('.next').hide();
            }
            else 
            {
              $(el).children('.next').show();
            }    
          }
          $('#events').each(function () 
          {
            $(this).append('<a class="prev promoTextblack fontsize16">prev</a> <a class="next promoTextblack fontsize16">next</a>');
            $(this).find('ul li:gt(4)').hide();
            check_navigation_display($(this));
            $(this).find('.next').click(function () 
            {
              var last = $(this).siblings('ul').children('li:visible:last');
              last.nextAll(':lt(5)').show();
              last.next().prevAll().hide();
              check_navigation_display($(this).closest('div'));
            });
            $(this).find('.prev').click(function () 
            {
              var first = $(this).siblings('ul').children('li:visible:first');
              first.prevAll(':lt(5)').show();
              first.prev().nextAll().hide()
              check_navigation_display($(this).closest('div'));
            });
          });
        })
      }
    },
    complete: function () {  },
  });
});
}