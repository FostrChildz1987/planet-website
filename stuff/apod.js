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
        // Max/Min Dates
        const minDate = new Date("1995-06-20");
        
        const now = new Date();
        const today = getDateString(now);
        console.log(today);
        const maxDate = new Date(today);
        console.log(maxDate);

        // get dates from textboxes
        const startEntry = $("#startDate").val();
        const endEntry = $("#endDate").val();
        if(startEntry.match(validatePattern) == null){
            $("#processing").text("Please Enter a Valid Start Date! YYYY-MM-DD Format");
            alert("Please Enter a Valid Start Date! YYYY-MM-DD Format");
        } else if(endEntry.match(validatePattern) == null){
            $("#processing").text("Please Enter a Valid Start Date! YYYY-MM-DD Format");
            alert("Please Enter a Valid Start Date! YYYY-MM-DD Format");
        } else{
            let startObj = new Date(startEntry);
            let endObj = new Date(endEntry);
            console.log(startObj);
            console.log(endObj);

            // Data Validation
            if (startObj == "Invalid Date") {
                $("#processing").text("Please Enter a Valid Start Date! YYYY-MM-DD Format");
                alert("Please Enter a Valid Start Date! YYYY-MM-DD Format");
            } else if (endObj == "Invalid Date") {
                $("#processing").text("Please Enter a Valid End Date! YYYY-MM-DD Format");
                alert("Please Enter a Valid End Date! YYYY-MM-DD Format");
            }
            else if (startObj < minDate) {
                $("#processing").text("Start date must be at least 1995-06-21 or greater!");
                alert("Start date must be at least 1995-06-21 or greater!");
            }
            else if (endObj > maxDate) {
                $("#processing").text("End date must be " + getDateString(maxDate)+ " or less!");
                alert("End date must be at least " + getDateString(maxDate)+ " or less!");
            }
            else if (startObj > endObj) {
                $("#processing").text("Start date must be less than end date!");
                alert("Start date must be less than end date!");
            }
            else{
                const startDate = getDateString(startObj);
                const endDate = getDateString(endObj);
                console.log(startDate);
                // Concat URL
                const site = `https://api.nasa.gov/planetary/apod`;
                const query = `?api_key=r0ZC63KuaQedbOpmO3cessR7qdxFuUrJPfBrEJrc&start_date=${startDate}&end_date=${endDate}`;
                const url = site + query;
                console.log(url);

                const width = 500;
                
                // AJAX request
                fetch(url)
                    .then( response => response.json())
                    .then( json => {
                        json.forEach(data => {
                            if(data.error) {       // error – display message
                                $("#processing").text(data.error.message);
                            }
                            else if (data.code) {  // problem – display message
                                $("#processing").text(data.msg);
                            };
                            let image = '<li class="spacepic"><a href="' + data.hdurl+ '" data-lightbox="vecta" data-title="' + data.date + ' - ' + data.explanation +'"><img src="' + data.hdurl + '" style="border:10px solid rgb(73, 73, 73);max-height:600px" alt="NASA Photo" width=' + width + '></a></li>';
                            console.log(image);
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