"use strict";

// returns date string in YYYY-MM-DD format
const getDateString = date => 
    `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;

const displayError = error => {
    $("#processing").text(error.message);
};

const validatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;

$(document).ready( () => {
    $(".photo-credits").hide();
    $(".jcarousel-control-prev").hide();
    $(".jcarousel-control-next").hide();
    
    $("#submit").click( () => {
        $("#processing").text("Processing Request...");
        
        // get date from textboxes
        const dateEntry = $("#date").val();
        if(dateEntry.match(validatePattern) == null){
            $("#processing").text("Please Enter a Valid Start Date! YYYY-MM-DD Format");
            alert("Please Enter a Valid Start Date! YYYY-MM-DD Format");
        } else{
            const dateObj = new Date(dateEntry);

            const rover = $("#rover").val();
            const cam = $("#cam").val();

            // Data Validation
            if (dateObj == "Invalid Date") {
                $("#processing").text("Please Enter a Valid Date! YYYY-MM-DD Format");
                alert("Please Enter a Valid Date! YYYY-MM-DD Format");
            }
            else{
                const dateStr = getDateString(dateObj);
                console.log(dateStr);
                // Concat URL
                const site = `https://api.nasa.gov/mars-photos/api/v1/rovers/`;
                const query = `${rover}/photos?api_key=r0ZC63KuaQedbOpmO3cessR7qdxFuUrJPfBrEJrc&earth_date=${dateStr}`;
                let camquery = `&camera=${cam}`
                if(cam == "all"){
                    camquery = "";
                }
                const url = site + query + camquery;
                console.log(url);

                const width = 500;
                let counter = 0;
                
                // AJAX request
                fetch(url)
                    .then( response => response.json())
                    .then( json => {
                        if(json.photos.length == 0){
                            $("#processing").text("No data available for " + dateStr);
                        } else{
                            json.photos.slice(0,300).forEach(data => {
                                let image = '<li class="spacepic"><a href="' + data.img_src+ '" data-lightbox="vecta" data-title="' + data.earth_date + '"><img src="' + data.img_src + '" style="border:10px solid rgb(73, 73, 73)" alt="NASA Photo" width=' + width + '></a></li>';
                                counter ++;
                                console.log(counter);
                                $('#JClist ul').append(image); 
                            
                                (function($) {
                                    $(function() {
                                        $('.jcarousel').jcarousel();
                                
                                        $('.jcarousel-control-prev')
                                            .on('jcarouselcontrol:active', function() {
                                                $(this).removeClass('inactive');
                                            })
                                            .on('jcarouselcontrol:inactive', function() {
                                                $(this).addClass('inactive');
                                            })
                                            .jcarouselControl({
                                                target: '-=1'
                                            });
                                
                                        $('.jcarousel-control-next')
                                            .on('jcarouselcontrol:active', function() {
                                                $(this).removeClass('inactive');
                                            })
                                            .on('jcarouselcontrol:inactive', function() {
                                                $(this).addClass('inactive');
                                            })
                                            .jcarouselControl({
                                                target: '+=1'
                                            });
                                    });
                                })(jQuery);
                                $(".photo-credits").show();
                                $(".jcarousel-control-prev").show();
                                $(".jcarousel-control-next").show();
                                $("#processing").text("Request Complete!");
                            });
                        };
                })
                .catch(e => displayError(e));
            };
        };
    });
    $("#clear").click( () => {
        $(".spacepic").remove();
        $(".photo-credits").hide();
        $(".jcarousel-control-prev").hide();
        $(".jcarousel-control-next").hide();
    });
});