///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Handles navigation /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NAV BUTTONS
const navHome = document.getElementById("home");
const navServices = document.getElementById("service");
const navNature = document.getElementById("nature");
const navContact = document.getElementById("contact");

// SPECIFIES ELEMENTS FOR DYNAMIC CONTENT REPAINT
const pageH1 = document.getElementById("show-h1");
const pageH2 = document.getElementById("show-h2");
const pageP = document.getElementById("show-p");
const pageContent = document.getElementById("maincontent");
const headerImg = document.getElementById("header-image");
const jumbo = document.getElementById("jumbotron");

// SET INITIAL BODY
pageContent.innerHTML = document.getElementById("home-body").innerHTML;

// LOAD NEW MAP POPUPS ON INITIAL LOAD
mapInteractive();

var lastactive = navHome;

function clicked() {
    lastactive.classList.remove("active");
    this.classList.add("active");
    lastactive = this;

    // SET HEADER IMG
    headerImg.style.backgroundImage = "url(\'https://corebots.github.io/camping/img/img-header/header-" + this.id + ".jpg\')";
    pageH1.textContent = document.getElementById(this.id).textContent;
    pageH2.innerHTML = document.getElementById(this.id + "-article").innerHTML;
    pageP.innerHTML = document.getElementById(this.id + "-header-p").innerHTML;
    pageContent.innerHTML = document.getElementById(this.id + "-body").innerHTML;
    mapInteractive();
    inPageRouting();
    //console.log(this.id);

    if (this.id == "home") {
        headerImg.style.height = 100 + "%";
        $('#calendar').availabilityCalendar(unavailableDates);
        jumbo.style.display = "block";
        pageContent.classList.remove("shadow-to-menu");
        calInteractive();
        //document.getElementById("maincontent").classList.add("hidden");

    } else if (this.id == "contact") {
        document.getElementById("footer-weather").classList.add("fade-in-stuff");
        document.getElementById("footer-weather").classList.remove("hidden");
        //document.getElementById("maincontent").classList.remove("hidden");
        headerImg.style.height = 0 + "%";
        jumbo.style.display = "none";
        pageContent.classList.add("shadow-to-menu");
        console.log("adding menu shadow");
    } else {
        headerImg.style.height = 100 + "%";
        jumbo.style.display = "block";
        pageContent.classList.remove("shadow-to-menu");
        //document.getElementById("maincontent").classList.add("hidden");
    }
}

function lifted() {
    origval = this.textContent;
    this.style.transition = ".3s"
        // this.style.border = "2px solid #595959";
    this.style.backgroungColor = "#EEEEEE";
}


// ADD EVENT LISTENERS TO NAVBAR
navHome.addEventListener("click", clicked);
navServices.addEventListener("click", clicked);
navNature.addEventListener("click", clicked);
navContact.addEventListener("click", clicked);
navHome.addEventListener("mouseover", lifted);
navServices.addEventListener("mouseover", lifted);
navNature.addEventListener("mouseover", lifted);
navContact.addEventListener("mouseover", lifted);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DISPLAYS IMAGES IN LIGHTBOX LIKE OVERLAY ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var fadeHTML = function() {
    var elementos;
    var windowHeight;

    function init() {
        elementos = document.querySelectorAll(".hidden");
        windowHeight = window.innerHeight;
        addEventHandlers();
        checkPosition();
    }

    function addEventHandlers() {
        window.addEventListener("scroll", checkPosition);
        window.addEventListener("resize", init);
    }

    function checkPosition() {
        for (i = 0; i < elementos.length; i++) {
            var positionFromTop = elementos[i].getBoundingClientRect().top;
            if (positionFromTop - windowHeight <= 0) {
                elementos[i].className = elementos[i].className.replace("hidden", "fade-in-stuff");
            } else {
                elementos[i].className = elementos[i].className.replace("fade-in-stuff", "hidden");
            }
        }
    }
    return {
        init: init
    };
};
fadeHTML().init();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DISPLAYS IMAGES IN LIGHTBOX LIKE OVERLAY// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("click", imgviewClick);

// FILTERS UNWANTED CLICKS
function imgviewClick(event) {
    var elem = event.target,
        elemId = elem.getAttribute("id"),
        imgviewImg = document.getElementById("imgview-image"),
        imgview = document.getElementById("imgview-overlay"),
        imgviewDesc = document.getElementById("imgview-desc"),

        newImg = new Image();

    // SHOWS OVERLAY WHEN CLICKING ON data-imgview
    if (elem.hasAttribute("data-lightbox")) {
        event.preventDefault();

        newImg.onload = function() {
            imgviewImg.src = this.src;

            imgviewBottom = imgviewImg.getBoundingClientRect()["bottom"];
            //console.log(imgviewImg.getBoundingClientRect());
        }

        imgviewImg.src = "";
        newImg.src = elem.getAttribute("data-lightbox");
        imgviewDesc = elem.getAttribute("alt");

        newImg.addEventListener("load", function() {
            //console.log("image loaded");
            document.getElementById("imgview-desc").style.height = "75px";
            document.getElementById("imgview-desc").innerHTML = imgviewDesc;
        });

        imgview.classList.add("visible");
    }

    // CLOSE OVERLAY IF CLICKED ON OTHER ELEMENTS
    if (elemId == "imgview-image" || elemId == "imgview-overlay") {
        event.preventDefault();
        imgview.classList.remove("visible");
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CALENDAR AVAILABILITY //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

// INVOKING THE CALENDAR
$('#calendar').availabilityCalendar(unavailableDates);

// ADDS CALENDAR POPUPS
function calInteractive() {
    let fullyBooked = document.getElementsByClassName("unavailable");
    let freeToBook = document.getElementById("calendar").querySelectorAll("td:not(.unavailable):not(.ex-month)");
    const fullyBookedNotice = document.getElementById("fully_booked_notice");
    const freeToBookNotice = document.getElementById("free_to_book_notice");
    //const bookingActions = document.getElementById("booking_actions");

    // ADDS EVENT LISTENERS TO BOTH TYPES OF CELLS
    for (i = 0; i < fullyBooked.length; i++) {
        fullyBooked[i].addEventListener("click", showNotice);
        fullyBooked[i].addEventListener("mouseenter", colored);
        fullyBooked[i].addEventListener("mouseleave", hideNotice);
    }
    for (j = 0; j < freeToBook.length; j++) {
        freeToBook[j].addEventListener("click", showNotice);
        freeToBook[j].addEventListener("mouseenter", colored);
        freeToBook[j].addEventListener("mouseleave", hideNotice);
        freeToBook[j].innerHTML += '<div class=" text-left"><a href="phone:+31697456123"><i id="action-phone" class="fas fa-phone fa-2x added px-2"></i></a><br><span><i id="action-mail" class="fas fa-envelope fa-2x added px-2"></i></span></div>'
    }

    // CALCULATES POPUP POSITION AND PICKS THE RIGHT ONE TO SHOW + AVOIDS POSITIONING OUTSIDE OF WINDOW
    function showNotice(event) {
        let pos = this.getBoundingClientRect();

        //console.log("begin function position right +420: " + pos.right + 420);
        if ((event.target.classList.contains("unavailable")) || (event.target.parentNode.classList.contains("unavailable"))) {
            if ((pos.right + 440) <= window.innerWidth) {
                fullyBookedNotice.style.left = (pos.right + 20) + "px";
                fullyBookedNotice.style.top = (window.scrollY + pos.top - 2) + "px";
                fullyBookedNotice.classList.add("visible");
                console.log("innerwidth when popup normal: ", window.innerWidth);
            } else if (pos.left >= 440) {
                fullyBookedNotice.style.left = (window.innerWidth - 420) + "px";
                fullyBookedNotice.style.top = (window.scrollY + pos.bottom + 20) + "px";
                fullyBookedNotice.classList.add("visible");
                console.log("middle: ", window.innerWidth);
            } else {
                fullyBookedNotice.style.left = 0 + "px";
                fullyBookedNotice.style.width = window.innerWidth + "px";
                fullyBookedNotice.style.top = (window.scrollY + pos.bottom + 20) + "px";
                fullyBookedNotice.classList.add("visible");
                console.log("lastelse ", window.innerWidth);
            }

        } else {
            if ((pos.right + 440) <= window.innerWidth) {
                freeToBookNotice.style.left = (pos.right + 20) + "px";
                freeToBookNotice.style.top = (window.scrollY + pos.top - 2) + "px";
                freeToBookNotice.classList.add("visible");
            } else if (pos.left >= 440) {
                freeToBookNotice.style.left = (window.innerWidth - 420) + "px";
                freeToBookNotice.style.top = (window.scrollY + pos.bottom + 20) + "px";
                freeToBookNotice.classList.add("visible");
            } else {
                freeToBookNotice.style.left = 0 + "px";
                freeToBookNotice.style.width = window.innerWidth + "px";
                freeToBookNotice.style.top = (window.scrollY + pos.bottom + 20) + "px";
                freeToBookNotice.classList.add("visible");
            }
        }
    }

    // COLORS CAL CELLS ON HOVER BASED ON AVAILABILITY
    function colored(event) {
        if (event.target.classList.contains("unavailable")) {
            event.target.style.backgroundColor = "#FFEEED";
        } else {
            event.target.style.backgroundColor = "#BCDEB0";
            event.target.style.color = "#fff";
            event.target.style.fontWeight = "800";
        }
    }

    // HIDES CAL POPUPS
    function hideNotice() {
        fullyBookedNotice.classList.remove("visible");
        freeToBookNotice.classList.remove("visible");
        event.target.style.backgroundColor = "";
        event.target.style.color = "";
        event.target.style.fontWeight = "";
    }
}
calInteractive();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// INTERACTIVE SVG MAP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

function mapInteractive() {
    console.log("interactive map");
    const group_reception = document.getElementById("reception");
    const group_caravans = document.getElementById("group_caravans");
    const group_WC_solo = document.getElementById("group_WC_solo");
    const group_tents = document.getElementById("group_tents");

    const popup_reception = document.getElementById("popup_reception");
    const popup_caravans = document.getElementById("popup_caravans");
    const popup_WC_solo = document.getElementById("popup_WC_solo");
    const popup_tents = document.getElementById("popup_tents");
    let currentpop;
    let popupcount;

    // ADDS EVENT LISTENERS TO MAP SYMBOLS
    group_reception.addEventListener("mouseover", showPopup);
    group_reception.addEventListener("mouseout", hidePopup);
    group_caravans.addEventListener("mouseover", showPopup);
    group_caravans.addEventListener("mouseout", hidePopup);
    group_WC_solo.addEventListener("mouseover", showPopup);
    group_WC_solo.addEventListener("mouseout", hidePopup);
    group_tents.addEventListener("mouseover", showPopup);
    group_tents.addEventListener("mouseout", hidePopup);

    // CALCULATES POPUP POSITION AND PICKS THE RIGHT ONE BASED ON HOVERED SYMBOL + AVOIDS POSITIONING OUTSIDE OF WINDOW
    function showPopup(event) {
        // console.log(event);
        if (event.currentTarget == group_reception) {
            var receptionPos = group_reception.getBoundingClientRect();
            if ((receptionPos.right + 440) <= window.innerWidth) {
                popup_reception.style.left = (receptionPos.right + 20) + "px";
                popup_reception.style.top = (window.scrollY + receptionPos.top - 2) + "px";
                popup_reception.classList.add("visible");
                //console.log("pop ok");
                currentpop = popup_reception;
            } else if (receptionPos.left >= 440) {
                popup_reception.style.left = (window.innerWidth - 440) + "px";
                popup_reception.style.top = (window.scrollY + receptionPos.bottom + 20) + "px";
                popup_reception.classList.add("visible");
                //console.log("pop pushing left");
                currentpop = popup_reception;
            } else {
                popup_reception.style.left = 0 + "px";
                popup_reception.style.width = window.innerWidth + "px";
                popup_reception.style.top = (window.scrollY + receptionPos.bottom + 20) + "px";
                popup_reception.classList.add("visible");
                //console.log("pop middle");
                currentpop = popup_reception;
            }

        } else if (event.currentTarget == group_WC_solo) {
            var wcsoloPos = group_WC_solo.getBoundingClientRect();

            if ((wcsoloPos.right + 440) <= window.innerWidth) {
                popup_WC_solo.style.left = (wcsoloPos.right + 20) + "px";
                popup_WC_solo.style.top = (window.scrollY + wcsoloPos.top - 2) + "px";
                popup_WC_solo.classList.add("visible");
                //console.log("reception hover");
                currentpop = popup_WC_solo;
            } else if (receptionPos.left >= 440) {
                popup_WC_solo.style.left = (window.innerWidth - 440) + "px";
                popup_WC_solo.style.top = (window.scrollY + wcsoloPos.bottom + 20) + "px";
                popup_WC_solo.classList.add("visible");
                currentpop = popup_WC_solo;
            } else {
                popup_WC_solo.style.left = 0 + "px";
                popup_WC_solo.style.width = window.innerWidth + "px";
                popup_WC_solo.style.top = (window.scrollY + wcsoloPos.bottom + 20) + "px";
                popup_WC_solo.classList.add("visible");
                //console.log("pop middle");
                currentpop = popup_WC_solo;
            }

        } else if (event.currentTarget == group_caravans) {
            var caravanNode = event.target;
            caravanPos = caravanNode.getBoundingClientRect();

            if ((caravanPos.right + 440) <= window.innerWidth) {
                popup_caravans.style.left = (caravanPos.right + 20) + "px";
                popup_caravans.style.top = (window.scrollY + caravanPos.top - 2) + "px";
                popup_caravans.classList.add("visible");
                //console.log("reception hover");
                currentpop = popup_caravans;
            } else if (caravanPos.left >= 440) {
                popup_caravans.style.left = (window.innerWidth - 440) + "px";
                popup_caravans.style.top = (window.scrollY + caravanPos.bottom + 20) + "px";
                popup_caravans.classList.add("visible");
                currentpop = popup_caravans;
            } else {
                popup_caravans.style.left = 0 + "px";
                popup_caravans.style.width = window.innerWidth + "px";
                popup_caravans.style.top = (window.scrollY + caravanPos.bottom + 20) + "px";
                popup_caravans.classList.add("visible");
                //console.log("pop middle");
                currentpop = popup_caravans;
            }

        } else if (event.currentTarget == group_tents) {
            var caravanNode = event.target;
            tentPos = caravanNode.getBoundingClientRect();

            if ((tentPos.right + 440) <= window.innerWidth) {
                popup_tents.style.left = (tentPos.right + 20) + "px";
                popup_tents.style.top = (window.scrollY + tentPos.top - 2) + "px";
                popup_tents.classList.add("visible");
                //console.log("reception hover");
                currentpop = popup_tents;
            } else if (tentPos.left >= 440) {
                popup_tents.style.left = (window.innerWidth - 440) + "px";
                popup_tents.style.top = (window.scrollY + tentPos.bottom + 20) + "px";
                popup_tents.classList.add("visible");
                currentpop = popup_tents;
            } else {
                popup_tents.style.left = 0 + "px";
                popup_tents.style.width = window.innerWidth + "px";
                popup_tents.style.top = (window.scrollY + tentPos.bottom + 20) + "px";
                popup_tents.classList.add("visible");
                //console.log("pop middle");
                currentpop = popup_tents;
            }
        }
    }

    // HIDES MAP POPUPS
    function hidePopup() {
        //console.log("hide invoked " + currentpop.id);
        currentpop.classList.remove("visible");
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MODALS, CARDS AND FACTS ROUTING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function inPageRouting() {

    // ADDS EVENT LISTENERS FOR MODAL POPUP - BOOKING
    document.getElementById("toggle-modal-booking").addEventListener("click", function() {
        document.getElementById("modal-booking").classList.add("visible");
    });

    document.getElementById("toggle-modal-booking-menu").addEventListener("click", function() {
        document.getElementById("modal-booking").classList.add("visible");
    });

    // document.getElementById("action-mail").addEventListener("click", function() { 
    //     document.getElementById("modal-booking").classList.add("visible");
    //     console.log("action mail clicked");
    // });

    // ADD MODAL CLOSE BUTTON
    close = document.getElementsByClassName("close");

    for (i = 0; i < close.length; i++) {
        close[i].addEventListener("click", function() {
            document.getElementById("modal-booking").classList.remove("visible");
            document.getElementById("modal-expand").classList.remove("visible");
            document.getElementById("modal-expand-view").classList.remove("visible");
        })
    }

    // ADD EVENT LISTENERS FOR NAVIGATION - AREA CARD
    document.getElementById("card-area").addEventListener("click", function() {
        lastactive.classList.remove("active");
        navNature.classList.add("active");
        lastactive = navNature;
        headerImg.style.backgroundImage = "url(\'https://corebots.github.io/camping/img/img-header/header-home.jpg\')";
        pageH1.textContent = "Nature";
        pageH2.innerHTML = document.getElementById("nature-article").innerHTML;
        pageContent.innerHTML = document.getElementById("nature-body").innerHTML;
        window.scrollTo(0, 0);
    });

    // ADD EVENT LISTENERS FOR MODAL POPUP - EXPAND
    document.getElementById("toggle-modal-expand").addEventListener("click", function() {
        document.getElementById("modal-expand").classList.add("visible");
    })

    // ADD EVENT LISTENERS FOR MODAL POPUP - EXPAND VIEW
    document.getElementById("toggle-modal-expand-view").addEventListener("click", function() {
        document.getElementById("modal-expand-view").classList.add("visible");
    })
}

inPageRouting();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GETTING TIME & WEATHER CONDITIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var d = new Date().toLocaleTimeString("nl-NL");
document.getElementById("ctime").innerHTML = d.slice(0, d.length - 3);

// WEATHER NOW
function weatherBalloon(cityID) {
    var key = "74bc8ea4cf59c10c32136542f4a65d83";
    fetch("https://api.openweathermap.org/data/2.5/weather?id=" + cityID + "&appid=" + key)
        .then(function(resp) {
            return resp.json()
        }) // Convert data to json
        .then(function(data) {
            doWeather(data);
        })
        .catch(function() {
            // catch err
        });
}

// DRAW WEATHER CONDITION INTO DOM
function doWeather(t) {
    var celcius = Math.round(parseFloat(t.main.temp) - 273.15);
    console.log(t);
    document.getElementById("wdesc").innerHTML = t.weather[0].description;
    document.getElementById("temp").innerHTML = celcius + "&deg;";
    document.getElementById("location").innerHTML = t.name;
}

weatherBalloon(723846);

// MOVIG THE SUN AROUND AND SETTING SUNSET BG

const ONE_HOUR = 3600 * 1000 * 1000;
let thishour = d.slice(0, d.length - 6);
//let testcycle = d.slice(6);

let sunX;
let sunY;

if ((thishour > 4) & (thishour <= 8)) {
    document.getElementById("footer-sunset").style.opacity = 0.8;
    sunX = -70;
    sunY = 20;
} else if ((thishour > 8) & (thishour <= 11)) {
    document.getElementById("footer-sunset").style.opacity = 0.3;
    sunX = -50;
    sunY = 30;
} else if ((thishour > 11) & (thishour <= 15)) {
    document.getElementById("footer-sunset").style.opacity = 0;
    sunX = -30;
    sunY = 34;
} else if ((thishour > 15) & (thishour <= 18)) {
    document.getElementById("footer-sunset").style.opacity = 0.3;
    sunX = -10;
    sunY = 30;
} else if ((thishour > 18) & (thishour <= 20)) {
    document.getElementById("footer-sunset").style.opacity = 0.8;
    sunX = 10;
    sunY = 25;
} else {
    document.getElementById("footer-sunset").style.opacity = 1;
    sunX = 20;
    sunY = 10;
}

const sun = document.getElementById("footer-sun");
sun.style.left = 4 + "vw";
sun.style.bottom = "calc(" + 220 + "px + " + sunY + "vh)";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TBD ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NIGHT MODE SWITCH 

// document.getElementById("sun").addEventListener("click", console.log("sunclick"));